const express=require('express')
const router=express.Router()
const {ErrorHandler}=require('../middleware/error-handler')
const user=require('./modules/user')
const admin=require('./modules/admin')

router.use('/users',user)
router.use('/admin',admin)
router.use('/',ErrorHandler)
module.exports=router