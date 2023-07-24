const {Order,Cart,Product}=require('../models')
const Sequelize=require('sequelize')

const cartControlller={
 getOrder:async(req,res,next)=>{
  const user=req.user
  try{
    const order=await Order.findOne({
    where:{
      userId:user.id,
      isCheck:false
    },
    raw:true,
    nest:true
  })
  if(!order) return res.json({status:'success',message:'您的購物車還沒有任何商品喔!'})
  const carts=await Cart.findAll({
    where:{
      orderId:order.id
    },
    include:Product,
    order:[['productId','asc']],
    raw:true,
    nest:true
  })
  if(!carts) return res.json({status:'success',message:'您的購物車還沒有任何商品喔!'})
  let amount=0
  carts.forEach(cart=>{
    amount += cart.Product.price * cart.quantity;
  })
  return res.json({status:'success',order,carts,amount})
  }catch(err){
    next(err)
  }
 },
 createCart:async(req,res,next)=>{
  const user=req.user
  const {productId}=req.body
  try{
    const order=await Order.findOne({
    where:{
      userId:user.id,
      isCheck:false
    },
    raw:true,
    nest:true
  })
  if(order){
      const cart=await Cart.findOne({
        where:{
          userId:user.id,
          productId,
          orderId:order.id
        },
          raw:true,
          nest:true
      })
  if (cart) return res.json({status:'success',message:'你已經將此商品加入購物車'})
      const newCart=await Cart.create({
      userId:user.id,
      productId,
      quantity:1,
      orderId:order.id
    })
    return res.json({status:'success',newCart})
  }else{
    const newOrder=await Order.create({
      userId:user.id,
      amount:0,
      isPaid:false,
      isSent:false,
      isCheck:false
    })
     const newCart=await Cart.create({
      userId:user.id,
      productId,
      quantity:1,
      orderId:newOrder.id
    })
    return res.json({status:'success',newCart})
  }  
  }catch(err){
    next(err)
  }
 },
 deleteCart:(req,res,next)=>{
  const {cartId}=req.params
  Cart.findByPk(cartId)
  .then(cart=>{
    if(!cart) throw new Error('The Cart is not Existed')
    return cart.destroy()
  })
  .then(deletedCart=>res.json({status:'success',cart:deletedCart}))
  .catch(err=>next(err))
 },
 patchCart:(req,res,next)=>{
  const {cartId}=req.params
  const {quantity,productId}=req.body
  Promise.all([
    Cart.findByPk(cartId),
    Product.findByPk(productId,{
      raw:true,
      nest:true
    })
  ])
  .then(([cart,product])=>{
    if(!cart) throw new Error('The Cart is not Existed')
    if(quantity>product.quantity) return res.json({status:'success',message:'庫存已見底啦!!!'})
    if(quantity<1) return res.json({status:'success',message:'不能再減啦!!!'})
    return cart.update({quantity})
  })
  .then(patchCart=>res.json({status:'success',cart:patchCart}))
  .catch(err=>next(err))
 },
checkOrder: async (req, res, next) => {
  const { orderId } = req.params;
  const { amount, address, phone,name, paidMethod } = req.body;

  try {
    const [order, carts] = await Promise.all([
      Order.findByPk(orderId),
      Cart.findAll({
        where: {
          orderId: orderId,
        },
        raw: true,
        nest: true,
      }),
    ]);

    if (!order) {
      throw new Error('The order does not exist');
    }

    for (let i = 0; i < carts.length; i++) {
      const { productId, quantity } = carts[i];
      await Product.update(
        { quantity: Sequelize.literal(`quantity - ${quantity}`) }, 
        { where: { id: productId } }
      );
    }

    if (paidMethod === '信用卡') {
      await order.update({ isCheck: true, isPaid: true, amount, address, phone,name, paidMethod });
    } else {
      await order.update({ isCheck: true, amount, address, phone,name, paidMethod });
    }

    return res.json({ status: 'success', order });
  } catch (err) {
    return next(err);
  }
}
}

module.exports=cartControlller