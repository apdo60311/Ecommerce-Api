const Order = require('../models/Order');
const Response = require('../models/Response');

/**
 * @desc      create new order
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.body.userId - the id of the user  
 * @property  { Object } req.body.amount - the amount 
 * @property  { Object } req.body.address - the address 
 * @returns   { JSON } - new Response Object as JSON
 */

const createOrder =  async (req , res) => {
    if(req.body.userId && req.body.amount && req.body.address) {
            const newOrder = new Order(req.body);
            try {
                const savedOrder = await newOrder.save();
                res.status(200).json(new Response('Ok' , 'Order created Successfully', savedOrder))
                
            } catch (error) {
                res.status(400).json(new Response('Error' , `${error}`));        
            }
        
        }else {
            res.status(400).json(new Response('Error' , 'Order data must be provided').getJson());        
    }   
}

/**
 * @desc      update order
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.params.orderId - the id of the order  
 * @returns   { JSON } - new Response Object as JSON
 */

const updateOrder = async (req , res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.orderId,{
            $set : req.body,
        }, { new:true });
        res.status(200).json({...new Response('ok' , 'Order updated successfuly' , updatedOrder).getJson() });
    } catch (error) {
        res.status(500).json(
            new Response('error' , `${error}`).getJson()
        )
    }
};

/**
 * @desc      get order using order id
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.params.orderId - the id of the order  
 * @returns   { JSON } - new Response Object as JSON
 */

const getOrderWithId = async (req, res) => {
    const orderId = req.params.id;
    if(orderId) {
        try {
            const order = await Order.findById(orderId);
            res
                .status(200)
                .json({
                ...new Response(
                    "ok",
                    "Order found successfuly",
                    order
                ).getJson(),
            });
            
        } catch (error) {
            new Response('error' , `${error}`).getJson()
        }
    }else {
        res.status(200).json({...new Response('ok' , 'order id must be provided').getJson() });
    }
}

/**
 * @desc      delete order
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.params.orderId - the id of the order  
 * @returns   { JSON } - new Response Object as JSON
 */

const deleteOrder = async (req , res) => {
    try {
        await Order.findByIdAndDelete(req.params.orderId);
        res.status(200).json(
            new Response('ok' , 'Order has been deleted successfully').getJson()
        );
    } catch (error) {
        res.status(400).json(
            new Response('error' , 'Order has not been deleted !!').getJson()
        );        
    }
};

/**
 * @desc      get user all orders
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.params.userId - the id of the user  
 * @returns   { JSON } - new Response Object as JSON
 */

const getUserOrders = async (req , res) => {
    try {
        const order = await Order.find({ userId:req.params.userId });
        if (order) {
            res.status(200).json(
                {...new Response('ok' , 'orders Found!' , order).getJson() }
            );            
        }
        else {
            res.status(200).json(
                new Response('ok' , 'orders Not Found!' ).getJson()
            );            
        }
    } catch (error) {
        res.status(400).json(
            new Response('error' , `${error}`).getJson()
        );        
    }
};

/**
 * @desc      get all orders of all users
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - new Response Object as JSON
 */

const getAllOrders = async (req , res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(
            {...new Response('ok' , 'All orders fetched successfully!' , orders).getJson() }
        );                
    } catch (error) {
        res.status(400).json(
            new Response('error' , `${error}`).getJson()
        );        
    }
};

/**
 * @desc      switch order status to canceled
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @property  { Object } req.params.id - Order id to cancel
 * @returns   { JSON } - new Response Object as JSON
 */

const cancelOrder = async (req , res) => {
    const orderId = req.params.id;
    if (orderId) {
        try {
            const updatedOrder = await Order.findByIdAndUpdate(orderId,{
                $set : {status:'canceled'},
            }, { new:true });
            res.status(200).json(
                new Response('ok' , 'ordered canceled').getJson()
            );            
        } catch (error) {
                res.status(400).json(
                    new Response('error' , `${error}`).getJson()
                );        
                }    
    } else {
        res.status(200).json(
            new Response('ok' , 'order id must be provided').getJson()
        );                
    }
}

/**
 * @desc      get annual income
 * @param     { Object } req - Request object
 * @param     { Object } res - Response object
 * @returns   { JSON } - new Response Object as JSON
 */

const getIncome = async (req, res) => {
    //! calculate annualy and monthly income 
    try {
        const income  = await Order.aggregate([
            // { $match : { createdAt : { $gte : } } },
        ]);
    } catch (error) {
        
    }
};

module.exports = {
    createOrder,
    updateOrder,
    getOrderWithId,
    deleteOrder,
    getUserOrders,
    getAllOrders,
    cancelOrder,
    getIncome,

}