const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const PORT = 8999;
const outDir = path.join(__dirname, '../public/images/products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const models = [
  { id: 'sofa-1', file: 'furniture/sofa1.glb', name: 'sofa-1.webp' },
  { id: 'sofa-2', file: 'furniture/sofa2.glb', name: 'sofa-2.webp' },
  { id: 'sofa-3', file: 'furniture/sofa3.glb', name: 'sofa-3.webp' },
  { id: 'sofa-4', file: 'furniture/sofa4.glb', name: 'sofa-4.webp' },
  { id: 'chair-1', file: 'furniture/chair1.glb', name: 'chair-1.webp' },
  { id: 'chair-2', file: 'furniture/chair2.glb', name: 'chair-2.webp' },
  { id: 'chair-3', file: 'furniture/chair3.glb', name: 'chair-3.webp' },
  { id: 'chair-4', file: 'furniture/chair4.glb', name: 'chair-4.webp' },
  { id: 'dining-table-1', file: 'furniture/dining_tabel.glb', name: 'dining-table-1.webp' },
  { id: 'cabinet-1', file: 'furniture/Cabin.glb', name: 'cabinet-1.webp' }
];

let savedCount = 0;

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  if (req.url === '/save' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { filename, dataUrl } = JSON.parse(body);
        const base64Data = dataUrl.replace(/^data:image\/\w+;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
        const outPath = path.join(outDir, filename);
        fs.writeFileSync(outPath, buffer);
        console.log(`Saved [${savedCount + 1}/${models.length}]:`, filename, 'Size:', buffer.length);
        savedCount++;
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: true }));

        if (savedCount >= models.length) {
          console.log('ALL THUMBNAILS RENDERED SUCCESSFULLY!');
          setTimeout(() => {
            process.exit(0);
          }, 1000);
        }
      } catch (e) {
        console.error('Error saving image:', e);
        res.writeHead(500);
        res.end(e.message);
      }
    });
    return;
  }

  // Serve static files
  let filePath = path.join(__dirname, '..', req.url === '/' ? 'scripts/render_client.html' : req.url);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    const ext = path.extname(filePath);
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'text/javascript',
      '.glb': 'model/gltf-binary',
      '.json': 'application/json'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  } else {
    res.writeHead(404);
    res.end('Not found: ' + req.url);
  }
});

server.listen(PORT, () => {
  console.log(`Thumbnail generator listening at http://localhost:${PORT}`);
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const url = `http://localhost:${PORT}/scripts/render_client.html`;
  console.log('Launching headless Chrome to render models...');
  exec(`"${chromePath}" --headless=new --disable-gpu=false --enable-webgl --no-sandbox "${url}"`, (err) => {
    if (err) {
      console.log('Chrome finished or exited:', err.message);
    }
  });
});
