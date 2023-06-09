const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        username: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        phone: { type: String, required : true},
        image: { type: String, default : 'https://cdn-icons-png.flaticon.com/512/6522/6522516.png' },
        password: { type: String, required: true },
        credit: { type: Number , default : 0},
        isAdmin: { type: Boolean, default: false },
        resetPasswordToken: { type:String, default:'undefined' },
        resetPasswordExpires: { type:Date, default:Date.now() },
    },
    { timestamps: true }
);


module.exports = mongoose.model('user' , userSchema);
