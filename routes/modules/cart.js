const express=require('express')
const router=express.Router()
const cartControlller=require('../../controller/cart-controller')

router.post('/linePay',cartControlller.linePayOrder)
router.get('/linePay/confirm',cartControlller.confirmLinePayOrder)
router.post('/create',cartControlller.createCart)
router.delete('/:cartId',cartControlller.deleteCart)
router.patch('/:cartId',cartControlller.patchCart)
router.put('/:orderId',cartControlller.checkOrder)
router.get('/',cartControlller.getOrder)

module.exports=router