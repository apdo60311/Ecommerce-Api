const Product = require('../models/Product');
const Response = require('../models/Response');

/**
 * @desc      add new product to products database
 * @param     { Object } req -> Request object
 * @param     { Object } res -> Response object
 * @property  { String } req.body.title -> product's title
 * @property  { String } req.body.description -> product's description
 * @property  { String } req.body.image -> the url of product's image
 * @property  { String } req.body.categories -> categories which prodcut belongs to
 * @property  { String } req.body.currency 
 * @property  { Number } req.body.price -> product's price 
 * @returns   { JSON } -> new Response Object as JSON
 */

const addProduct = async (req , res) => {
    if(
        req.body.title && req.body.description 
        && req.body.image && req.body.categories 
        && req.body.currency && req.body.details 
        && req.body.price
        ) {
            const newProduct = new Product(req.body);
            try {
                const savedProduct = await newProduct.save();
                res.status(200).json(new Response('Ok' , 'Product Saved Successfully', savedProduct))
                
            } catch (error) {
                res.status(400).json(new Response('Error' , `${error}`).getJson());        
            }
        
        }else {
            res.status(400).json(new Response('Error' , 'Product data must be provided').getJson());        
    }
    
};

/**
 * @desc      update a product
 * @param     { Object } req -> Request object
 * @param     { Object } res -> Response object
 * @property  { Object } req.body -> contains properties to update 
 * @property  { Object } req.params.id -> product id 
 * @returns   { JSON } -> new Response Object as JSON
 */

const updateProduct = async (req , res) => {
    try {
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id,{
            $set : req.body,
        }, { new:true });
        res.status(200).json({...new Response('ok' , 'Product updated successfuly' , {...updatedProduct._docs}) });
    } catch (error) {
        res.status(500).json(
            new Response('error' , `${error}`).getJson()
        )
    }
};

/**
 * @desc      delete product
 * @param     { Object } req -> Request object
 * @param     { Object } res -> Response object
 * @property  { String } req.params.id -> product id 
 * @returns   { JSON } -> new Response Object as JSON
 */

const deleteProduct = async (req , res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json(
            new Response('ok' , 'Product has been deleted successfully').getJson()
        );
    } catch (error) {
        res.status(400).json(
            new Response('error' , 'Product has not been deleted !!').getJson()
        );        
    }
};

/**
 * @desc      get product details
 * @param     { Object } req -> Request object
 * @param     { Object } res -> Response object
 * @property  { String } req.params.id -> product id 
 * @returns   { JSON } -> new Response Object as JSON
 */

const getProductData =  async (req , res) => {
    try {
        const product = await Product.findById(req.params.id);
        const {password , ...data } = product._doc;
        res.status(200).json(
            {...new Response('ok' , 'Product Found!' , {...data}).getJson() }
        );
    } catch (error) {
        new Response('error' , `${error}`).getJson() 
    }
};

/**
 * @desc      get all products
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Number } req.query.limit -> max number of products 
 * @property  { Boolean } req.query.sort 
 * @property  { Object } req.query.categoty  
 * @returns   { JSON } - new Response Object as JSON
 */

const getAllproducts =  async (req , res) => {
    
    const limit = req.query.limit; 
    const sort = req.query.sort;
    const category  = req.query.category; 
    
    let products = [];

    try {
        if (category) {
            products = await Product.find({
                categories: {
                    $in:[category],
                },
            }).limit((limit) ? limit : Product.count()).sort();
                            
        } else {
            products = await Product.find().sort();
        }
        res.status(200).json(
            {...new Response('ok' , 'All products listed successfuly!' , products).getJson()}
        );
    } catch (error) {
        res.status(400).json(
        new Response('error' , `${error}`).getJson() 
        );
    }
};

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getProductData,
    getAllproducts
}