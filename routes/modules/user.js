const express=require('express')
const router=express.Router()
const passport=require('passport')
const userController=require('../../controller/user-controller')

router.post('/signup',userController.signUp)
router.post('/signin',passport.authenticate('local',{session:false}),userController.signIn)

module.exports=router