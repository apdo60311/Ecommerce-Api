const cryptoJs = require('crypto-js')
const jsonwebtoken = require('jsonwebtoken')
const User = require('../models/User')
const Response = require('../models/Response')
const Favorite = require('../models/Favorite')



/**
 * @desc      Handle user registeration
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - User information
 * @returns   { JSON } - new Response Object as JSON
 */

const register = async (req , res)=> {

    if (req.body.username && req.body.email && req.body.password && req.body.phone) {
        let newUser;
        if (req.body.image) {
            newUser = new User({
                username:req.body.username,
                email:req.body.email,
                image:req.body.image,
                phone:req.body.phone,
                password:cryptoJs.AES.encrypt(req.body.password,process.env.PASSWORD_SECRET).toString(),
            });
        } 
        else {
            newUser = new User({
                username:req.body.username,
                email:req.body.email,
                phone:req.body.phone,
                password:cryptoJs.AES.encrypt(req.body.password,process.env.PASSWORD_SECRET).toString(),
            });
        }
    
        try {
            await newUser.save().then((value) => {
                createFavorites(value._id);        
                res.status(200).json(value)
            });
        } catch (error) {
            console.log(error);
            res.status(500).json(
                new Response('error' , `${error}`).getJson()
            );
        }    
    }else {
        res.status(500).json(
            new Response('error' , 'username , email and password are required!!').getJson()
        );
    }
};

/**
 * @desc      Handle user login
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.username 
 * @property  { Object } req.body.password 
 * @returns   { JSON } - new Response Object as JSON
 */

const login = async (req , res) => {
    try {
        if(req.body.username && req.body.password) {
            const user = await User.findOne({username : req.body.username});
            
            // check exisitence of the user
            !user && res.status(500).json(
                new Response('error' , 'username is unregistered!!').getJson()
            );
            
            // check password
            const decryptedPassword = cryptoJs.AES.decrypt(user.password , process.env.PASSWORD_SECRET);
            const passwordString = decryptedPassword.toString(cryptoJs.enc.Utf8);
                
            if (passwordString == req.body.password) {
                const {password , ...data} = user._doc;
                const loginAccessToken = jsonwebtoken.sign({
                    id:user._id,
                    isAdmin:user.isAdmin,
                } , process.env.JWT_SECRET , { expiresIn:'2d', });
                
                res.status(200).json(
                    {...data , loginAccessToken}
                );
                
            } else {
                res.status(500).json(
                    new Response('error' , 'incorrect password!').getJson()
                );                
            }
        }else {
            res.status(500).json(
                new Response('error' , 'username , email and password are required!!').getJson()
            );
        }
    
    } catch (error) {
        new Response('error' , `${error}`).getJson()
    }
    
}
/**
 * @desc      Create favorites list 
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } userId - User id to create favorite for
 */

const createFavorites = async (userId) =>{
    const favorite = new Favorite({ userId:userId, products : [] });
    const savedFavorite = await favorite.save()
    console.log(savedFavorite);
}


module.exports = {
    register,
    login
}