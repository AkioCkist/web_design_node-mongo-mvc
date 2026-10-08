const express = require('express');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', (req, res) => res.redirect('/products'));
router.get('/products', productController.index);
router.get('/products/new', productController.newForm);
router.post('/products', productController.create);
router.get('/products/:id', productController.detail);
router.get('/products/edit/:id', productController.editForm);
router.post('/products/edit/:id', productController.update);
router.post('/products/delete/:id', productController.delete);

module.exports = router;
