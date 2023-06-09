const jsonwebtoken = require('jsonwebtoken')
const Response = require('../models/Response')


// verify user TOKEN 

const verifyToken = (req , res , next) => {
    const authHeader = req.headers.token;
    if (authHeader) { 
        jsonwebtoken.verify(authHeader, process.env.JWT_SECRET , (err , userData) => {
            if(err) res.status(500).json(new Response('error' , 'Invalid Token!' , {}));
            req.user = userData;
            next();
        });
    } else {
        return res.status(500).json(
            new Response('error' , 'Not authenticated!!' , {}).getJson()
        );
    }
};

// verify user TOKEN and ID

const verifyTokenWithAuthentication = (req , res , next) => {
    verifyToken(req , res , () => {
        // check if user is authorized
        if (req.user.id === req.params.id || req.user.isAdmin) {
            next();
        } else {
            res.status(500).json(
                new Response('error' , 'You are not allowed to take this action' , {}).getJson()
            );
        }
    });
};

// verify admin TOKEN 

const verifyTokenAsAdmin = (req , res , next) => {
    verifyToken(req , res , () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(500).json(
                new Response('error' , 'You are not allowed to take this action' , {}).getJson()
            );
        }
    });
};

// verify addmin token with Authentication
const verifyTokenAsAdminWithAuthentication = (req , res , next) => {
    verifyTokenWithAuthentication(req , res , () => {
        if (req.user.isAdmin) {
            next();
        } else {
            res.status(500).json(
                new Response('error' , 'You are not allowed to take this action' , {}).getJson()
            );
        }
    });
};


module.exports = {
    verifyToken , 
    verifyTokenWithAuthentication,
    verifyTokenAsAdmin,
    verifyTokenAsAdminWithAuthentication
}