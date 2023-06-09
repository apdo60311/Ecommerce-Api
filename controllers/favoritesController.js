const jsonwebtoken = require("jsonwebtoken");
const Favorite = require('../models/Favorite');
const Response = require('../models/Response');
const Product = require('../models/Product');

/**
 * @desc      add product to user's favorite
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.productId - the id of the product to be put in favorite 
 * @returns   { JSON } - new Response Object as JSON
 */


const addToFavorites = async (req , res) => {
    const productId = req.body.productId;

    if (productId) {
        // get user favorite data
        const userId = jsonwebtoken.decode(req.headers.token)['id'];
        const favorite = await Favorite.findOne({userId:userId});

        let favProducts = favorite.products;

        var isDuplicated = checkProductDuplication(favProducts, productId);

        if (!isDuplicated) {
            favProducts.push({
                productId:productId,
            });  
            
            const updatedFav = await favorite.updateOne({
                $set : {products:favProducts}
            } , {new:true});
            res.status(200).json(new Response('ok' , 'Product added to favorites.' , favProducts).getJson());    
        }
        else {
            res.status(400).json(new Response('ok' , 'Product is duplicated.').getJson());
        }

    } else {
        res.status(500).json(new Response('Error' , 'Product id must be provided.'));
    }

};

/**
 * @desc      delete product from user's favorite
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.productId - the id of the product to be deleted from favorite 
 * @returns   { JSON } - new Response Object as JSON
 */

const deleteFromFavorites = async (req , res) => {
    if (req.body.productId) {
        const productId = req.body.productId;
        const userId = jsonwebtoken.decode(req.headers.token)['id'];

        try {
            // find user favorite 
            const userFavorites = await Favorite.findOne({userId:userId});

            // filter copy all products except the one to be deleted
            const oldFavoriteProducts = userFavorites.products;
            const updatedFavoriteProducts = oldFavoriteProducts.filter(
                (product) => product.productId != productId
            );
            
            // in case product not found in the favorites
            if (oldFavoriteProducts.length === updatedFavoriteProducts.length) {
                res
                  .status(200)
                  .json(
                    new Response(
                      "ok",
                      "product not found ",
                    ).getJson()
                  );
                
            } else {
              // update products list
              await userFavorites.updateOne(
                { $set: { products: updatedFavoriteProducts } },
                { new: true }
              );

              res
                .status(200)
                .json(
                  new Response(
                    "ok",
                    "product deleted successfully",
                    updatedFavoriteProducts
                  ).getJson()
                );
            }

        } catch (error) {
            res.status(500).json(new Response('Error' , `${error}`).getJson());
        }

        

    } else {
        res.status(500).json(new Response('Error' , 'Product id must be provided.').getJson());
    }
}

/**
 * @desc      delete all products in favorites
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - new Response Object as JSON
 */

const emptyFavorites = async (req , res) => {
        const userId = jsonwebtoken.decode(req.headers.token)['id'];
        try {
            // find user favorite 
            const userFavorites = await Favorite.findOne({userId:userId});

            // empty products list
              await userFavorites.updateOne(
                { $set: { products: [] } },
                { new: true }
              );

              res
                .status(200)
                .json(
                  new Response(
                    "ok",
                    "All products deleted successfully",
                    updatedFavoriteProducts
                  ).getJson()
                );

        } catch (error) {
            res.status(500).json(new Response('Error' , `${error}`).getJson());
        }
}

/**
 * @desc      get all products in user's favorite
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - new Response Object as JSON
 */

const listAllUserFavorites = async (req , res) => {

    try {
        // get user favorite data
        const userId = jsonwebtoken.decode(req.headers.token)['id'];
        const favorite = await Favorite.findOne({userId:userId});

        res.status(200).json(new Response('ok' , 'All prodcuts in favorite' , favorite.products).getJson());
        
    } catch (error) {
        res.status(500).json(new Response('Error' , `${error}`).getJson());
    }
    
};

/**
 * @desc      check whether a product is in user favorites or not
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.id - product id
 * @property  { String } req.headers.token - current user token
 * @returns   { JSON } - new Response Object as JSON
 */

const checkWhetherProductInFavorites = async (req , res) => {
    const productId = req.params.id;
    if (productId) {
        try {
            const userId = jsonwebtoken.decode(req.headers.token)['id'];
            const user = await Favorite.findOne({userId:userId});            
        
            const products = user.products;

            for (let product of products) {
                if(product.productId == productId) {
                    res.status(200).json(new Response('true' , 'product is in favorites').getJson());                    
                    break;
                }
            }
            res.status(200).json(new Response('false' , 'product is not in favorites').getJson());                    
            
        } catch (error) {
            res.status(500).json(new Response('Error' , `${error}`).getJson());
        }
    } else {
        res.status(200).json(new Response('true' , 'product id must be provided').getJson());
    }
}

/**
 * @desc      check if product is in favorite or not
 * @param     { Array } favProducts - list of products in favorite
 * @param     { String } productId - product id 
 * @property  { Object } req.body.productId - the id of the product to be put in favorite 
 * @returns   { Boolean } - true if product is in favorite false othrewise
 */

function checkProductDuplication(favProducts, productId) {
    for (let product of favProducts) {
        if (product['productId'] == productId) {
            return true;
        }
    }
    return false;
}


module.exports = {
    addToFavorites,
    listAllUserFavorites,
    deleteFromFavorites,
    checkWhetherProductInFavorites,
    emptyFavorites
}