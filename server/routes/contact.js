const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');

// POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    // 1. Save to MongoDB
    try {
      const newMessage = new ContactMessage({ name, email, subject, message });
      await newMessage.save();
    } catch (dbErr) {
      console.warn('MongoDB save skipped/failed:', dbErr.message);
    }

    // 2. Send real email to Prakhar's Gmail using Nodemailer
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER, // prakharsrivastava8299@gmail.com
          pass: process.env.EMAIL_PASS  // Google App Password (16 digits)
        }
      });

      const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        replyTo: email,
        to: process.env.EMAIL_RECEIVER || 'prakharsrivastava8299@gmail.com',
        subject: `[Portfolio Contact] ${subject || 'New Message from Portfolio'}`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f5; color: #18181b;">
            <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 24px; box-shadow: 0 4px 6px rgba(0,0,0,0.05);">
              <h2 style="color: #06b6d4; border-bottom: 2px solid #06b6d4; padding-bottom: 8px;">New Portfolio Contact Message</h2>
              <p><strong>Sender Name:</strong> ${name}</p>
              <p><strong>Sender Email:</strong> <a href="mailto:${email}">${email}</a></p>
              <p><strong>Subject:</strong> ${subject}</p>
              <div style="margin-top: 16px; padding: 16px; background: #f8fafc; border-left: 4px solid #8b5cf6; border-radius: 4px;">
                <p style="margin: 0; white-space: pre-line;">${message}</p>
              </div>
            </div>
          </div>
        `
      };

      await transporter.sendMail(mailOptions);
      console.log('✓ Email notification sent to Prakhar successfully!');
    } else {
      console.log('ℹ️ EMAIL_USER or EMAIL_PASS not set in .env. Stored message in database only.');
    }

    return res.status(200).json({
      success: true,
      message: 'Message sent successfully! Prakhar will receive it on his Gmail.'
    });

  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ success: false, error: error.message || 'Server error' });
  }
});

module.exports = router;
