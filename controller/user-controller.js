const {User}=require('../models')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')

const userController={
  signUp:(req,res,next)=>{
    const {name,gender,email,password,phone,address,account,confirmPassword}=req.body
    if(!email) throw new Error('Email is required')
    if(!password) throw new Error('Password is required')
    if(!account) throw new Error('Account name is required')
    if(password!==confirmPassword) throw new Error('The password are not match')
    Promise.all([
      User.findOne({where:{email}}),
      User.findOne({where:{account}})
    ])
    .then(([email,account])=>{
      if(email) throw new Error('The email is already signed up')
      if(account) throw new Error('The account name is already signed up')
      return bcrypt.hash(password,10)
    })
      .then(hash=>{
        return User.create({
          name,
          gender,
          email,
          password:hash,
          phone,
          address,
          account
        })
      })
      .then(createdUser=>res.json({status:'success',user:createdUser}))
      .catch(err=>next(err))
  },
  signIn:(req,res,next)=>{
    try{
      const userData=req.user.toJSON()
      delete userData.password
      const token=jwt.sign(userData,process.env.JWT_SECRET,{expiresIn:'30d'})
      res.json({
        status:'success',
        data:{
          user:userData,
          token
        }
      })
    }catch(err){
      next(err)
    }
  }
}

module.exports=userController