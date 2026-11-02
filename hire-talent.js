// api/hire-talent.js
// Handles Hire Talent enquiry form → email to Adam Tirta
//
// Dependencies: npm install express nodemailer
// Mount in server.js: app.use('/api/hire-talent', require('./api/hire-talent'))

const express    = require('express');
const nodemailer = require('nodemailer');
const config     = require('./config');

const router = express.Router();

router.post('/', express.json(), async (req, res) => {
  try {
    const { name, company, email, phone, service, message } = req.body;

    if (!name || !company || !email || !service) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const transporter = nodemailer.createTransport(config.smtp);
    await transporter.sendMail({
      from: `"Elitez Indonesia Website" <${config.smtp.auth.user}>`,
      to: config.notifyEmail,
      replyTo: email,
      subject: `Hire Talent Enquiry — ${company} | ${service}`,
      html: `
        <h2>New Hire Talent Enquiry — id.elitez.ai</h2>
        <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
          <tr><td><b>Name</b></td><td>${name}</td></tr>
          <tr><td><b>Company</b></td><td>${company}</td></tr>
          <tr><td><b>Email</b></td><td>${email}</td></tr>
          <tr><td><b>Phone</b></td><td>${phone || '—'}</td></tr>
          <tr><td><b>Service</b></td><td>${service}</td></tr>
          <tr><td><b>Message</b></td><td>${message || '—'}</td></tr>
        </table>
        <p style="margin-top:16px;color:#888;font-size:12px">Submitted via id.elitez.ai Hire Talent form.</p>
      `,
    });

    return res.json({ success: true });
  } catch (err) {
    console.error('hire-talent error:', err);
    return res.status(500).json({ error: 'Failed to send. Please try again.' });
  }
});

module.exports = router;
