const express=require('express')
const router=express.Router()
const passport=require('passport')
const userController=require('../../controller/user-controller')
const {publicAuthenticated,authenticated}=require('../../middleware/auth')

router.post('/signup',userController.signUp)
router.post('/signin',passport.authenticate('local',{session:false}),userController.signIn)
router.get('/',publicAuthenticated,userController.getUser)
router.delete('/favorites/:productId',authenticated,userController.deleteFavorite)
router.post('/favorites',authenticated,userController.addFavorite)
router.get('/favorites',authenticated,userController.getFavorites)
router.get('/orders',authenticated,userController.getOrders)

module.exports=router