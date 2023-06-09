const { verifyTokenAsAdmin, verifyTokenWithAuthentication, verifyToken } = require('./tokenVerification');

const router = require('express').Router()
const { createBanner, getAllBanners, createAdd, getAllAdds, getHomeData } = require('../controllers/homeController');




// Create Banner 
router.post('/banners/create', verifyTokenAsAdmin , createBanner);

// Get all banners
router.get('/banners/getBanners' ,verifyToken , getAllBanners);

// Create add 
router.post('/adds/create', verifyTokenAsAdmin , createAdd);

// Get all adds
router.get('/adds/getAdds' ,verifyToken , getAllAdds);

// get home data
router.get('/' , getHomeData);

module.exports  = router