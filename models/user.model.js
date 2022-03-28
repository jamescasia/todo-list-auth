const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 7,
        
    },
    email: {
        type: String,
        trim: true,
        required: false,
        minlength: 7,
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 7,
    },
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;