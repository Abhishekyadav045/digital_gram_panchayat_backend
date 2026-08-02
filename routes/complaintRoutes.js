const express = require("express");
const router = express.Router();

const Complaint = require("../models/Complaints");

const multer = require("multer");
const path = require("path");


// ===============================
// Multer Storage Configuration
// ===============================

const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "uploads/");

    },


    filename: (req, file, cb) => {

        const uniqueName = Date.now() + path.extname(file.originalname);

        cb(null, file.fieldname + "-" + uniqueName);

    }

});


// Create Upload Middleware

const upload = multer({
    storage: storage
});



// ===============================
// Submit Complaint API
// POST /api/complaints
// ===============================

router.post(
    "/complaints",
    upload.single("image"),

    async (req, res) => {

        try {
            console.log("Uploaded File:", req.file);


            const complaint = await Complaint.create({

                name: req.body.name,

                email: req.body.email,

                mobile: req.body.mobile,

                village: req.body.village,

                category: req.body.category,

                complaindetails: req.body.complaindetails,

                userId: req.body.userId,


                // Save image name
                image: req.file ? req.file.filename : ""

            });



            res.status(201).json({

                success: true,

                message: "Complaint submitted successfully!",

                complaint

            });



        } catch (error) {


            console.log("Complaint Error:", error);


            res.status(500).json({

                success: false,

                message: "Server Error",

                error: error.message

            });


        }

    }
);





// ===============================
// Get User Complaints
// GET /api/my-complaints/:userId
// ===============================

router.get(
    "/my-complaints/:userId",

    async (req, res) => {


        try {


            const complaints = await Complaint.find({

                userId: req.params.userId

            });



            res.status(200).json({

                success: true,

                complaints

            });



        } catch (error) {


            console.log("Fetch Complaint Error:", error);


            res.status(500).json({

                success: false,

                message: error.message

            });


        }

    }
);





// ===============================
// Get All Complaints (Admin)
// GET /api/all-complaints
// ===============================

router.get(
    "/all-complaints",

    async (req, res) => {


        try {


            const complaints = await Complaint.find()
                .sort({ createdAt: -1 });



            res.status(200).json({

                success: true,

                complaints

            });



        } catch (error) {


            console.log(error);


            res.status(500).json({

                success: false,

                message: error.message

            });


        }


    }
);





// ===============================
// Update Complaint Status (Admin)
// PUT /api/update-status/:id
// ===============================

router.put(
    "/update-status/:id",

    async (req, res) => {


        try {


            const complaint = await Complaint.findByIdAndUpdate(

                req.params.id,

                {
                    status: req.body.status
                },

                {
                    new: true
                }

            );



            res.status(200).json({

                success: true,

                message: "Status updated successfully",

                complaint

            });



        } catch (error) {


            console.log(error);


            res.status(500).json({

                success: false,

                message: error.message

            });


        }


    }
);





// ===============================
// Delete Complaint
// DELETE /api/delete-complaint/:id
// ===============================

router.delete(
    "/delete-complaint/:id",

    async (req, res) => {


        try {


            await Complaint.findByIdAndDelete(req.params.id);



            res.status(200).json({

                success: true,

                message: "Complaint deleted successfully"

            });



        } catch (error) {


            console.log(error);


            res.status(500).json({

                success: false,

                message: error.message

            });


        }


    }
);





module.exports = router;