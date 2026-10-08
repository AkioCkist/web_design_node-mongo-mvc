const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Tên danh mục là bắt buộc'],
      trim: true,
      unique: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
