// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            lowercase: true,   // allways in lower case save in mongodb
            trim: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            minlength: 10,
            maxlength: 13,
            index: true,
        },

        village: {
            type: String,
            default: "",
        },

        aadhar: {
            type: String,
            default: "",
        },

        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["citizen", "admin"],
            default: "citizen",
        }

    },

    { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
