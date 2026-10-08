const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error('MONGODB_URI chưa được cấu hình trong file .env');
  }

  await mongoose.connect(uri);
  console.log('MongoDB connected successfully');
}

module.exports = connectDB;
