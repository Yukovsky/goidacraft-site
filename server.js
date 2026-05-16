#!/usr/bin/env node

/**
 * GoidaCraft Site Server
 * Serves static files with URL routing for clean paths
 * Maps /mods → mods.html, /connect → connect.html, etc.
 */

const express = require('express');
const path = require('path');
const app = express();

// Route handlers - map clean paths to HTML files
// These MUST come BEFORE the static middleware
const routes = {
  '/': 'index.html',
  '/mods': 'mods.html',
  '/connect': 'connect.html',
  '/donors': 'donors.html',
  '/console': 'console.html'
};

// Register routes first (before static files)
Object.entries(routes).forEach(([urlPath, htmlFile]) => {
  app.get(urlPath, (req, res) => {
    res.sendFile(path.join(__dirname, htmlFile));
  });
});

// Query string support for console
app.get('/console', (req, res) => {
  res.sendFile(path.join(__dirname, 'console.html'));
});

// Serve static files from current directory (assets, fonts, etc.)
// This comes AFTER route handlers so it doesn't interfere
app.use(express.static('.', {
  // Don't serve HTML files as static files, they're routed above
  setHeaders: (res, path) => {
    if (path.endsWith('.html')) {
      res.setHeader('Cache-Control', 'no-cache');
    }
  }
}));

// 404 handler - serve index.html for unknown routes (for client-side routing if needed)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚂 GoidaCraft server running at http://localhost:${PORT}`);
  console.log(`   Routes: / /mods /connect /donors /console`);
});
