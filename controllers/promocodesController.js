const Response = require('../models/Response');
const Promocode = require('../models/Promocode');

/**
 * @desc      create new promocode
 * @param     { Object } req -> Request object
 * @param     { Object } res -> Response object
 * @property  { Number } req.body.discount -> discount precentage 
 * @property  { Number } req.body.available -> number of days till expiration 
 * @returns   { JSON } -> new Response Object as JSON
 */

const createPromocode = async (req , res) => {
    if(req.body.discount , req.body.available) {
        const promocodeString = generatePromoCode(process.env.PROMOCODE_LENGTH);
        
        const promocode = {
            "code":promocodeString,
            ...req.body
        }

        const newPromocode = new Promocode(promocode);
        
        try {
                const savedPromocode = await newPromocode.save();
                res.status(200).json(new Response('Ok' , 'Promocode created Successfully', savedPromocode).getJson())
                
            } catch (error) {
                res.status(400).json(new Response('Error' , `${error}`).getJson());        
            }
        
        }else {
            res.status(400).json(new Response('Error' , 'Promocode data must be provided').getJson());        
    }
    
};

/**
 * @desc      update promocode details
 * @param     { Object } req -> Request object
 * @param     { Object } res -> Response object
 * @property  { String } req.params.code -> promocode code
 * @property  { String } req.body -> constains details to be updated 
 * @returns   { JSON } -> new Response Object as JSON
 */

const updatePromocode = async (req , res) => {
    try {
        const promocode = req.params.code;
        const updatedPromocode = await Promocode.findOneAndUpdate(
          { code: promocode },
          req.body,
          { new: true }
        );
        if(updatedPromocode){
            res.status(200).json(new Response('Ok' , 'Promocode updates Successfully' , updatedPromocode).getJson());
        }
        else {
            res.status(200).json(new Response('Ok' , 'Promocode not found!').getJson());
        }
    } catch (error) {
        res.status(400).json(new Response('Error' , `${error}`).getJson());        
    }
};

/**
 * @desc      delete promocode by its code
 * @param     { Object } req -> Request object
 * @param     { Object } res -> Response object
 * @property  { String } req.params.code -> promocode code
 * @returns   { JSON } -> new Response Object as JSON
 */

const deletePromocode = async (req , res) => {
    try {
        const promocode = req.params.code;
        if (promocode) {
            await Promocode.findOneAndDelete({ code: promocode });
            res.status(200).json(new Response('Ok' , 'Promocode deleted Successfully.').getJson());                
        } else {
            res.status(404).json(new Response('Error' , 'promocode must be provided.').getJson());                
        }
    } catch (error) {
        res.status(400).json(new Response('Error' , `${error}`).getJson());        
    }
};

/**
 * @desc      list tall promocodes
 * @param     { Object } req -> Request object
 * @param     { Object } res -> Response object
 * @property  { String } req.params.id -> product id 
 * @returns   { JSON } -> new Response Object as JSON
 */

const getAllpromocodes = async (req , res) => {
    try {
        const allPromocodes = await Promocode.find();
        res.status(200).json(new Response('Ok' , 'All promocodes listed Successfully', allPromocodes).getJson())
        
    } catch (error) {
        res.status(400).json(new Response('Error' , `${error}`).getJson());        
    }
};

/**
 * @desc      generate random code for promocodes
 * @param     { Number } length -> promocode length
 * @returns   { String } -> new Promocode
 */

function generatePromoCode(length) {
    let code = "";
    const chars  = process.env.CHARS;
    const charsLength = chars.length;

    for (let i = 0; i < length; i++) {
        const index = Math.floor(Math.random() * charsLength);
        code += chars.charAt(index);
    }

    return code;
}

/**
 * @desc      verfiy promocodes
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.body.code - promocode to verfiy
 * @returns   { JSON } - new Response Object as JSON
 */

const verifyPromocode = async (req , res) => {
    const code = req.body.code;
    if (code) {
        try {
            const promocode = await Promocode.findOne({code:code});
            if(promocode) {
                const discount = `${promocode.discount}%`;
                const availableFor = `${promocode.available} days`;

                const resData = { discount: discount, available: availableFor };
                
                res.status(200).json(new Response('Ok' , 'Promocode successfully', resData).getJson());
            }else {
                res.status(200).json(new Response('Ok' , 'Invalid promocode').getJson());
            }
            
        } catch (error) {
            res.status(400).json(new Response('Error' , `${error}`).getJson());        
            
        }
    }else {
        res.status(404).json(new Response('Error' , 'promocode must be provided.').getJson());                
    }
}


module.exports = {
    createPromocode,
    updatePromocode,
    deletePromocode,
    getAllpromocodes,
    verifyPromocode,
}