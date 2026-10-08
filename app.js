require('dotenv').config();

const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const port = Number.parseInt(process.env.PORT, 10) || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/api', apiRoutes);
app.use('/', productRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  if (res.headersSent) return next(error);
  res.status(500).render('error', {
    title: 'Lỗi máy chủ',
    message: 'Đã xảy ra lỗi khi xử lý yêu cầu.'
  });
});

async function start() {
  await connectDB();
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

if (require.main === module) {
  start().catch((error) => {
    console.error('Unable to start application:', error.message);
    process.exitCode = 1;
  });
}

module.exports = app;
