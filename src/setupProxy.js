const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // ── OG Image proxy → Express server.js on :4000 ──────────────────────────
  // Allows localhost:3000/og-image-gen and /og-image to work during development.
  // Requires: node server.js running on port 4000 in a separate terminal.
  app.use(
    ['/og-image-gen', '/og-image'],
    createProxyMiddleware({
      target: 'http://localhost:4000',
      changeOrigin: false,
      onError: function(err, req, res) {
        console.error('OG image proxy error (is server.js running on :4000?):', err.message);
        res.status(502).send('OG image server not running. Start it with: node server.js');
      }
    })
  );

  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://dulwich-ai-chat.atalent.xyz',
      changeOrigin: true,
      secure: true,
      timeout: 120000, // 2 minutes timeout
      proxyTimeout: 120000,
      onProxyReq: function(proxyReq, req, res) {
        // Add CORS headers for all requests
        proxyReq.setHeader('Accept', 'application/json');
        proxyReq.setHeader('Content-Type', 'application/json');
        console.log('Proxying request to:', proxyReq.path);
      },
      onProxyRes: function(proxyRes, req, res) {
        // Add CORS headers to response
        proxyRes.headers['Access-Control-Allow-Origin'] = '*';
        proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
        proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Accept, Authorization';
        console.log('Received response with status:', proxyRes.statusCode);
      },
      onError: function(err, req, res) {
        console.error('Proxy error:', err);
        res.status(500).send('Proxy error: ' + err.message);
      }
    })
  );
};
