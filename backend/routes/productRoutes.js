const express = require('express');
const { createProduct, updateProductState, transferProductOwnership, getProduct } = require('../controllers/productController');
const router = express.Router();


router.post('/create', createProduct);
router.put('/updateState/:productId', updateProductState);
router.put('/transferOwnership/:productId', transferProductOwnership);
router.get('/:productId', getProduct);

module.exports = router;
