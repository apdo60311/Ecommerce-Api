const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
    {
        image: {type:String , required : true},
        title: {type:String , required : false},
    },
    { timestamps: true }
);

module.exports = mongoose.model('banner' , bannerSchema);