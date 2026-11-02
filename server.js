// api/server.js — Express server entry point
// Run: node api/server.js
// Or with auto-reload: npx nodemon api/server.js

const express = require('express');
const path    = require('path');
const config  = require('./config');

const app = express();

// Serve the static website
app.use(express.static(path.join(__dirname, '..')));

// API routes
app.use('/api/submit-cv',   require('./submit-cv'));
app.use('/api/hire-talent', require('./hire-talent'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', site: 'id.elitez.ai' }));

// Fallback to index.html for SPA
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

app.listen(config.port, () => {
  console.log(`Elitez Indonesia server running on http://localhost:${config.port}`);
});
