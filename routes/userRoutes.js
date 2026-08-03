const express = require("express");
const router = express.Router();
const User = require("../models/Users");

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const jwtsecret = process.env.JWT_SECRET;

/* ===========================
   SIGN UP
=========================== */
router.post("/sign-up", async (req, res) => {
    try {

        console.log("Signup Data:", req.body);


        const { name, email, mobile, village, aadhar, password, role } = req.body;



        // Check duplicate email
        const emailExists = await User.findOne({ email });

        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "Email already registered",
            });
        }

        // Check duplicate mobile
        const mobileExists = await User.findOne({ mobile });

        if (mobileExists) {
            return res.status(400).json({
                success: false,
                message: "Mobile already registered",
            });
        }

        // Hash password
        const hash = bcrypt.hashSync(password, saltRounds);

        // Create user
        await User.create({
            name,
            email,
            mobile,
            password: hash,
            village,
            aadhar,
            role,
        });
        return res.status(201).json({
            success: true,
            message: "Sign-up successfully!",
        });



    } catch (err) {

        console.error(err);

        // Mongoose validation error
        if (err.name === "ValidationError") {
            return res.status(400).json({
                success: false,
                message: Object.values(err.errors)[0].message,
            });
        }

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});



/* ===========================
   LOGIN
=========================== */
router.post("/login", async (req, res) => {
    try {

        const { email, password } = req.body;

        // Check Email
        const userRecord = await User.findOne({ email });

        if (!userRecord) {
            return res.status(401).json({
                success: false,
                message: "Email is invalid",
            });
        }

        // Check Password
        const isPasswordValid = bcrypt.compareSync(
            password,
            userRecord.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Password is incorrect",
            });
        }

        // JWT Payload
        const payload = {
            _id: userRecord._id,
            name: userRecord.name,
            email: userRecord.email,
            mobile: userRecord.mobile,
            village: userRecord.village,
            aadhar: userRecord.aadhar,
            role: userRecord.role,
        };

        // Generate Token
        const token = jwt.sign(payload, jwtsecret, {
            expiresIn: "6h",
        });

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: userRecord._id,
                name: userRecord.name,
                email: userRecord.email,
                mobile: userRecord.mobile,
                village: userRecord.village,
                aadhar: userRecord.aadhar,
                role: userRecord.role,
            }
        });


    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
        });
    }
});

router.put("/update-profile/:id", async (req, res) => {

    try {

        const user = await User.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true
            }
        );


        res.status(200).json({
            success: true,
            message: "Profile Updated Successfully",
            user: user
        });


    }
    catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error"
        });

    }

});

module.exports = router;