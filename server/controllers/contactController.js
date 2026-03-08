const asyncHandler = require('express-async-handler');
const { sendEmail, contactEmailTemplate } = require('../utils/sendEmail');

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
const sendContactMessage = asyncHandler(async (req, res) => {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
        res.status(400);
        throw new Error('Name, email, and message are required');
    }

    // [REPLACE] Send to your company email
    await sendEmail({
        to: process.env.EMAIL_USER,
        subject: `Vertex Contact: ${subject || 'New Message'} from ${name}`,
        html: contactEmailTemplate(name, email, message),
    });

    // Send confirmation to user
    await sendEmail({
        to: email,
        subject: 'Thank you for contacting Vertex Hair Care',
        html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fff; padding: 40px; border-radius: 8px;">
        <h1 style="color: #D4AF37; text-align: center; letter-spacing: 4px;">VERTEX</h1>
        <h2 style="color: #fff;">We've received your message</h2>
        <p style="color: #a0a0a0;">Dear ${name},</p>
        <p style="color: #a0a0a0;">Thank you for reaching out to Vertex Hair Care. Our team will get back to you within 24-48 business hours.</p>
        <p style="color: #444; font-size: 12px; text-align: center;">© 2025 Vertex Private Company</p>
      </div>
    `,
    });

    res.json({ success: true, message: 'Your message has been sent successfully. We\'ll respond within 24-48 hours.' });
});

module.exports = { sendContactMessage };
