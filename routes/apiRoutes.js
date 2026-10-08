const express = require('express');
const apiProductController = require('../controllers/apiProductController');

const router = express.Router();

router.get('/products', apiProductController.getProducts);

module.exports = router;
