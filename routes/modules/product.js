const express=require('express')
const router=express.Router()
const productController = require('../../controller/product-controller')
const {publicAuthenticated}=require('../../middleware/auth')

router.get('/',publicAuthenticated,productController.getProducts)
router.get('/:id',publicAuthenticated,productController.getProduct)

module.exports=router