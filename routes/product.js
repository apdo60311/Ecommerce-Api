const { verifyTokenAsAdmin } = require('./tokenVerification');
const { addProduct, updateProduct, deleteProduct, getProductData, getAllproducts } = require('../controllers/productController');
const router = require('express').Router()


// Add Product 
router.post('/add', verifyTokenAsAdmin , addProduct);

// Update Product
router.put('/update/:id' , verifyTokenAsAdmin , updateProduct);

// Delete Product
router.delete('/delete/:id', verifyTokenAsAdmin, deleteProduct);

// Get Product Data
router.get('/getProduct/:id', getProductData);

// Get all products
router.get('/products/', getAllproducts);


module.exports  = router