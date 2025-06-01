// !!! updated Code with nodemailer

import nodemailer from "nodemailer";

// Function to send mail after payment confirmation
const sendMail = async (req) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // Use secure: true for port 465, secure: false for others
        auth: {
            user: process.env.MAIL_USER, // Your email
            pass: process.env.MAIL_APP_PASSWORD, // Your app-specific password
        },
    });

    try {
        // Sending the email
        const info = await transporter.sendMail({
            from: {
                name: "Roast Cafe",
                address: "info@roastcafe.in",
            },
            to: req.body.to, // Receiver email
            cc: req.body.cc || '', // Optional CC
            bcc: req.body.bcc, // BCC recipients as an array
            subject: req.body.subject, // Subject of the email
            text: req.body.text, // Plain text version
            html: req.body.htmltext, // HTML formatted version
        });

        console.log("Email sent:", info.response);
    } catch (err) {
        console.error("Error sending email:", err);
    }
};

export { sendMail };

