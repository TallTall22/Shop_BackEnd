const express=require('express')
const router=express.Router()
const adminController=require('../../controller/admin-controller')

//users
router.get('/users',adminController.getUsers)

//category
router.get('/categories',adminController.getCategories)
router.post('/categories',adminController.postCategory)

//product
router.get('/products/create',adminController.createProduct)
router.get('/products/:id/edit',adminController.editProduct)
router.get('/products/:id',adminController.getProduct)
router.put('/products/:id',adminController.putProduct)
router.delete('/products/:id',adminController.deleteProduct)
router.post('/products',adminController.postProduct)
router.get('/products',adminController.getProducts)

module.exports=router