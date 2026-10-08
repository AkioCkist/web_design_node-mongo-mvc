require('dotenv').config();

const connectDB = require('./config/db');
const Category = require('./models/Category');
const Product = require('./models/Product');

const categories = [
  { name: 'Điện thoại' },
  { name: 'Laptop' },
  { name: 'Phụ kiện' },
  { name: 'Âm thanh' }
];

const products = [
  {
    name: 'iPhone 15 Pro',
    price: 27990000,
    stock: 12,
    description: 'Điện thoại cao cấp với chip A17 Pro.',
    categoryName: 'Điện thoại'
  },
  {
    name: 'Samsung Galaxy S24',
    price: 21990000,
    stock: 18,
    description: 'Smartphone Android màn hình Dynamic AMOLED.',
    categoryName: 'Điện thoại'
  },
  {
    name: 'MacBook Air M3',
    price: 28990000,
    stock: 8,
    description: 'Laptop mỏng nhẹ dùng chip Apple M3.',
    categoryName: 'Laptop'
  },
  {
    name: 'Dell XPS 13',
    price: 24990000,
    stock: 6,
    description: 'Laptop Windows nhỏ gọn cho công việc và học tập.',
    categoryName: 'Laptop'
  },
  {
    name: 'Bàn phím cơ Keychron K2',
    price: 1890000,
    stock: 25,
    description: 'Bàn phím cơ không dây layout 75%.',
    categoryName: 'Phụ kiện'
  },
  {
    name: 'Chuột Logitech MX Master 3S',
    price: 1990000,
    stock: 30,
    description: 'Chuột công thái học cho người dùng chuyên nghiệp.',
    categoryName: 'Phụ kiện'
  },
  {
    name: 'Tai nghe Sony WH-1000XM5',
    price: 8490000,
    stock: 14,
    description: 'Tai nghe chống ồn chủ động chất lượng cao.',
    categoryName: 'Âm thanh'
  },
  {
    name: 'Loa JBL Charge 5',
    price: 3290000,
    stock: 20,
    description: 'Loa Bluetooth chống nước cho các chuyến đi.',
    categoryName: 'Âm thanh'
  }
];

async function seed() {
  try {
    await connectDB();
    await Product.deleteMany({});
    await Category.deleteMany({});

    const createdCategories = await Category.insertMany(categories);
    const categoryIds = new Map(
      createdCategories.map((category) => [category.name, category._id])
    );

    await Product.insertMany(
      products.map(({ categoryName, ...product }) => ({
        ...product,
        categoryId: categoryIds.get(categoryName)
      }))
    );

    console.log(`Seed thành công: ${createdCategories.length} danh mục, ${products.length} sản phẩm.`);
  } catch (error) {
    console.error('Seed thất bại:', error.message);
    process.exitCode = 1;
  } finally {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
  }
}

seed();
