const { changeUserPassword, resetUserPassword, forgetPassword } = require('../controllers/passwordController');
const { verifyTokenAsAdmin, verifyTokenWithAuthentication, verifyToken } = require('./tokenVerification');

const router = require('express').Router()


// change user password
router.post('/change', verifyToken , changeUserPassword);

// forget password
router.post('/forget', forgetPassword);

// rest user password
router.post('/rest/:token', resetUserPassword);



module.exports  = router