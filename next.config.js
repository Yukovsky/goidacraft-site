/**
 * Minimal Next.js config — used for future customization.
 */

/**
 * Next.js config with rewrites to serve existing static HTML and asset files
 * from the repository root via an API proxy. This avoids duplicating assets
 * while migrating off Express.
 */
export default {
  reactStrictMode: true,
  async rewrites() {
    return [
      // Serve original index.html for root path
      { source: '/', destination: '/api/static/index.html' },
      
      // Serve existing asset files from /assets and /fonts
      { source: '/assets/:path*', destination: '/api/static/assets/:path*' },
      { source: '/fonts/:path*', destination: '/api/static/fonts/:path*' },
      { source: '/cache-worker.js', destination: '/api/static/cache-worker.js' },

      // Preserve existing clean routes that previously mapped to HTML files
      { source: '/mods', destination: '/api/static/mods.html' },
      { source: '/connect', destination: '/api/static/connect.html' },
      { source: '/donors', destination: '/api/static/donors.html' },
      { source: '/console', destination: '/api/static/console.html' },

      // Expose raw HTML files if referenced directly
      { source: '/:file(index|mods|connect|donors|console).html', destination: '/api/static/:file.html' },
    ];
  },
}
