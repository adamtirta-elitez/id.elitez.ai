// api/submit-cv.js
// Handles CV file upload → email to Adam + POST to ats.elitez.ai
//
// Dependencies: npm install express multer nodemailer node-fetch
// Mount in server.js: app.use('/api/submit-cv', require('./api/submit-cv'))

const express = require('express');
const multer  = require('multer');
const nodemailer = require('nodemailer');
const fetch   = require('node-fetch');
const config  = require('./config');

const router  = express.Router();
const upload  = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter: (req, file, cb) => {
    const allowed = ['application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    cb(null, allowed.includes(file.mimetype));
  },
});

router.post('/', upload.single('cv'), async (req, res) => {
  try {
    const { name, email, phone, location, jobTitle, industry, opportunityType, note } = req.body;
    const cvFile = req.file;

    if (!name || !email || !phone || !industry) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    if (!cvFile) {
      return res.status(400).json({ error: 'CV file required' });
    }

    // ── 1. Send email to Adam Tirta ──────────────────────────────────────
    const transporter = nodemailer.createTransport(config.smtp);
    await transporter.sendMail({
      from: `"Elitez Indonesia Website" <${config.smtp.auth.user}>`,
      to: config.notifyEmail,
      replyTo: email,
      subject: `New CV Submission — ${name} | ${jobTitle || industry}`,
      html: `
        <h2>New CV Submission — id.elitez.ai</h2>
        <table cellpadding="6" style="border-collapse:collapse;font-family:sans-serif;font-size:14px">
          <tr><td><b>Name</b></td><td>${name}</td></tr>
          <tr><td><b>Email</b></td><td>${email}</td></tr>
          <tr><td><b>Phone</b></td><td>${phone}</td></tr>
          <tr><td><b>Location</b></td><td>${location || '—'}</td></tr>
          <tr><td><b>Current Title</b></td><td>${jobTitle || '—'}</td></tr>
          <tr><td><b>Industry</b></td><td>${industry}</td></tr>
          <tr><td><b>Opportunity Type</b></td><td>${opportunityType || '—'}</td></tr>
          <tr><td><b>Note</b></td><td>${note || '—'}</td></tr>
        </table>
        <p style="margin-top:16px;color:#888;font-size:12px">CV attached. Also synced to ats.elitez.ai.</p>
      `,
      attachments: [{
        filename: cvFile.originalname,
        content:  cvFile.buffer,
        contentType: cvFile.mimetype,
      }],
    });

    // ── 2. POST candidate to ats.elitez.ai ──────────────────────────────
    if (config.ats.apiKey) {
      await fetch(`${config.ats.apiUrl}/candidates`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.ats.apiKey}`,
        },
        body: JSON.stringify({
          source: 'id.elitez.ai',
          name, email, phone, location,
          currentTitle: jobTitle,
          industry,
          opportunityType,
          notes: note,
          cvFilename: cvFile.originalname,
          submittedAt: new Date().toISOString(),
        }),
      });
    }

    return res.json({ success: true });
  } catch (err) {
    console.error('submit-cv error:', err);
    return res.status(500).json({ error: 'Submission failed. Please try again.' });
  }
});

module.exports = router;
