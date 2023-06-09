const { verifyToken } = require('./tokenVerification');

const router = require('express').Router()
const { addToFavorites , deleteFromFavorites ,listAllUserFavorites ,emptyFavorites, checkWhetherProductInFavorites} = require('../controllers/favoritesController');


// add product to favorites
router.post('/add/', verifyToken , addToFavorites);

// delete product from favorite
router.delete('/delete' , verifyToken , deleteFromFavorites);

// list user all favorite products
router.get('/all', verifyToken, listAllUserFavorites);

// check if product is in favorites
router.get('/check/:id', verifyToken, checkWhetherProductInFavorites);

// delete all favorite products
router.delete('/all', verifyToken, emptyFavorites);



module.exports  = router

