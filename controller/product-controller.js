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
      const FavoritedProductId=req.user?.FavoritedProduct?req.user.FavoritedProduct.map(fr=>fr.id):[]
      const data=products.rows.map(r=>({
        ...r,
        isFavorited:FavoritedProductId.includes(r.id)
      }))
      res.json({status:'success',data,categories,pagination:getPagination(limit,page,products.count)})
    })
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
  }
}

module.exports=productController