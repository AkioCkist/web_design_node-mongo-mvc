const mongoose = require('mongoose');
const Category = require('../models/Category');
const Product = require('../models/Product');

const PAGE_SIZE = 10;

function parsePositiveInteger(value, fallback) {
  const parsed = Number.parseInt(value, 10);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function buildQueryString(query, overrides = {}) {
  const params = new URLSearchParams({
    category: query.category || '',
    sort: query.sort || '',
    maxPrice: query.maxPrice || '',
    ...overrides
  });
  return params.toString();
}

exports.index = async (req, res, next) => {
  try {
    const page = parsePositiveInteger(req.query.page, 1);
    const { category, sort, maxPrice } = req.query;
    const filter = {};

    if (category) {
      if (!mongoose.isValidObjectId(category)) {
        return res.status(400).render('error', {
          title: 'Yêu cầu không hợp lệ',
          message: 'Danh mục không hợp lệ.'
        });
      }
      filter.categoryId = category;
    }

    if (maxPrice !== undefined && maxPrice !== '') {
      const parsedMaxPrice = Number(maxPrice);
      if (!Number.isFinite(parsedMaxPrice) || parsedMaxPrice < 0) {
        return res.status(400).render('error', {
          title: 'Yêu cầu không hợp lệ',
          message: 'Giá tối đa phải là một số không âm.'
        });
      }
      filter.price = { $lte: parsedMaxPrice };
    }

    const sortOption = sort === 'asc' ? { price: 1 } : sort === 'desc' ? { price: -1 } : {};
    const [products, categories, total] = await Promise.all([
      Product.find(filter)
        .populate('categoryId')
        .sort(sortOption)
        .skip((page - 1) * PAGE_SIZE)
        .limit(PAGE_SIZE)
        .lean(),
      Category.find().sort({ name: 1 }).lean(),
      Product.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(total / PAGE_SIZE);
    const currentPage = Math.min(page, Math.max(totalPages, 1));

    res.render('products/index', {
      title: 'Danh sách sản phẩm',
      products,
      categories,
      currentPage,
      totalPages,
      query: req.query,
      buildQueryString
    });
  } catch (error) {
    next(error);
  }
};

exports.newForm = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.render('products/new', { title: 'Thêm sản phẩm', categories, product: {} });
  } catch (error) {
    next(error);
  }
};

exports.create = async (req, res, next) => {
  try {
    await Product.create(req.body);
    res.redirect('/products');
  } catch (error) {
    next(error);
  }
};

exports.detail = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).render('error', { title: 'Không tìm thấy', message: 'Sản phẩm không tồn tại.' });
    }
    const product = await Product.findById(req.params.id).populate('categoryId').lean();
    if (!product) {
      return res.status(404).render('error', { title: 'Không tìm thấy', message: 'Sản phẩm không tồn tại.' });
    }
    res.render('products/detail', { title: product.name, product });
  } catch (error) {
    next(error);
  }
};

exports.editForm = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).render('error', { title: 'Không tìm thấy', message: 'Sản phẩm không tồn tại.' });
    }
    const [product, categories] = await Promise.all([
      Product.findById(req.params.id).lean(),
      Category.find().sort({ name: 1 }).lean()
    ]);
    if (!product) {
      return res.status(404).render('error', { title: 'Không tìm thấy', message: 'Sản phẩm không tồn tại.' });
    }
    res.render('products/edit', { title: 'Sửa sản phẩm', product, categories });
  } catch (error) {
    next(error);
  }
};

exports.update = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).render('error', { title: 'Không tìm thấy', message: 'Sản phẩm không tồn tại.' });
    }
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!product) {
      return res.status(404).render('error', { title: 'Không tìm thấy', message: 'Sản phẩm không tồn tại.' });
    }
    res.redirect('/products');
  } catch (error) {
    next(error);
  }
};

exports.delete = async (req, res, next) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(404).render('error', { title: 'Không tìm thấy', message: 'Sản phẩm không tồn tại.' });
    }
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).render('error', { title: 'Không tìm thấy', message: 'Sản phẩm không tồn tại.' });
    }
    res.redirect('/products');
  } catch (error) {
    next(error);
  }
};
