const express=require('express')
const router=express.Router()
const adminController=require('../../controller/admin-controller')
const upload =require('../../middleware/multer')
//users
router.get('/users',adminController.getUsers)

//category
router.get('/categories',adminController.getCategories)
router.post('/categories',adminController.postCategory)

//product
router.get('/products/create',adminController.createProduct)
router.get('/products/:id/edit',adminController.editProduct)
router.get('/products/:id',adminController.getProduct)
router.put('/products/:id',upload.single('image'),adminController.putProduct)
router.patch('/products/:id',adminController.patchProduct)
router.delete('/products/:id',adminController.deleteProduct)
router.post('/products',upload.single('image'),adminController.postProduct)
router.get('/products',adminController.getProducts)

//order
router.get('/orders',adminController.getOrders)
router.get('/orders/:id',adminController.getOrder)
router.patch('/orders/:id',adminController.patchOrder)

module.exports=router