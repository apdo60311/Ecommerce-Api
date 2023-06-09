const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, unique: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        gallery: {type : Array , required : false},
        categories: { type: Array},
        details: { type: Map , required : true},
        price: { type: Number, required: true },
        currency: {type: String , required: true},
        discount: { type: Number, required: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model('product' , productSchema);