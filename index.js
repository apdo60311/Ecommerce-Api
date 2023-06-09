const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
require('dotenv').config();
const Logger = require('./services/Logger');




const app = express();
app.use(express.json());


const port = process.env.PORT || 5000;

const logger = Logger.Logger.getInstance();

// conncect to mongoDB
mongoose.connect(`${process.env.MONGODB_URI}`).then(() => {
    console.log(``);
    logger.log({prefix:'Mongoose' , message :'MongoDB Connection Succeded'});
}).catch((err) => {
    logger.log({prefix:'Mongoose' , message :`Error occured \n ${err}`});
});

app.get("/", (req, res) => {
    res.send("Ecommerce Api");
});

const authRoute = require('./routes/auth');
app.use('/auth',authRoute);

const userRoute = require('./routes/user');
app.use('/user',userRoute);

const productRoute = require('./routes/product');
app.use('/product',productRoute);

const cartRoute = require('./routes/cart');
app.use('/cart',cartRoute);

const orderRoute = require('./routes/order');
app.use('/order',orderRoute);

const favoritesRoute = require('./routes/favorites');
app.use('/favorites',favoritesRoute);

const homeRoute = require('./routes/home');
app.use('/home',homeRoute);

const promocodeRoute = require('./routes/promocodes');
app.use('/promocode',promocodeRoute);

const faqsRoute = require('./routes/faqs');
app.use('/faqs',faqsRoute);

const passwordMangementRoute = require('./routes/passwordMangement');
app.use('/password',passwordMangementRoute);



app.listen(port, () =>
    logger.log({
        prefix: "Mongoose",
        message: `> Server is up and running on port :  + ${port}`,
    })
);

