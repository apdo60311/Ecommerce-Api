const Cart = require('../models/Cart');
const Response = require('../models/Response');


/**
 * @desc      create cart for user
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.userId - User id to create cart for
 * @returns   { JSON } - new Response Object as JSON
 */

const createCart = async (req , res) => {
    if(req.body.userId) {
            const newCart = new Cart(req.body);
            try {
                const savedCart = await newCart.save();
                res.status(200).json(new Response('Ok' , 'Cart created Successfully', savedCart))
                
            } catch (error) {
                res.status(400).json(new Response('Error' , `${error}`));        
            }
        
        }else {
            res.status(400).json(new Response('Error' , 'Cart data must be provided').getJson());        
    }
    
};

/**
 * @desc      update user cart
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.params.cartId - cart Id to be updated
 * @returns   { JSON } - new Response Object as JSON
 */

const updateCart = async (req , res) => {
    if (req.params.cartId) {
        try {
            const updatedCart = await Cart.findByIdAndUpdate(req.params.cartId,{
                $set : req.body,
            }, { new:true });
            res.status(200).json({...new Response('ok' , 'Cart updated successfuly' , updatedCart).getJson() });
    
        } catch (error) {
            res.status(500).json(
                new Response('error' , `${error}`).getJson()
            )
        }    
    }
    else {
        res.status(200).json({...new Response('ok' , 'cart id must be provided').getJson() });
    }
};

/**
 * @desc      delete user cart
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.params.cartId - cart Id to be deleted
 * @returns   { JSON } - new Response Object as JSON
 */

const deleteCart = async (req , res) => {

    if (req.params.cartId) {
        try {
            await Cart.findByIdAndDelete(req.params.cartId);
            res.status(200).json(
                new Response('ok' , 'Cart has been deleted successfully').getJson()
            );
        } catch (error) {
            res.status(400).json(
                new Response('error' , 'Cart has not been deleted !!').getJson()
            );        
        }    
    }
    else {
        res.status(200).json({...new Response('ok' , 'cart id must be provided').getJson() });
    }
};

/**
 * @desc      get user cart
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.params.cartId - cart Id to be deleted
 * @returns   { JSON } - new Response Object as JSON
 */

const getUserCart = async (req , res) => {

    if (req.params.userId) {
        try {
            const cart = await Cart.findOne({ userId:req.params.userId });
            if (cart) {
                res.status(200).json(
                    {...new Response('ok' , 'Cart Found!' , cart).getJson() }
                );            
            }
            else {
                res.status(200).json(
                    new Response('ok' , 'Cart Not Found!' ).getJson()
                );            
            }
        } catch (error) {
            res.status(400).json(
                new Response('error' , `${error}`).getJson()
            );        
        }            
    } else {
        res.status(200).json({...new Response('ok' , 'user id must be provided').getJson() });
    }

}

/**
 * @desc      get all carts for all users
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - new Response Object as JSON
 */

const getAllCarts = async (req , res) => {
    try {
        const carts = await Cart.find();
        res.status(200).json(
            {...new Response('ok' , 'All carts fetched successfully!' , carts).getJson() }
        );                
    } catch (error) {
        res.status(400).json(
            new Response('error' , `${error}`).getJson()
        );        
    }
}

module.exports = {
    createCart,
    updateCart, 
    deleteCart,
    getUserCart,
    getAllCarts
}