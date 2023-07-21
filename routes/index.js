const express=require('express')
const router=express.Router()
const {ErrorHandler}=require('../middleware/error-handler')
const user=require('./modules/user')
const admin=require('./modules/admin')
const product=require('./modules/product')

router.use('/products',product)
router.use('/users',user)
router.use('/admin',admin)
router.use('/',ErrorHandler)
module.exports=router