/**
 * Background Polling + Shared Cache Server
 * Polls external API every 5 minutes and serves cached data
 */

const http = require('http');
const https = require('https');

// ==================== CONFIGURATION ====================
const CONFIG = {
  PORT: process.env.PORT || 3000,
  POLL_INTERVAL: 5 * 60 * 1000, // 5 minutes
  EXTERNAL_API_URL: 'https://api.mcsrvstat.us/2/goidacraft.aboba.host',
  REQUEST_TIMEOUT: 10000,
};

// ==================== SHARED CACHE ====================
const CACHE = {
  serverStatus: null,
  lastUpdate: 0,
  updateError: null,
};

// ==================== API POLLER (Background Worker) ====================
const poller = {
  /**
   * Fetch data from external API with proper headers
   */
  fetchFromExternalAPI: async (retryCount = 0) => {
    return new Promise((resolve, reject) => {
      const options = {
        timeout: CONFIG.REQUEST_TIMEOUT,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'application/json',
          'Connection': 'keep-alive',
        },
      };

      const request = https.get(CONFIG.EXTERNAL_API_URL, options, (response) => {
        let data = '';

        response.on('data', (chunk) => {
          data += chunk;
        });

        response.on('end', () => {
          try {
            // Accept 200-299 as success
            if (response.statusCode >= 200 && response.statusCode < 300) {
              resolve(JSON.parse(data));
            } else if (response.statusCode === 403) {
              // 403 Forbidden - API might be rate limiting or blocking
              reject(new Error(`HTTP ${response.statusCode} (Forbidden) - API may be rate limiting`));
            } else if (response.statusCode === 429) {
              // 429 Too Many Requests - retry with exponential backoff
              const retryAfter = response.headers['retry-after'] || (Math.pow(2, retryCount) * 1000);
              reject(new Error(`HTTP ${response.statusCode} (Too Many Requests) - Retry after ${retryAfter}ms`));
            } else if (response.statusCode >= 500) {
              // 5xx server errors - likely temporary
              reject(new Error(`HTTP ${response.statusCode} (Server Error) - API may be temporarily unavailable`));
            } else {
              reject(new Error(`HTTP ${response.statusCode}`));
            }
          } catch (error) {
            reject(new Error(`JSON Parse Error: ${error.message}`));
          }
        });
      });

      request.on('error', (error) => {
        reject(new Error(`Network Error: ${error.message}`));
      });

      request.on('timeout', () => {
        request.destroy();
        reject(new Error('Request timeout (10s)'));
      });
    });
  },

  /**
   * Update cache with fresh data from external API
   */
  updateCache: async () => {
    try {
      const data = await poller.fetchFromExternalAPI();
      CACHE.serverStatus = data;
      CACHE.lastUpdate = Date.now();
      CACHE.updateError = null;
      
      const timestamp = new Date().toISOString();
      console.log(`[${timestamp}] ✓ Cache updated successfully`);
      console.log(`  Players: ${data.players?.online}/${data.players?.max} | Status: ${data.online ? 'ONLINE' : 'OFFLINE'}`);
    } catch (error) {
      CACHE.updateError = error.message;
      const timestamp = new Date().toISOString();
      console.error(`[${timestamp}] ✗ Cache update failed: ${error.message}`);
      
      // Provide hints for common errors
      if (error.message.includes('403')) {
        console.error(`  💡 Hint: API might be rate limiting. Check if:`);
        console.error(`     - External API URL is correct: ${CONFIG.EXTERNAL_API_URL}`);
        console.error(`     - Your IP is not blocked`);
        console.error(`     - API requires authentication`);
        console.error(`  📝 Fallback: Client will use external API directly if needed`);
      } else if (error.message.includes('429')) {
        console.error(`  💡 Hint: Too many requests. Waiting before retry...`);
      } else if (error.message.includes('timeout')) {
        console.error(`  💡 Hint: Request took too long. Check network or API status.`);
      }
    }
  },

  /**
   * Start background polling
   */
  start: async () => {
    console.log(`\n🚀 Background Poller started (interval: 5 minutes)`);
    
    // Initial fetch
    await poller.updateCache();
    
    // Schedule periodic updates
    setInterval(poller.updateCache, CONFIG.POLL_INTERVAL);
  },
};

// ==================== HTTP SERVER ====================
const server = http.createServer(async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // API endpoint: /api/server-status
  if (req.url === '/api/server-status' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    const response = {
      success: CACHE.serverStatus !== null,
      data: CACHE.serverStatus,
      lastUpdate: CACHE.lastUpdate,
      updateError: CACHE.updateError,
      timestamp: Date.now(),
      nextUpdate: new Date(CACHE.lastUpdate + CONFIG.POLL_INTERVAL).toISOString(),
    };

    res.writeHead(200);
    res.end(JSON.stringify(response, null, 2));
    return;
  }

  // Health check endpoint
  if (req.url === '/health' && req.method === 'GET') {
    res.setHeader('Content-Type', 'application/json');
    res.writeHead(200);
    res.end(JSON.stringify({
      status: 'ok',
      cache: CACHE.serverStatus ? 'active' : 'empty',
      lastUpdate: CACHE.lastUpdate,
    }));
    return;
  }

  // 404
  res.writeHead(404);
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// ==================== STARTUP ====================
server.listen(CONFIG.PORT, () => {
  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`📡 API Server running on http://localhost:${CONFIG.PORT}`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`\n📍 Endpoints:`);
  console.log(`   GET /api/server-status  - Get cached server data`);
  console.log(`   GET /health             - Health check\n`);
  
  poller.start();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('\n\nShutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
