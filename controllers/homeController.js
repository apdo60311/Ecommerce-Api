const Banner = require('../models/Banner');
const Response = require('../models/Response');
const Product = require('../models/Product');
const Add = require('../models/Add');


/**
 * @desc      create new banner
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.image - the image of the banner 
 * @returns   { JSON } - new Response Object as JSON
 */

const createBanner = async (req , res) => {
    if(req.body.image) {
            const newBanner = new Banner(req.body);
            try {
                const savedBanner = await newBanner.save();
                res.status(200).json(new Response('Ok' , 'Banner created Successfully', savedBanner).getJson())
                
            } catch (error) {
                res.status(400).json(new Response('Error' , `${error}`).getJson());        
            }
        }else {
            res.status(400).json(new Response('Error' , 'Banner data must be provided').getJson());        
    }
};

/**
 * @desc      get all banners 
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - new Response Object as JSON
 */

const getAllBanners =  async (req , res) => {
    try {
        const allBanners = await Banner.find();
        res.status(200).json(new Response('Ok' , 'All banners listed Successfully', allBanners).getJson())
        
    } catch (error) {
        res.status(400).json(new Response('Error' , `${error}`).getJson());        
    }
};

/**
 * @desc      create new banner
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.image - the image of the banner 
 * @property  { Object } req.body.url - the url of the banner 
 * @returns   { JSON } - new Response Object as JSON
 */

const createAdd = async (req , res) => {
    if(req.body.image && req.body.url) {
            const newAdd = new Add(req.body);
            try {
                const savedAdd = await newAdd.save();
                res.status(200).json(new Response('Ok' , 'Add created Successfully', savedAdd).getJson())
                
            } catch (error) {
                res.status(400).json(new Response('Error' , `${error}`).getJson());        
            }
        }else {
            res.status(400).json(new Response('Error' , 'Add data must be provided').getJson());        
    }
}

/**
 * @desc      create new banner
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - new Response Object as JSON
 */

const getAllAdds = async (req , res) => {
    try {
        const allAdds = await Add.find();
        res.status(200).json(new Response('Ok' , 'Add created Successfully', allAdds).getJson())
        
    } catch (error) {
        res.status(400).json(new Response('Error' , `${error}`).getJson());        
    }
};

/**
 * @desc      create new banner
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - new Response Object as JSON
 */

const getHomeData = async (req , res) => {
    try {
        // get banners
        const banners = await Banner.find();
        // get products 
        const products = await Product.find();
        // get ads
        const adds = await Add.find();

        const homeData = {
            'banners':banners,
            'products':products,
            'adds':adds
        }
        res.status(200).json(new Response('ok' , 'Home data loaded successfully.' , homeData).getJson());
    } catch (error) {
        res.status(400).json(new Response('Error' , `${error}`).getJson());        
    }
};

module.exports = {
    createBanner,
    getAllBanners,
    createAdd,
    getAllAdds,
    getHomeData
}