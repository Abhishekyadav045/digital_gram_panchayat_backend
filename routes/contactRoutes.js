const express = require("express");
const router = express.Router();

const Contact = require("../models/Contacts");


// Submit Contact Form

router.post("/contact", async (req, res) => {

    try {

        const contact = await Contact.create({

            name: req.body.name,
            email: req.body.email,
            mobile: req.body.mobile,
            village: req.body.village,
            message: req.body.message

        });


        return res.status(201).json({

            success: true,
            message: "Message sent successfully",
            contact

        });


    } catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,
            message: "Server error"

        });

    }

});

module.exports = router;