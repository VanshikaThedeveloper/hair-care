const nodemailer = require('nodemailer');

// [REPLACE] Configure with your email credentials
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER, // [REPLACE] your Gmail
        pass: process.env.EMAIL_PASS, // [REPLACE] your Gmail App Password
    },
});

const sendEmail = async ({ to, subject, html, text }) => {
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'Vertex Hair Care <noreply@vertex.com>',
        to,
        subject,
        html,
        text,
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`📧 Email sent: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('❌ Email sending failed:', error.message);
        throw new Error('Email could not be sent');
    }
};

// Email templates
const resetPasswordEmailTemplate = (resetUrl) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 8px;">
    <h1 style="color: #D4AF37; text-align: center; letter-spacing: 4px;">VERTEX</h1>
    <h2 style="color: #fff; text-align: center;">Password Reset Request</h2>
    <p style="color: #a0a0a0; line-height: 1.6;">
      You requested to reset your password. Click the button below to set a new password. This link is valid for 10 minutes.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" 
         style="background: linear-gradient(135deg, #D4AF37, #F0D060); color: #000; 
                padding: 14px 36px; text-decoration: none; border-radius: 4px; 
                font-weight: bold; letter-spacing: 2px; font-size: 14px;">
        RESET PASSWORD
      </a>
    </div>
    <p style="color: #666; font-size: 12px; text-align: center;">
      If you did not request this, please ignore this email.
    </p>
    <p style="color: #444; font-size: 12px; text-align: center;">
      © 2025 Vertex Private Company. All rights reserved.
    </p>
  </div>
`;

const contactEmailTemplate = (name, email, message) => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 8px;">
    <h1 style="color: #D4AF37; text-align: center; letter-spacing: 4px;">VERTEX</h1>
    <h2 style="color: #fff;">New Contact Message</h2>
    <p><strong style="color: #D4AF37;">From:</strong> ${name} (${email})</p>
    <div style="background: #1a1a1a; padding: 20px; border-radius: 4px; border-left: 3px solid #D4AF37; margin: 20px 0;">
      <p style="color: #ccc; line-height: 1.6;">${message}</p>
    </div>
    <p style="color: #444; font-size: 12px;">
      © 2025 Vertex Private Company
    </p>
  </div>
`;

module.exports = { sendEmail, resetPasswordEmailTemplate, contactEmailTemplate };
