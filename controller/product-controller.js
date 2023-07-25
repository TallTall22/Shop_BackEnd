const {Product,Category,Cart,User}=require('../models')
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
      order:[[order,'asc']],
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
    .then(product=>{
      const FavoritedProductId=req.user?.FavoritedProduct?req.user.FavoritedProduct.map(fr=>fr.id):[]
      const isFavorited=FavoritedProductId.includes(product.id)
      res.json({status:'success',product,isFavorited})
    })
    .catch(err=>next(err))
  },
  getPopularProduct: async (req, res, next) => {
  try {
    // 取得所有購物車記錄
    const carts = await Cart.findAll({
      include: [Product], 
      raw: true,
      nest: true
    });

    // 計算每個商品的銷售總數量
    const productSales = {};
    await carts.forEach(cart => {
      const { productId, quantity } = cart;
      if (!productSales[productId]) {
        productSales[productId] = 0;
      }
      productSales[productId] += quantity;
    });

    // 將 productSales 轉換為包含商品ID和銷量的陣列
    const productSalesArray = Object.keys(productSales).map(productId => ({
      productId: parseInt(productId, 10),
      sales: productSales[productId]
    }));

    // 根據銷量排序，找出銷量最多的前十個商品ID
    const popularProductIds = productSalesArray
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)
      .map(item => item.productId);

    // 根據商品ID查詢商品的詳細資料，並保持銷量排序
    const popularProducts = await Promise.all(popularProductIds.map(async productId =>
      Product.findByPk(productId, {
        include:Category,
        raw: true,
        nest: true
      })
    ));

    return res.json({ status: 'success', products:popularProducts });
  } catch (err) {
    next(err);
  }
},
  getManPopularProduct:async(req,res,next)=>{
  try {
    // 取得所有購物車記錄
    const carts = await Cart.findAll({
      include: [Product, User],
      raw: true,
      nest: true
    });

    // 計算每個商品的銷售總數量
    const productSales = {};
    carts.forEach(cart => {
      const { productId, quantity, User: { gender } } = cart;
      
      // 只計算男性使用者購買的商品銷售總量
      if (gender === '男') {
        if (!productSales[productId]) {
          productSales[productId] = 0;
        }
        productSales[productId] += quantity;
      }
    });

    // 將 productSales 轉換為包含商品ID和銷量的陣列
    const productSalesArray = Object.keys(productSales).map(productId => ({
      productId: parseInt(productId, 10),
      sales: productSales[productId]
    }));

    // 根據銷量排序，找出銷量最多的前十個商品ID
    const popularProductIds = productSalesArray
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)
      .map(item => item.productId);

    // 根據商品ID查詢商品的詳細資料，並保持銷量排序
    const popularProducts = await Promise.all(popularProductIds.map(async productId =>
      Product.findByPk(productId, {
        include:Category,
        raw: true,
        nest: true
      })
    ));
    res.json({ status: 'success',products:popularProducts });
  } catch (err) {
    next(err);
  }
},
getWomanPopularProduct:async(req,res,next)=>{
  try {
    // 取得所有購物車記錄
    const carts = await Cart.findAll({
      include: [Product, User],
      raw: true,
      nest: true
    });

    // 計算每個商品的銷售總數量
    const productSales = {};
    carts.forEach(cart => {
      const { productId, quantity, User: { gender } } = cart;
      
      // 只計算男性使用者購買的商品銷售總量
      if (gender === '女') {
        if (!productSales[productId]) {
          productSales[productId] = 0;
        }
        productSales[productId] += quantity;
      }
    });

    // 將 productSales 轉換為包含商品ID和銷量的陣列
    const productSalesArray = Object.keys(productSales).map(productId => ({
      productId: parseInt(productId, 10),
      sales: productSales[productId]
    }));

    // 根據銷量排序，找出銷量最多的前十個商品ID
    const popularProductIds = productSalesArray
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 10)
      .map(item => item.productId);

    // 根據商品ID查詢商品的詳細資料，並保持銷量排序
    const popularProducts = await Promise.all(popularProductIds.map(async productId =>
      Product.findByPk(productId, {
        include:Category,
        raw: true,
        nest: true
      })
    ));
    res.json({ status: 'success', products:popularProducts });
  } catch (err) {
    next(err);
  }
}
  
}

module.exports=productController