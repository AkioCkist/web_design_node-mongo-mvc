const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên sản phẩm là bắt buộc'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'Giá sản phẩm là bắt buộc'],
      min: [0, 'Giá không được âm']
    },
    stock: {
      type: Number,
      required: [true, 'Tồn kho là bắt buộc'],
      min: [0, 'Tồn kho không được âm'],
      validate: {
        validator: Number.isInteger,
        message: 'Tồn kho phải là số nguyên'
      }
    },
    description: {
      type: String,
      trim: true,
      default: ''
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Danh mục là bắt buộc']
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
