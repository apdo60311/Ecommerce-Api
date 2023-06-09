const jsonwebtoken = require('jsonwebtoken')
const cryptoJs = require('crypto-js')
const crypto = require('crypto')
const User = require('../models/User')
const Response = require('../models/Response')
const { EmailService } = require('../services/EmailService')


/**
 * @desc      change user password
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.body.oldPassword - current user password
 * @property  { String } req.body.newPassword - new user password
 * @returns   { JSON } - new Response Object as JSON
 */

const changeUserPassword = async (req, res) => {
    const userId = jsonwebtoken.decode(req.headers.token)['id'];
    
    const oldPassword = req.body.oldPassword;
    const newPassword = req.body.newPassword;
    
    if (req.body.oldPassword && req.body.newPassword) {
        try {
            const currentUser = await User.findById(userId);
            const currentPassword = cryptoJs.AES.decrypt(
                currentUser.password,
                process.env.PASSWORD_SECRET
            ).toString(cryptoJs.enc.Utf8);
            
            if(currentPassword == oldPassword) {
                const newPasswordEncrypted = cryptoJs.AES.encrypt(
                    newPassword,
                    process.env.PASSWORD_SECRET
                );

                await currentUser.updateOne(
                    { $set: { password: newPasswordEncrypted.toString() } },
                    { new: true }
                );

                res.status(200).json(new Response('ok' , 'Password Changed').getJson());
            }else {
                res.status(200).json(new Response('ok' , 'Wrong password').getJson());
            }
        } catch (error) {
            res.status(404).json(new Response('error' , 'Error Occured' , error).getJson());        
        }        
    } else {
        res.status(200).json(new Response('ok' , 'All data must be provided').getJson());
    }
}

/**
 * @desc      generate a reset password token and send email to user
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.body.email - user email address
 * @returns   { JSON } - new Response Object as JSON
 */

const forgetPassword = async (req , res) => {
    const email = req.body.email;
    if(email) {
        const user = await User.findOne({email:email});
        if (!user) {
            return res.status(400).json(new Response('error' , 'User not found').getJson());
        }

        // generate token and save it to user
        const resetPasswordToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetPasswordToken;
        user.resetPasswordExpires = Date.now() + 3600000; 
        await user.save();
        
        // message bosy
        const resetUrl = `http://localhost:5000/password/rest/${resetPasswordToken}`;
        const message = `To reset your password, please click this link: ${resetUrl}`;      
        
        // send email
        const emailHandler = EmailService.getInstance();
        emailHandler.sendEmail('Ecommerce Api' , 'gkapdo@email.com' , `${email}` , 'Reset Password' , message , '');

        res.status(200).json(new Response('ok' , message).getJson());
    }else {
        res.status(200).json(new Response('ok' , 'Email must be provided').getJson());
    }

}


/**
 * @desc      change user password when password is forgetten
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { String } req.params.token - reset password token
 * @returns   { JSON } - new Response Object as JSON
 */

const resetUserPassword = async (req , res) => {
    const restToken = req.params.token;
    if (restToken) {
        try {
            const user = await User.findOne({
                restPasswordToken: restToken,
                resetPasswordExpires: { $gt: Date.now() },
            });
    
            if(!user) {
                return res.status(400).json(new Response('error' , 'User not found').getJson());
            }
    
            const newPassword = req.body.newPassword;

            if(!newPassword) {
                return res.status(400).json(new Response('error' , 'new password must be provided').getJson());
            }

            user.password = password;
            
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;
            
            await user.save();
            res.status(200).json(new Response('ok' , 'Password changed successfully').getJson());
            
        } catch (error) {
            res.status(404).json(new Response('error' , 'Error Occured' , error).getJson());
        }
        
    } else {
        res.status(200).json(new Response('ok' , 'Reset token must be provided').getJson());
    }
}

module.exports = {
    changeUserPassword,
    forgetPassword,
    resetUserPassword,
}