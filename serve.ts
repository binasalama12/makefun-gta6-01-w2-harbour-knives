import { createServer } from 'node:http';
import { createReadStream, statSync } from 'node:fs';
import { extname, resolve, sep } from 'node:path';
const root=resolve('game'),port=Number(process.env.PORT||8080),types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json'};
createServer((req,res)=>{let path=decodeURIComponent(new URL(req.url||'/',`http://${req.headers.host}`).pathname);if(path==='/')path='/index.html';let file=resolve(root,'.'+path);if(file!==root&&!file.startsWith(root+sep)){res.writeHead(403).end('Forbidden');return}try{if(!statSync(file).isFile())throw Error();res.writeHead(200,{'Content-Type':types[extname(file)]||'application/octet-stream','Cache-Control':'no-store'});createReadStream(file).pipe(res)}catch{res.writeHead(404).end('Not found')}}).listen(port,'127.0.0.1',()=>console.log(`Port Azahar running at http://127.0.0.1:${port}`));
