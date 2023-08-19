const passport=require('passport')
const LocalStrategy=require('passport-local').Strategy
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passportJWT=require('passport-jwt')
const bcrypt=require('bcryptjs')
const {User,Product}=require('../models')

module.exports=app=>{
  app.use(passport.initialize())
  app.use(passport.session())

  passport.use(new LocalStrategy({
    usernameField:'account'
  },
  (account, password, cb)=> {
    User.findOne({ where: {account} })
      .then(user=> {
      if (!user) {
         return cb(null, false,{message:'Account name or password is incorrect'})
         }
      return bcrypt.compare(password,user.password).then(isMatch=>{
        if(!isMatch) {
          return cb(null, false,{message:'Account name  or password is incorrect'})
        }
        return cb(null,user)
      })
    });
  }
))

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret:process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "https://main.d2n2j6lp46litu.amplifyapp.com/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {
    return;
  }
));

const JWTStrategy = passportJWT.Strategy
const ExtractJwt = passportJWT.ExtractJwt
const jwtOption = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
}

const jwtStrategy=new JWTStrategy(jwtOption,(jwtPayload,cb)=>{
    User.findByPk(jwtPayload.id,{
      include:{model:Product,as:'FavoritedProduct'}
    })
    .then(user=>cb(null,user))
    .catch(err=>cb(err))
})

passport.use(jwtStrategy)
}