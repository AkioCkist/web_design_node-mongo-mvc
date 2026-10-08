const Product = require('../models/Product');

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('categoryId', 'name')
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
};
