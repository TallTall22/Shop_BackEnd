const {Product, Category, Cart, User} = require('../models');
const {getOffset, getPagination} = require('../helpers/pagination-helper');
const { Op } = require('sequelize');

const productController = {
  // 取得產品列表
  getProducts: (req, res, next) => {
    DEFAULT_LIMIT = 9;
    const order = req.query.order || 'id';
    const categoryId = Number(req.query.categoryId) || '';
    const minPrice = Number(req.query.minPrice) || 0;
    const maxPrice = Number(req.query.maxPrice) || '';
    const keyword = req.query.keyword || '';
    const limit = Number(req.query.limit) || DEFAULT_LIMIT;
    const page = Number(req.query.page) || 1;
    const offset = getOffset(limit, page);

    Promise.all([
      // 查詢符合條件的產品列表
      Product.findAndCountAll({
        where: {
          [Op.and]: [
            categoryId ? {categoryId} : {},
            {isSelling: true},
            keyword ? {
              [Op.or]: [
                { name: { [Op.like]: `%${keyword}%` } }
              ]
            } : {},
            maxPrice ? {
              price: {
                [Op.between]: [minPrice, maxPrice]
              }
            } : {
              price: {
                [Op.gte]: minPrice
              }
            }
          ]
        },
        include: Category,
        limit,
        offset,
        order: [[order, 'asc']],
        raw: true,
        nest: true
      }),
      // 取得所有產品類別
      Category.findAll({
        raw: true,
        nest: true
      })
    ])
    .then(([products, categories]) => {
      // 標記用戶是否收藏了產品
      const FavoritedProductId = req.user?.FavoritedProduct ? req.user.FavoritedProduct.map(fr => fr.id) : [];
      const data = products.rows.map(r => ({
        ...r,
        isFavorited: FavoritedProductId.includes(r.id)
      }));
      // 回傳結果，包括產品列表、類別和分頁資訊
      res.json({ status: 'success', data, categories, pagination: getPagination(limit, page, products.count) });
    })
    .catch(err => next(err));
  },
  
  // 取得特定ID的產品詳細資訊
  getProduct: (req, res, next) => {
    const id = req.params.id;
    Product.findByPk(id, {
      raw: true,
      nest: true,
      include: Category
    })
    .then(product => {
      // 檢查用戶是否收藏了該產品
      const FavoritedProductId = req.user?.FavoritedProduct ? req.user.FavoritedProduct.map(fr => fr.id) : [];
      const isFavorited = FavoritedProductId.includes(product.id);
      // 回傳產品詳細資訊和是否已收藏
      res.json({ status: 'success', product, isFavorited });
    })
    .catch(err => next(err));
  },
  
  // 查詢銷售量最高的產品
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
      carts.forEach(cart => {
        const { productId, quantity } = cart;
        if (!productSales[productId]) {
          productSales[productId] = 0;
        }
        productSales[productId] += quantity;
      });

      // 將銷售數量轉換為陣列，並根據銷售量排序
      const productSalesArray = Object.keys(productSales).map(productId => ({
        productId: parseInt(productId, 10),
        sales: productSales[productId]
      })).sort((a, b) => b.sales - a.sales);

      // 取得銷售量最高的前十個商品的詳細資訊
      const popularProductIds = productSalesArray.slice(0, 10).map(item => item.productId);
      const popularProducts = await Promise.all(popularProductIds.map(async productId =>
        Product.findByPk(productId, {
          include: Category,
          raw: true,
          nest: true
        })
      ));

      // 回傳銷售量最高的商品列表
      res.json({ status: 'success', products: popularProducts });
    } catch (err) {
      next(err);
    }
  },

  // 查詢男性用戶購買最多的產品
  getManPopularProduct: async (req, res, next) => {
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

      // 將銷售數量轉換為陣列，並根據銷售量排序
      const productSalesArray = Object.keys(productSales).map(productId => ({
        productId: parseInt(productId, 10),
        sales: productSales[productId]
      })).sort((a, b) => b.sales - a.sales);

      // 取得男性用戶購買最多的前十個商品的詳細資訊
      const popularProductIds = productSalesArray.slice(0, 10).map(item => item.productId);
      const popularProducts = await Promise.all(popularProductIds.map(async productId =>
        Product.findByPk(productId, {
          include: Category,
          raw: true,
          nest: true
        })
      ));

      // 回傳男性用戶購買最多的商品列表
      res.json({ status: 'success', products: popularProducts });
    } catch (err) {
      next(err);
    }
  },
  
  // 查詢女性用戶購買最多的產品
  getWomanPopularProduct: async (req, res, next) => {
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
      
        // 只計算女性使用者購買的商品銷售總量
        if (gender === '女') {
          if (!productSales[productId]) {
            productSales[productId] = 0;
          }
          productSales[productId] += quantity;
        }
      });

      // 將銷售數量轉換為陣列，並根據銷售量排序
      const productSalesArray = Object.keys(productSales).map(productId => ({
        productId: parseInt(productId, 10),
        sales: productSales[productId]
      })).sort((a, b) => b.sales - a.sales);

      // 取得女性用戶購買最多的前十個商品的詳細資訊
      const popularProductIds = productSalesArray.slice(0, 10).map(item => item.productId);
      const popularProducts = await Promise.all(popularProductIds.map(async productId =>
        Product.findByPk(productId, {
          include: Category,
          raw: true,
          nest: true
        })
      ));

      // 回傳女性用戶購買最多的商品列表
      res.json({ status: 'success', products: popularProducts });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = productController;
