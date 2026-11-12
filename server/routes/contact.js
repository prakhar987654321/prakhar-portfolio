const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const ContactMessage = require('../models/ContactMessage');

// Nodemailer Transporter Setup
const createTransporter = () => {
  const user = process.env.EMAIL_USER;
  let pass = process.env.EMAIL_PASS; // <-- Yahan 'const' ki jagah 'let' kar dein

  if (!user || !pass) {
    return null;
  }

  pass = pass.replace(/\s+/g, ''); // Ab yeh line bina kisi error ke chal jayegi

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: user.trim(),
      pass: pass
    },
    tls: {
      rejectUnauthorized: false
    }
  });
};

// POST /api/contact - Store message & send email notification
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    // Check validation
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Please provide all required fields' 
      });
    }

    // 1. Save message to MongoDB
    try {
      const newMessage = new ContactMessage({ name, email, subject, message });
      await newMessage.save();
    } catch (dbErr) {
      console.warn('⚠️ [MongoDB] Message save skipped or failed:', dbErr.message);
    }

    // 2. Send email via Nodemailer
    const transporter = createTransporter();
    let emailSent = false;

    if (transporter) {
      const recipientEmail = process.env.RECEIVER_EMAIL || process.env.EMAIL_USER;
      const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: recipientEmail,
        replyTo: email,
        subject: subject ? `Portfolio Contact: ${subject}` : `New Message from ${name} (Portfolio)`,
        html: `
          <div style="font-family: Arial, sans-serif; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 8px;">
            <h2 style="color: #0284c7; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px;">New Contact Message Received</h2>
            <p style="margin: 8px 0;"><strong>Sender Name:</strong> ${name}</p>
            <p style="margin: 8px 0;"><strong>Sender Email:</strong> <a href="mailto:${email}" style="color: #6366f1;">${email}</a></p>
            <p style="margin: 8px 0;"><strong>Subject:</strong> ${subject || 'No Subject Provided'}</p>
            <div style="margin-top: 16px; padding: 16px; background-color: #ffffff; border-left: 4px solid #0284c7; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);">
              <h4 style="margin: 0 0 8px 0; color: #475569;">Message:</h4>
              <p style="margin: 0; white-space: pre-wrap; line-height: 1.6;">${message}</p>
            </div>
            <p style="font-size: 12px; color: #94a3b8; margin-top: 24px;">This message was submitted via your Portfolio contact form.</p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
        emailSent = true;
        console.log(`✉️ [Nodemailer] Email sent successfully to ${recipientEmail}`);
      } catch (mailErr) {
        console.error('❌ [Nodemailer] Error sending email:', mailErr.message);
      }
    } else {
      console.warn('⚠️ [Nodemailer] EMAIL_USER or EMAIL_PASS not configured in .env file. Email dispatch skipped.');
    }

    return res.status(200).json({
      success: true,
      emailSent: emailSent,
      message: 'Email submitted successfully!'
    });
  } catch (error) {
    console.error('Contact error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Failed to send message. Please try again.' 
    });
  }
});

module.exports = router;
