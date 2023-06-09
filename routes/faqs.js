const router = require('express').Router()

const { verifyTokenAsAdmin, verifyTokenWithAuthentication, verifyToken } = require('./tokenVerification');
const {createFaq , deleteFaq , getFaqs} = require('../controllers/faqsController');


// Create  
router.post('/create', verifyTokenAsAdmin , createFaq);

// delete 
router.delete('/delete/:id' ,verifyTokenAsAdmin , deleteFaq);

// get 
router.get('/all' , getFaqs);

module.exports  = router