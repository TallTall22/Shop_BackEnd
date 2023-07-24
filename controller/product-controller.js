const {Product,Category}=require('../models')
const {getOffset,getPagination}=require('../helpers/pagination-helper')
const { Op } = require('sequelize')
const productController={
  getProducts:(req,res,next)=>{
    DEFAULT_LIMIT=9
    const order=req.query.order||'id'
    const categoryId=Number(req.query.categoryId)||''
    const minPrice=Number(req.query.minPrice)||0
    const maxPrice=Number(req.query.maxPrice)||''
    const keyword=req.query.keyword||''
    const limit=Number(req.query.limit)||DEFAULT_LIMIT
    const page=Number(req.query.page)||1
    const offset=getOffset(limit,page)
    Promise.all([
      Product.findAndCountAll({
      where:{
        [Op.and]:[
          categoryId?{categoryId}:{},
          {isSelling:true},
          keyword
          ?{
            [Op.or]:[
              { name: { [Op.like]: `%${keyword}%` } }
            ]
          }: {},
          maxPrice
          ?{
            price:{
              [Op.between]:[minPrice,maxPrice]
            }
          }:{
            price:{
              [Op.gte]:minPrice
            }
          }
        ]
      },
      include:Category,
      limit,
      offset,
      order:[[`${order}`,'asc']],
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