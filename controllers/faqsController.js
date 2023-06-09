const Response = require('../models/Response');
const Faq = require('../models/FAQ');


/**
 * @desc      get user cart
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.body.question - 
 * @property  { String } req.body.answer - 
 * @returns   { JSON } - new Response Object as JSON
 */

const createFaq = async (req , res) => {
    if ((req.body.question, req.body.answer)) {
    const faq = new Faq(req.body);
    try {
        const savedFaq = await faq.save();
        res
        .status(200)
        .json(new Response("Ok", "Created Successfully", savedFaq).getJson());
    } catch (error) {
        res.status(400).json(new Response("Error", `${error}`).getJson());
    }
    }    
};

/**
 * @desc      get user cart
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.params.id - id of the qestion
 * @returns   { JSON } - new Response Object as JSON
 */

const deleteFaq = async (req , res) => {
    try {
        const id = req.params.id;
        if (id) {
            await Faq.findOneAndDelete({ _id: id });
            res.status(200).json(new Response('Ok' , 'Deleted Successfully.').getJson());            
        } else {
            res.status(400).json(new Response('Error' , 'id must be provided.').getJson());                
        }
    } catch (error) {
        res.status(400).json(new Response('Error' , `${error}`).getJson());        
    }
};

/**
 * @desc      get user cart
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - new Response Object as JSON
 */

const getFaqs = async (req , res) => {
    try {
        const allFaqs = await Faq.find();
        res.status(200).json(new Response('Ok' , 'All promocodes listed Successfully', allFaqs).getJson())
        
    } catch (error) {
        res.status(400).json(new Response('Error' , `${error}`).getJson());        
    }
}


module.exports = {
    createFaq,
    deleteFaq,
    getFaqs
}