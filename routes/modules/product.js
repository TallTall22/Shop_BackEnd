const express=require('express')
const router=express.Router()
const productController = require('../../controller/product-controller')
const {publicAuthenticated}=require('../../middleware/auth')

router.get('/populars/man',productController.getManPopularProduct)
router.get('/populars/woman',productController.getWomanPopularProduct)
router.get('/populars',productController.getPopularProduct)
router.get('/:id',publicAuthenticated,productController.getProduct)
router.get('/',publicAuthenticated,productController.getProducts)
module.exports=router