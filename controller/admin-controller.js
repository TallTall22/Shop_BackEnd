const {User,Product,Category,Order,Cart}=require('../models')
const {imgurHandler}=require('../helpers/file-helper')
const adminController={
  getProducts:(req,res,next)=>{
    Promise.all([
      Product.findAll({
        where:{isSelling:true},
        include:Category,
        raw:true,
        nest:true
      }),
      Product.findAll({
        where:{isSelling:false},
        include:Category,
        raw:true,
        nest:true
      })
    ])
    .then(([sellingProducts,unsellingProducts])=>res.json({status:'success',sellingProducts,unsellingProducts}))
    .catch(err=>next(err))
  },
  getProduct:(req,res,next)=>{
    const id=req.params.id
    Product.findByPk(id,{
      raw:true,
      nest:true,
      include:Category
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
    const {name,price,description,quantity,categoryId,isSelling}=req.body
    const {file}=req
    if(!name||!price) throw new Error('Name and Price are required')
    imgurHandler(file)
    .then(filePath=>{
      Product.create({
      name,
      price,
      description,
      quantity,
      categoryId,
      isSelling,
      image:filePath||null
    }) 
    })
    .then(createdProduct=>res.json({status:'success',product:createdProduct}))
    .catch(err=>next(err))
  },
  editProduct:(req,res,next)=>{
    const id=req.params.id
    Promise.all([
      Product.findByPk(id,{
      raw:true,
      nest:true
    }),
    Category.findAll({
      raw:true,
      nest:true
    })
    ])
    .then(([product,categories])=>res.json({status:'success',product,categories}))
    .catch(err=>next(err))
  },
  putProduct:(req,res,next)=>{
    const id=req.params.id
    const {name,price,description,quantity,categoryId,isSelling}=req.body
    const {file}=req
    if(!name||!price) throw new Error('Name and Price are required')
    Promise.all([
      Product.findByPk(id),
      imgurHandler(file)
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
  patchProduct:(req,res,next)=>{
    const id=req.params.id
    Product.findByPk(id)
    .then(product=>{
      if(!product)throw new Error('The product is not exist')
      return product.update({isSelling:!product.isSelling})
    })
    .then(product=>res.json({status:'success',product}))
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
  },
  getOrders:(req,res,next)=>{
    Order.findAll({
      raw:true,
      nest:true,
      include:User
    })
    .then(orders=>res.json({status:'success',orders}))
    .catch(err=>next(err))
  },
  getOrder:(req,res,next)=>{
    const id=req.params.id
    Promise.all([
      Order.findByPk(id,{
        raw:true,
        nest:true
      }),
      Cart.findAll({
        where:{
          orderId:id
        },
        raw:true,
        nest:true
      })
    ])
      .then(([order,carts])=>{
        res.json({status:'success',order,carts})
      })
    .catch(err=>next(err))
  },
  patchOrder:(req,res,next)=>{
    const id=req.params.id
    Order.findByPk(id)
    .then(order=>{
      if(!order)throw new Error('The order is not exist')
      return order.update({isSent:true})
    })
    .then(order=>res.json({status:'success',order}))
    .catch(err=>next(err))
  }
}

module.exports=adminController