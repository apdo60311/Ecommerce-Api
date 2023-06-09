const mongoose = require('mongoose');

const addSchema = new mongoose.Schema(
    {
        image: {type:String , required : true},
        url: {type:String , required : true},
    },
    { timestamps: true }
);

module.exports = mongoose.model('add' , addSchema);