const {User,Product,Category}=require('../models')
const {imgurHandler}=require('../helpers/file-helper')
const adminController={
  getProducts:(req,res,next)=>{
    Product.findAll({
      raw:true,
      nest:true
    })
    .then(products=>res.json({status:'success',products}))
    .catch(err=>next(err))
  },
  getProduct:(req,res,next)=>{
    const id=req.params.id
    Product.findByPk(id,{
      raw:true,
      nest:true
    })
    .then(product=>res.json({status:'success',product}))
    .catch(err=>next(err))
  },
  createProduct:(req,res,next)=>{
    Category.findAll({
      raw:true,
      nest:true
    })
    .then(categories=>res.json({status:'success',categories}))
    .catch(err=>next(err))
  },
  postProduct:(req,res,next)=>{
    const {name,price,description,quantity,image,categoryId,isSelling}=req.body
    if(!name||!price) throw new Error('Name and Price are required')
    imgurHandler(image)
    .then(filePath=>{
      return Product.create({
      name,
      price,
      description,
      quantity,
      image:filePath,
      categoryId,
      isSelling
    }) 
    })
    .then(createdProduct=>res.json({status:'success',product:createdProduct}))
    .catch(err=>next(err))
  },
  editProduct:(req,res,next)=>{
    const id=req.params.id
    Product.findByPk(id,{
      raw:true,
      nest:true
    })
    .then(product=>res.json({status:'success',product}))
    .catch(err=>next(err))
  },
  putProduct:(req,res,next)=>{
    const id=req.params.id
    const {name,price,description,quantity,image,categoryId,isSelling}=req.body
    if(!name||!price) throw new Error('Name and Price are required')
    Promise.all([
      Product.findByPk(id),
      imgurHandler(image)
    ])
    .then(([product,filePath])=>{
      return product.update({
      name,
      price,
      description,
      quantity,
      image:filePath||product.image,
      categoryId,
      isSelling
    }) 
    })
    .then(ediitedProduct=>res.json({status:'success',product:ediitedProduct}))
    .catch(err=>next(err))
  },
  deleteProduct:(req,res,next)=>{
    const id=req.params.id
    Product.findByPk(id)
    .then(product=>{
      if(!product) throw new Error('The product is not Existed')
      return product.destroy()
    })
    .then(deletedproduct=>res.json({status:'success',product:deletedproduct}))
    .catch(err=>next(err))
  },
  getUsers:(req,res,next)=>{
    User.findAll({
      raw:true,
      nest:true
    })
    .then(users=>res.json({status:'success',users}))
    .catch(err=>next(err))
  },
  getCategories:(req,res,next)=>{
    Category.findAll({
      raw:true,
      nest:true
    })
    .then(categories=>res.json({status:'success',categories}))
    .catch(err=>next(err))
  },
  postCategory:(req,res,next)=>{
    const {name}=req.body
    if(!name)throw new Error('Name is required')
    return Category.create({
      name
    })
    .then(category=>res.json({status:'success',category}))
    .catch(err=>next(err))
  }
}

module.exports=adminController