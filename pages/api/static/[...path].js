import fs from 'fs'
import path from 'path'

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ttf': 'font/ttf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.json': 'application/json',
}

export default async function handler(req, res) {
  const { path: catchAll = [] } = req.query;
  const segments = Array.isArray(catchAll) ? catchAll : [catchAll];
  const relPath = segments.join('/');

  // Allow requests like /api/static/assets/... or /api/static/cache-worker.js
  const repoRoot = process.cwd();
  const filePath = path.join(repoRoot, relPath);

  try {
    const stat = await fs.promises.stat(filePath);
    if (stat.isDirectory()) {
      res.status(404).end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME[ext] || 'application/octet-stream';
    res.setHeader('Content-Type', mime);
    // Prefer small caching for static assets; let service worker manage caching too
    res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    res.status(404).end('Not found');
  }
}
