const {User, Favorite, Product, Order, Cart} = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const userController = {
  // 使用者註冊
  signUp: (req, res, next) => {
    const { name, gender, email, password, phone, address, account, confirmPassword } = req.body;

    // 驗證註冊資料
    if (!email) throw new Error('Email is required');
    if (!password) throw new Error('Password is required');
    if (!account) throw new Error('Account name is required');
    if (password !== confirmPassword) throw new Error('The passwords do not match');

    Promise.all([
      // 檢查是否有相同的email或account存在
      User.findOne({ where: { email } }),
      User.findOne({ where: { account } })
    ])
    .then(([emailUser, accountUser]) => {
      if (emailUser) throw new Error('The email is already signed up');
      if (accountUser) throw new Error('The account name is already signed up');
      return bcrypt.hash(password, 10);
    })
    .then(hash => {
      // 創建新的使用者記錄
      return User.create({
        name,
        gender,
        email,
        password: hash,
        phone,
        address,
        account
      });
    })
    .then(createdUser => res.json({ status: 'success', user: createdUser }))
    .catch(err => next(err));
  },

  // 使用者登入
  signIn: (req, res, next) => {
    try {
      const userData = req.user.toJSON();
      delete userData.password;
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' });

      // 回傳使用者資訊和JWT token
      res.json({
        status: 'success',
        data: {
          user: userData,
          token
        }
      });
    } catch (err) {
      next(err);
    }
  },

  // 取得使用者資訊
  getUser: (req, res, next) => {
    const user = req.user;

    // 如果用戶不存在，回傳未驗證狀態
    if (!user) return res.json({ status: 'unAuthenticated', user: { isAdmin: false } });

    // 查詢使用者詳細資訊
    User.findByPk(user.id)
      .then(user => res.json({ status: 'success', user }))
      .catch(err => next(err));
  },

  // 新增收藏商品
  addFavorite: (req, res, next) => {
    const { productId } = req.body;
    const user = req.user;

    Favorite.findOne({
      where: {
        userId: user.id,
        productId
      },
      raw: true,
      nest: true
    })
    .then(favorite => {
      if (!productId) throw new Error('The product is not existed');
      if (favorite) throw new Error('You have favorited this product');

      // 創建新的收藏記錄
      return Favorite.create({
        userId: user.id,
        productId
      });
    })
    .then(favorite => res.json({ status: 'success', favorite }))
    .catch(err => next(err));
  },

  // 刪除收藏商品
  deleteFavorite: (req, res, next) => {
    const { productId } = req.params;
    const user = req.user;

    Favorite.findOne({
      where: {
        userId: user.id,
        productId
      }
    })
    .then(favorite => {
      if (!favorite) throw new Error("You haven't favorited this product");

      // 刪除收藏記錄
      return favorite.destroy();
    })
    .then(deletedFavorite => res.json({ status: 'success', favorite: deletedFavorite }))
    .catch(err => next(err));
  },

  // 取得使用者收藏的商品列表
  getFavorites: (req, res, next) => {
    const user = req.user;
    const FavoritedProduct = user.FavoritedProduct;

    if (!FavoritedProduct[0]) return res.json({ status: 'success', message: '您還沒有收藏任何商品!' });
    return res.json({ status: 'success', FavoritedProduct });
  },

  // 取得使用者的購買紀錄
  getOrders: async (req, res, next) => {
    const user = req.user;

    try {
      // 查詢使用者的購買紀錄
      const orders = await Order.findAll({
        where: {
          isCheck: true,
          userId: user.id
        },
        order: [['updatedAt', 'desc']],
        raw: true,
        nest: true
      });

      // 如果沒有購買紀錄，回傳訊息
      if (!orders[0]) return res.json({ status: 'success', message: '您還沒有購買紀錄' });

      // 查詢每筆購買紀錄的商品資訊
      const ordersWithCarts = await Promise.all(
        orders.map(async order => {
          const carts = await Cart.findAll({
            where: {
              orderId: order.id,
            },
            include: Product
          });
          return { ...order, carts };
        })
      );

      // 回傳購買紀錄與商品資訊
      res.json({ status: 'success', orders: ordersWithCarts });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = userController;
