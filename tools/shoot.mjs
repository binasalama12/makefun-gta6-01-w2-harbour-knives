import { spawn } from 'node:child_process';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { homedir, tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const root = resolve('.');
const port = Number(process.env.PORT || 8091);
const address = `http://127.0.0.1:${port}`;
const chromePath = join(homedir(), '.cache', 'ms-playwright', 'chromium-1194', 'chrome-linux', 'chrome');
const profile = await mkdtemp(join(tmpdir(), 'harbour-shots-'));
const shots = JSON.parse(await readFile(join(root, 'shots.json'), 'utf8'));
const server = spawn('node', ['serve.ts'], {
  cwd: root,
  env: { ...process.env, PORT: String(port) },
  stdio: 'ignore'
});
let browser;
let socket;
let sequence = 0;
const waiting = new Map();

try {
  let serverReady = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    try {
      const response = await fetch(address);
      if (response.ok) { serverReady = true; break; }
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!serverReady) throw new Error('Game server did not become ready');

  browser = spawn(chromePath, [
    '--headless=new', '--no-sandbox', '--disable-dev-shm-usage',
    '--use-angle=swiftshader', '--enable-unsafe-swiftshader',
    '--window-size=1280,720', '--remote-debugging-port=0',
    `--user-data-dir=${profile}`, 'about:blank'
  ], { stdio: 'ignore' });

  let debugPort;
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      debugPort = (await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\\n')[0].trim();
      if (debugPort) break;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  if (!debugPort) throw new Error('Chromium did not expose its DevTools port');

  let pages = [];
  for (let attempt = 0; attempt < 40; attempt++) {
    try {
      pages = await (await fetch(`http://127.0.0.1:${debugPort}/json/list`)).json();
      if (pages.some(page => page.type === 'page')) break;
    } catch {}
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  const page = pages.find(target => target.type === 'page');
  if (!page) throw new Error('Chromium page target was not found');
  socket = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true });
    socket.addEventListener('error', reject, { once: true });
  });
  socket.addEventListener('message', event => {
    const message = JSON.parse(event.data);
    const task = waiting.get(message.id);
    if (!task) return;
    waiting.delete(message.id);
    if (message.error) task.reject(new Error(message.error.message));
    else task.resolve(message.result);
  });

  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++sequence;
    waiting.set(id, { resolve, reject });
    socket.send(JSON.stringify({ id, method, params }));
  });
  await command('Page.enable');
  await command('Emulation.setDeviceMetricsOverride', {
    width: 1280, height: 720, deviceScaleFactor: 1, mobile: false
  });
  await mkdir(join(root, 'screenshots'), { recursive: true });

  for (const shot of shots) {
    const scene = shot.file.replace(/^\d+-/, '').replace(/\.jpg$/i, '');
    await command('Page.navigate', { url: `${address}/?shot=${encodeURIComponent(scene)}&seed=1` });
    await new Promise(resolve => setTimeout(resolve, 2100));
    const image = await command('Page.captureScreenshot', {
      format: 'jpeg', quality: 88, fromSurface: true
    });
    await writeFile(join(root, 'screenshots', shot.file), Buffer.from(image.data, 'base64'));
    console.log(`Saved ${shot.file} (${shot.width}x${shot.height})`);
  }
} finally {
  try { socket?.close(); } catch {}
  browser?.kill('SIGTERM');
  server.kill('SIGTERM');
  await rm(profile, { recursive: true, force: true });
}
