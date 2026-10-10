// Zero-dependency static server for Vector with full HTTP and HTTPS support.
//   node server.mjs [port]              ->  http://localhost:5173 (and https://localhost:5443)
//   node server.mjs [port] --https      ->  https://localhost:5173
import { createServer as createHttpServer } from 'node:http';
import { createServer as createHttpsServer } from 'node:https';
import { readFile, stat } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(fileURLToPath(new URL('.', import.meta.url)));
const isHttpsOnly = process.argv.includes('--https') || process.env.HTTPS === 'true';
const portArg = process.argv.slice(2).find((a) => !a.startsWith('--') && !isNaN(Number(a)));
const PORT = Number(portArg || process.env.PORT || 5173);

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.wasm': 'application/wasm', '.task': 'application/octet-stream',
  '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.map': 'application/json',
};

const certPath = join(ROOT, 'cert.pem');
const keyPath = join(ROOT, 'key.pem');
const hasSslCerts = existsSync(certPath) && existsSync(keyPath);

function getSslCredentials() {
  if (!hasSslCerts) return null;
  try {
    return {
      key: readFileSync(keyPath),
      cert: readFileSync(certPath),
    };
  } catch (err) {
    console.warn('⚠️ Could not load SSL certificates:', err.message);
    return null;
  }
}

function createHandler(protocol = 'http') {
  return async (req, res) => {
    try {
      const host = req.headers.host || `localhost:${PORT}`;
      const url = new URL(req.url, `${protocol}://${host}`);
      let path = normalize(join(ROOT, decodeURIComponent(url.pathname)));
      if (!path.startsWith(ROOT)) { res.writeHead(403).end('forbidden'); return; }
      if ((await stat(path).catch(() => null))?.isDirectory()) path = join(path, 'index.html');
      const body = await readFile(path);
      res.writeHead(200, {
        'Content-Type': TYPES[extname(path).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache',
      });
      res.end(body);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' }).end('not found');
    }
  };
}

function startServer() {
  const ssl = getSslCredentials();

  if (isHttpsOnly) {
    if (!ssl) {
      console.error('❌ Cannot start HTTPS: cert.pem or key.pem not found in project directory.');
      process.exit(1);
    }
    const server = createHttpsServer(ssl, createHandler('https'));
    server.on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${PORT} in use, retrying on ${PORT + 1}...`);
        startHttpsOnPort(PORT + 1, ssl);
      } else {
        console.error(err);
      }
    });
    server.listen(PORT, () => {
      console.log(`\n🔒 Vector running securely over HTTPS:`);
      console.log(`   👉 https://localhost:${PORT}\n`);
    });
    return;
  }

  // Default mode: start HTTP server on PORT
  const httpServer = createHttpServer(createHandler('http'));
  httpServer.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${PORT} in use, retrying on ${PORT + 1}...`);
      startHttpOnPort(PORT + 1);
    } else {
      console.error(err);
    }
  });

  httpServer.listen(PORT, () => {
    console.log(`\n✨ Vector running at:`);
    console.log(`   🌐 HTTP:  http://localhost:${PORT}`);

    // If SSL certificates exist, also launch HTTPS companion on 5443
    if (ssl) {
      const httpsPort = PORT === 5173 ? 5443 : PORT + 100;
      const httpsServer = createHttpsServer(ssl, createHandler('https'));
      httpsServer.on('error', (e) => {
        if (e.code !== 'EADDRINUSE') console.warn('HTTPS companion note:', e.message);
      });
      httpsServer.listen(httpsPort, () => {
        console.log(`   🔒 HTTPS: https://localhost:${httpsPort}`);
      });
    }
    console.log(`\nℹ️  To force HTTPS on port 5173: npm run https\n`);
  });
}

function startHttpOnPort(port) {
  const s = createHttpServer(createHandler('http'));
  s.on('error', (e) => {
    if (e.code === 'EADDRINUSE') startHttpOnPort(port + 1);
  });
  s.listen(port, () => console.log(`   🌐 HTTP: http://localhost:${port}`));
}

function startHttpsOnPort(port, ssl) {
  const s = createHttpsServer(ssl, createHandler('https'));
  s.on('error', (e) => {
    if (e.code === 'EADDRINUSE') startHttpsOnPort(port + 1, ssl);
  });
  s.listen(port, () => console.log(`   🔒 HTTPS: https://localhost:${port}`));
}

startServer();
