#!/usr/bin/env node
/**
 * Zero-dependency static server for the exported Next.js build (`out/`).
 *
 * `next start` cannot serve `output: 'export'` builds, and the production
 * build is prefixed with the GitHub Pages basePath. This server reproduces the
 * exact Pages behaviour locally:
 *
 *   /                                   → redirects to the base path
 *   /oxford-3000-platform/…             → serves out/…
 *   /oxford-3000-platform/design/       → serves out/design/index.html
 *
 * Usage: npm start        (after npm run build)
 *        PORT=4000 npm start
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'out');

/**
 * The base path is detected from the exported HTML itself, so the server always
 * matches whatever prefix the build used (root, GitHub Pages, or custom).
 */
function detectBasePath() {
  if (process.env.NEXT_PUBLIC_BASE_PATH !== undefined) {
    return process.env.NEXT_PUBLIC_BASE_PATH.replace(/\/+$/, '');
  }
  try {
    const html = fs.readFileSync(path.join(outDir, 'index.html'), 'utf8');
    const match = html.match(/src="([^"]*?)\/_next\//);
    return (match?.[1] || '').replace(/\/+$/, '');
  } catch {
    return '';
  }
}

const BASE_PATH = detectBasePath();
const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json',
};

if (!fs.existsSync(outDir)) {
  console.error('\n✖ No `out/` directory found. Run `npm run build` first.\n');
  process.exit(1);
}

function sendFile(res, filePath, statusCode = 200) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const stream = fs.createReadStream(filePath);
  res.writeHead(statusCode, {
    'Content-Type': type,
    'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable',
  });
  stream.pipe(res);
  stream.on('error', () => {
    res.destroy();
  });
}

function resolveTarget(urlPath) {
  const decoded = decodeURIComponent(urlPath.split('?')[0]);
  const relative = (BASE_PATH ? decoded.slice(BASE_PATH.length) : decoded).replace(/^\/+/, '');
  const candidate = path.join(outDir, relative);

  // Prevent path traversal
  if (!candidate.startsWith(outDir)) return null;

  if (fs.existsSync(candidate) && fs.statSync(candidate).isDirectory()) {
    const indexFile = path.join(candidate, 'index.html');
    return fs.existsSync(indexFile) ? indexFile : null;
  }
  if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return candidate;
  }
  const htmlFallback = `${candidate}.html`;
  if (fs.existsSync(htmlFallback)) return htmlFallback;
  return null;
}

const server = http.createServer((req, res) => {
  const urlPath = req.url || '/';

  // Root → GitHub Pages project path (no-op when serving from the domain root)
  if (
    BASE_PATH &&
    (urlPath === '/' || urlPath === '' || urlPath === '/index.html')
  ) {
    res.writeHead(302, { Location: `${BASE_PATH}/` });
    res.end();
    return;
  }

  // Anything outside the base path (other than the redirect above) is unknown
  if (BASE_PATH && !urlPath.startsWith(`${BASE_PATH}/`) && urlPath !== BASE_PATH) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end(`Not found. This build is served from ${BASE_PATH}/`);
    return;
  }

  const file = resolveTarget(urlPath);
  if (file) {
    sendFile(res, file);
    return;
  }

  const notFound = path.join(outDir, '404.html');
  if (fs.existsSync(notFound)) {
    sendFile(res, notFound, 404);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
  res.end('404 Not Found');
});

server.listen(PORT, HOST, () => {
  console.log(`\n  Oxford 3000 static export`);
  console.log(`  ➜  Local:   http://localhost:${PORT}${BASE_PATH}/`);
  console.log(`  ➜  Network: http://${HOST}:${PORT}${BASE_PATH}/\n`);
  if (!BASE_PATH) console.log('  (serving from the domain root)\n');
});
