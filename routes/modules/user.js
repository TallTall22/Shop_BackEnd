const express=require('express')
const router=express.Router()
const passport=require('passport')
const userController=require('../../controller/user-controller')
const {authenticated}=require('../../middleware/auth')

router.post('/signup',userController.signUp)
router.post('/signin',passport.authenticate('local',{session:false}),userController.signIn)
router.delete('/favorites/:productId',authenticated,userController.deleteFavorite)
router.post('/favorites',authenticated,userController.addFavorite)
router.get('/favorites',authenticated,userController.getFavorites)

module.exports=router