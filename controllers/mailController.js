const nodemailer = require("nodemailer");

const sendEmail = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        console.log(req.body);

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Welcome",
            text: `Hello ${name},

Thank you for contacting us.

Your Message:${message}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({
            message: "Email Sent Successfully",
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            message: "Failed to Send Email",
            error: error.message,
        });
    }
};

module.exports = { sendEmail };