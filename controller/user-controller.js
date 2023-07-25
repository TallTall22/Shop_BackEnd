const {User,Favorite,Product,Order,Cart}=require('../models')
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
  signIn: (req, res, next) => {
    try {
      const userData=req.user.toJSON()
      delete userData.password
      const token = jwt.sign(userData, process.env.JWT_SECRET, { expiresIn: '30d' })
      res.json({
        status: 'success',
        data: {
          user: userData,
          token
        }
      })
    }
    catch (err) {
      next(err)
    }
  },
  getUser:(req,res,next)=>{
    const user=req.user
    if(!user) return res.json({status:'unAuthenticated',user:{isAdmin:false}}) 
    User.findByPk(user.id)
    .then(user=>res.json({status:'success',user}))
    .catch(err=>next(err))
  },
  addFavorite:(req,res,next)=>{
    const {productId}=req.body
    const user=req.user
    Favorite.findOne({
      where:{
        userId:user.id,
        productId
      },
      raw:true,
      nest:true
    })
    .then(favorite=>{
      if(!productId) throw new Error('The product is not existed')
      if(favorite) throw new Error('You have favorited this product')
      return Favorite.create({
        userId:user.id,
        productId
      })
    })
    .then(favorite=>res.json({status:'success',favorite}))
    .catch(err=>next(err))
  },
  deleteFavorite:(req,res,next)=>{
    const {productId}=req.params
    const user=req.user
    Favorite.findOne({
      where:{
        userId:user.id,
        productId
      }
    })
    .then(favorite=>{
      if(!favorite) throw new Error("You haven't favorited this product")
      return favorite.destroy()
    })
    .then(deletedFavorite=>res.json({status:'success',favorite:deletedFavorite}))
    .catch(err=>next(err))
  },
  getFavorites:(req, res, next)=>{
    const user=req.user
    const FavoritedProduct=user.FavoritedProduct
    if(!FavoritedProduct[0]) return res.json({status:'success',message:'您還沒有收藏任何商品!'})
    return res.json({status:'success',FavoritedProduct})
  },
  getOrders:async(req,res,next)=>{
    const user=req.user
    try{
      const orders=await Order.findAll({
      where:{
        isCheck:true,
        userId:user.id
      },
      order:[['updatedAt','desc']],
      raw:true,
      nest:true
    })
    if(!orders[0]) return res.json({status:'success',message:'您還沒有購買紀錄'})
     const ordersWithCarts = await Promise.all(
      orders.map(async order => {
        const carts = await Cart.findAll({
          where: {
            orderId: order.id,
          },
          include:Product
        });
        return { ...order,carts }
      })
    );
    res.json({ status: 'success', orders:ordersWithCarts })
  }catch(err){
    next(err)
  }
}
    
}

module.exports=userController