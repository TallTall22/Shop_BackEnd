const {Product,Category}=require('../models')
const {getOffset,getPagination}=require('../helpers/pagination-helper')
const productController={
  getProducts:(req,res,next)=>{
    DEFAULT_LIMIT=9
    const categoryId=Number(req.query.categoryId)||''
    const limit=Number(req.query.limit)||DEFAULT_LIMIT
    const page=Number(req.query.page)||1
    const offset=getOffset(limit,page)
    Promise.all([
      Product.findAndCountAll({
      where:{
        ...categoryId?{categoryId}:{},
        isSelling:true
      },
      include:Category,
      limit,
      offset,
      raw:true,
      nest:true
    }),
    Category.findAll({
      raw:true,
      nest:true
    })
    ])
    .then(([products,categories])=>{
      res.json({status:'success',products,categories,pagination:getPagination(limit,page,products.count)})
    })
    .catch(err=>next(err))
  }
}

module.exports=productController