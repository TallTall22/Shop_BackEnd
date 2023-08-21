const { HmacSHA256 } = require('crypto-js')
const Base64=require('crypto-js/enc-base64')
const {Order,Cart,Product}=require('../models')
const Sequelize=require('sequelize')
const axios=require('axios')

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
     next(err);
  }
},
linePayOrder:async(req,res,next)=>{
  const { orderId } = req.body;
  try{
    const order=await Order.findByPk(orderId,{
    raw:true,
    nest:true
  })
  const carts=await Cart.findAll({
    where:{
      orderId:orderId
    },
    include:Product,
    raw:true,
    nest:true
  })
  const productPackages= await Promise.all(carts.map(c=>({
    id:c.id,
    amount:c.quantity*c.Product.price,
    products:[{
      name:c.Product.name,
      quantity:c.quantity,
      price:c.Product.price
    }]
  })))
  const linePayBody={
    amount:order.amount,
    currency:'TWD',
    packages:productPackages,
    orderId:orderId.toString().padStart(10, '0'),
    redirectUrls:{
      confirmUrl:'https://main.d2n2j6lp46litu.amplifyapp.com/linepay/confirm',
      cancelUrl:'https://main.d2n2j6lp46litu.amplifyapp.com/linepay/cancel'
    }
  }

  const uri='/v3/payments/request'
  const headers=cartControlller.createSignature(uri,linePayBody)
  const url='https://sandbox-api-pay.line.me/v3/payments/request'
  const linePayRes=await axios.post(url,linePayBody,{headers})
  if(linePayRes?.data?.returnCode==='0000'){
    const paidUrl=linePayRes.data.info.paymentUrl.web
    return res.json({status:'success',paidUrl:paidUrl})
  }
  }catch(err){
    next(err)
  }
},
confirmLinePayOrder:async(req,res,next)=>{
  const {transactionId,orderId}=req.query
  try{
    const numberOrderId=parseInt(Number(orderId),10)
  const order=await Order.findByPk(numberOrderId)
  const linePayBody={
    amount:order.amount,
    currency:'TWD'
  }
  const uri=`/v3/payments/${transactionId}/confirm`
  const headers=cartControlller.createSignature(uri,linePayBody)
  const url=`https://sandbox-api-pay.line.me/v3/payments/${transactionId}/confirm`
  const linePayRes=await axios.post(url,linePayBody,{headers})
  
 if(linePayRes?.data?.returnCode==='0000'){
    await order.update({isPaid:true})
    return res.json({status:'success',order})
  }
  }catch(err){
    next(err)
  }
},
createSignature:(uri,linePayBody)=>{
  const nonce=new Date().getTime()
  const string=`${process.env.LINE_PAY_SECRET_KEY}${uri}${JSON.stringify(linePayBody)}${nonce}`
  const signature=Base64.stringify(HmacSHA256(string,process.env.LINE_PAY_SECRET_KEY))
  const headers={
    'Content-Type':'application/json',
    'X-LINE-ChannelId':process.env.LINE_PAY_ID,
    'X-LINE-Authorization-Nonce':nonce,
    'X-LINE-Authorization':signature
  }
  return headers
}
}

module.exports=cartControlller