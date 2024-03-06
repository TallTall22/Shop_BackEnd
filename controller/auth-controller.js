const { google } = require('googleapis');
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const authController = {
  // Google 認證處理
  googleAuth: async (req, res, next) => {
    try {
      const authCode = req.query.code;

      // 使用授權碼換取訪問權杖
      const client = new google.auth.OAuth2({
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        redirectUri: 'https://main.d2s608lr9z6qmo.amplifyapp.com/auth/google/callback',
      });

      const { tokens } = await client.getToken(authCode);
      client.setCredentials(tokens);

      // 使用 service 物件來取得 Google 使用者資訊
      const oauth2 = google.oauth2({
        auth: client,
        version: 'v2',
      });

      const { data: userData } = await oauth2.userinfo.get();

      const { name, email } = userData;
      const user = await User.findOne({ where: { email } });

      if (!user) {
        // 若使用者不存在，創建新使用者
        const randomPassword = Math.random().toString(36).slice(-8);
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(randomPassword, salt);
        const newUser = await User.create({
          name,
          account: name,
          email,
          password: hash,
        });

        // 建立使用者 payload
        const userPayload = {
          id: newUser.id,
          name: newUser.name,
          account: newUser.account,
          email: newUser.email,
          isAdmin: false,
          createdAt: newUser.createdAt,
          updatedAt: newUser.updatedAt,
        };

        // 建立 JWT token
        const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '30d' });
        return res.json({
          status: 'success',
          data: {
            user: userPayload,
            token,
          },
        });
      } else {
        // 若使用者已存在，建立使用者 payload
        const userPayload = {
          id: user.id,
          name: user.name,
          account: user.account,
          email: user.email,
          isAdmin: user.isAdmin,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt,
        };

        // 建立 JWT token
        const token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '30d' });
        return res.json({
          status: 'success',
          data: {
            user: userPayload,
            token,
          },
        });
      }
    } catch (error) {
      next(error);
    }
  },
};

module.exports = authController;
