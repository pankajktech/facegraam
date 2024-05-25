const nodemailer = require("nodemailer");

const otpMailSender = async (email, otp, callback) => {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GMAIL_ID,
            pass: process.env.GMAIL_PASSWORD,
        },
    });

    const emailContent = `
<html>
<head>
    <title>Verify Your Login</title>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #ffffff;
            font-family: Arial, sans-serif;
            color: #2c3e50;
        }
        table {
            border-collapse: collapse;
            width: 100%;
        }
        td {
            padding: 20px;
            text-align: center;
        }
        h1 {
            font-size: 24px;
            font-weight: bold;
            margin: 20px 0;
        }
        p {
            font-size: 16px;
            margin: 20px 0;
        }
        .verification-code {
            background-color: #f5f5f5;
            padding: 20px;
            font-size: 32px;
            font-weight: bold;
        }
        .footer {
            font-size: 14px;
            margin-top: 20px;
            color: #7f8c8d;
        }
        .website-link {
            color: #3498db;
            text-decoration: none;
        }
    </style>
</head>
<body>
    <table>
        <tr>
            <td>
                <h1>OTP Verification</h1>
                <p>Please use the verification code below to sign in to Facegram.</p>
                <div class="verification-code">
                    ${otp}
                </div>
                <p>This code will expire in 10 minutes.</p>
                <div class="footer">
                    Visit us at <a href="https://facegraam.vercel.app" class="website-link">Facegram</a>
                </div>
            </td>
        </tr>
    </table>
</body>
</html>
`;


    const mailOptions = {
        from: process.env.GMAIL_ID,
        to: email,
        subject: `OTP Verification for Facegram`,
        html: emailContent,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error("Error sending email:", error);
            callback(error);
        } else {
            console.log("Email sent");
            callback(null);
        }
    });
};

module.exports = otpMailSender;
