const cryptoJs = require('crypto-js');
const jsonwebtoken = require('jsonwebtoken');
const User = require('../models/User');
const Response = require('../models/Response');

/**
 * @desc      update user informations
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body - data to be modified  
 * @returns   { JSON } - new Response Object as JSON
 */

const updateUserData = async (req , res) => {
    
    // if user wanted to change thier password
    if(req.body.password) {
        // encrypt new password
        req.body.password = cryptoJs.AES.encrypt(req.body.password,process.env.PASSWORD_SECRET).toString();
    }

    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id,{
            $set : req.body,
        }, { new:true });
        res.status(200).json({...new Response('ok' , 'Updated Successfuly' , {...updatedUser._docs}) });
    } catch (error) {
        res.status(500).json(
            new Response('error' , `${error}`).getJson()
        )
    }
};

/**
 * @desc      delete user account with user id
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.id - user id  
 * @returns   { JSON } - new Response Object as JSON
 */

const deleteUser = async (req , res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json(
            new Response('ok' , 'User Has been deleted Successfully').getJson()
        );
    } catch (error) {
        new Response('error' , `${error}`).getJson() 
    }
};

/**
 * @desc      delete current user account
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } userId - Current user id  
 * @returns   { JSON } - new Response Object as JSON
 */

const deleteCurrentUserAccount = async (req , res) => {
    const userId = jsonwebtoken.decode(req.headers.token)['id'];
    try {
        const user = await User.findByIdAndDelete(userId);
        if (user) {
            res.status(200).json(new Response('ok' , 'Account deleted Successfully.').getJson());
        }
        else {
            res.status(200).json(new Response('ok' , 'user not found').getJson());
        }
    } catch (error) {
        res.status(400).json(new Response('Error' , `${error}`));        
    }
}

/**
 * @desc      get user information using user id
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.id - user id  
 * @returns   { JSON } - new Response Object as JSON
 */

const getUserDataWithId = async (req , res) => {
    try {
        const user = await User.findById(req.params.id);
        const {password , ...data } = user._doc;
        res.status(200).json(
            {...new Response('ok' , 'User Found!' , {...data}).getJson() }
        );
    } catch (error) {
        new Response('error' , `${error}`).getJson() 
    }
};

/**
 * @desc      list all users
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } limit - max number of users  
 * @returns   { JSON } - new Response Object as JSON
 */

const getAllUsers = async (req , res) => {
    
    const limit = req.query.limit; 
    try {
        const users = await User.find().limit((limit) ? limit : User.count());
        const filteredUsers = [];
        users.forEach((user)=>{
            const {password , ...data} = user._doc;
            filteredUsers.push(data);
        });
        res.status(200).json(
            {...new Response('ok' , 'All users Listed Successfuly!' , filteredUsers).getJson()}
        );
    } catch (error) {
        res.status(400).json(
        new Response('error' , `${error}`).getJson() 
        );
    }
};

/**
 * @desc      get users statistics
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - new Response Object as JSON
 */

const getUsersStatistics =  async (req, res) => {
    try {
        const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December" ];
    
        const recentYear = new Date(new Date().setFullYear(new Date().setFullYear() - 1));
    
        const statsData = await User.aggregate([
            {$match : {createdAt : { $gte :recentYear}}},
            {$project:{
                month : {$month : "$createdAt"}
            }},
            {$group : {
                _id : "$month",
                total : {$sum : 1},
            }}
        
        ]);
    
        statsData.at(0)._id = monthNames[parseInt(statsData.at(0)._id)];
        statsData.at(0).month = statsData.at(0)._id;
        delete statsData.at(0)._id;
    
        res.status(200).json(statsData);
    
    } catch (error) {
        res.status(400).json(new Response('Error' , `${error}`));        
    }

};


module.exports = {
    updateUserData,
    deleteUser,
    getUserDataWithId,
    getAllUsers,
    getUsersStatistics,
    deleteCurrentUserAccount,
}