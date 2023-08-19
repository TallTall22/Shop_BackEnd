const express=require('express')
const router=express.Router()
const passport=require('passport')
const authController=require('../../controller/auth-controller')

router.get('/google',passport.authenticate('google',{scope:['email','profile']}))
router.get('/google/callback',authController.googleAuth)

module.exports=router