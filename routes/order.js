const { verifyTokenAsAdmin, verifyTokenWithAuthentication, verifyToken } = require('./tokenVerification');

const router = require('express').Router()
const { createOrder, updateOrder, deleteOrder, getUserOrders, getAllOrders, getIncome, getOrderWithId, cancelOrder } = require('../controllers/orderController');


// Create order 
router.post('/create', verifyToken , createOrder);

// Update order
router.put('/update/:orderId' , verifyTokenAsAdmin , updateOrder);

// Get order with id 
router.get('/get/:orderId' ,  getOrderWithId);

// Delete Order
router.delete('/delete/:orderId' , verifyTokenAsAdmin , deleteOrder);

// Get User Orders
router.get('/getOrders/:userId' , verifyTokenAsAdmin , getUserOrders);

// Get all Orders
router.get('/orders/' , verifyTokenAsAdmin ,  getAllOrders);

// cancel order with order id
router.post('/cancel/:id' , verifyToken ,  cancelOrder);
// calculate income 
router.get('/income' , verifyTokenAsAdmin , getIncome);


module.exports  = router