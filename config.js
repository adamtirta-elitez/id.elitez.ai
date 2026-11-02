// api/config.js — load environment variables
require('dotenv').config();

module.exports = {
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  },
  notifyEmail: process.env.NOTIFY_EMAIL || 'adam.tirta@elitez.asia',
  ats: {
    apiUrl: process.env.ATS_API_URL || 'https://ats.elitez.ai/api',
    apiKey: process.env.ATS_API_KEY,
  },
  port: parseInt(process.env.PORT) || 3000,
};
