const { verifyTokenAsAdmin, verifyTokenWithAuthentication, verifyToken } = require('./tokenVerification');

const router = require('express').Router()

const {
  createCart,
  updateCart,
  deleteCart,
  getUserCart,
  getAllCarts,
} = require("../controllers/cartController");




// Create Cart 
router.post('/create', verifyToken , createCart);

// Update cart
router.put('/update/:cartId' , verifyTokenWithAuthentication , updateCart);

// Delete Cart
router.delete('/delete/:cartId' , verifyTokenWithAuthentication , deleteCart);

// Get user cart
router.get('/getcart/:userId' , verifyTokenWithAuthentication , getUserCart);

// Get all carts
router.get('/carts/' , verifyTokenAsAdmin ,  getAllCarts);




module.exports  = router