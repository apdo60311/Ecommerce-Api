const mongoose = require('mongoose');

const PromocodeSchema = new mongoose.Schema(
    {
        code: {type : String , required: true},
        discount: {type : Number , required: true}, // precentage
        available: {type : Number, required: true , } // nunmber of days
    },
    { timestamps: true}
);

module.exports = mongoose.model('promocode' , PromocodeSchema);