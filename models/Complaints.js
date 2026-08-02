const mongoose = require("mongoose");

const complaintSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: true
        },
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true
        },

        mobile: {
            type: String,
            required: true
        },

        complaindetails: {
            type: String,
            required: true
        },

        village: {
            type: String,
            required: true
        },

        image: {
            type: String,
            default: ""
        },

        status: {
            type: String,
            default: "Pending"
        }

    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Complaints", complaintSchema);