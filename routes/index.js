const express=require('express')
const router=express.Router()
const {ErrorHandler}=require('../middleware/error-handler')
const user=require('./modules/user')

router.use('/users',user)
router.use('/',ErrorHandler)
module.exports=router