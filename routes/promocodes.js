const { verifyTokenAsAdmin, verifyTokenWithAuthentication, verifyToken } = require('./tokenVerification');
const router = require('express').Router()
const { createPromocode, updatePromocode, deletePromocode, getAllpromocodes, verifyPromocode } = require('../controllers/promocodesController');


// Create Promocode 
router.post('/create', verifyTokenAsAdmin , createPromocode);

// update promocode
router.put('/update/:code' ,verifyTokenAsAdmin , updatePromocode);

// delete promocode
router.delete('/delete/:code' ,verifyTokenAsAdmin , deletePromocode);

// verify promocode
router.get('/verify' ,verifyToken , verifyPromocode);

// Get all Promocodes
router.get('/getCodes' ,verifyTokenAsAdmin , getAllpromocodes);


module.exports  = router