const { verifyToken, verifyTokenWithAuthentication, verifyTokenAsAdmin, verifyTokenAsAdminWithAuthentication } = require('./tokenVerification');
const { updateUserData, deleteUser, getUserDataWithId, getAllUsers, getUsersStatistics, deleteCurrentUserAccount } = require('../controllers/userController');

const router = require('express').Router();

// update user data using id
router.put('/update/:id' , verifyTokenWithAuthentication , updateUserData);

// delete user account using id
router.delete('/delete/:id' , verifyTokenAsAdminWithAuthentication , deleteUser);

// delete current user account
router.delete('/delete' , verifyToken , deleteCurrentUserAccount);

// get user account data using id
router.get('/getUser/:id' , verifyTokenAsAdmin , getUserDataWithId);

// Get All Users
router.get('/users/' , verifyTokenAsAdmin , getAllUsers);

// Get statistics
router.get('/stats/', verifyTokenAsAdmin , getUsersStatistics);

module.exports  = router