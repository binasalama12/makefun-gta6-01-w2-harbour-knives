import {spawn} from 'node:child_process';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';import {join,resolve} from 'node:path';
const root=resolve('.'),port=Number(process.env.PORT||8091),chrome=join(process.env.HOME,'.cache/ms-playwright/chromium-1194/chrome-linux/chrome'),profile=await mkdtemp(join(tmpdir(),'hk-chrome-'));
const server=spawn('node',['serve.ts'],{cwd:root,env:{...process.env,PORT:String(port)},stdio:'ignore'});
let browser,ws,seq=0,pending=new Map();
try{
 for(let i=0;i<50;i++){try{await fetch(`http://127.0.0.1:${port}`);break}catch{await new Promise(r=>setTimeout(r,100))}}
 browser=spawn(chrome,['--headless=new','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox','--window-size=1280,720','--remote-debugging-port=0',`--user-data-dir=${profile}`,'about:blank'],{stdio:'ignore'});
 let active='';for(let i=0;i<100;i++){try{active=(await readFile(join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];if(active)break}catch{}await new Promise(r=>setTimeout(r,100))}if(!active)throw Error('Chromium did not expose CDP');
 let targets=[];for(let i=0;i<40;i++){try{targets=await(await fetch(`http://127.0.0.1:${active}/json/list`)).json();if(targets.some(x=>x.type==='page'))break}catch{}await new Promise(r=>setTimeout(r,100))}
 let page=targets.find(x=>x.type==='page');ws=new WebSocket(page.webSocketDebuggerUrl);await new Promise((resolve,reject)=>{ws.onopen=resolve;ws.onerror=reject});
 ws.onmessage=e=>{let m=JSON.parse(e.data),p=pending.get(m.id);if(p){pending.delete(m.id);m.error?p.reject(Error(m.error.message)):p.resolve(m.result)}};
 const cmd=(method,params={})=>new Promise((resolve,reject)=>{let id=++seq;pending.set(id,{resolve,reject});ws.send(JSON.stringify({id,method,params}))});
 const evaljs=async(expression)=>{let r=await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error(r.exceptionDetails.text);return r.result?.value};
 await cmd('Page.enable');await cmd('Runtime.enable');await cmd('Emulation.setDeviceMetricsOverride',{width:1280,height:720,deviceScaleFactor:1,mobile:false});
 for(const [shot,file] of [['cover','1-cover.jpg'],['title','2-title.jpg'],['fence','3-fence.jpg'],['end','4-end.jpg']]){await cmd('Page.navigate',{url:`http://127.0.0.1:${port}/?shot=${shot}&seed=1`});await new Promise(r=>setTimeout(r,2100));let data=(await cmd('Page.captureScreenshot',{format:'jpeg',quality:88,fromSurface:true})).data;await writeFile(join(root,'screenshots',file),Buffer.from(data,'base64'));console.log(file,Buffer.byteLength(data,'base64'));}
 await cmd('Page.navigate',{url:`http://127.0.0.1:${port}/`});await new Promise(r=>setTimeout(r,1100));await evaljs("document.dispatchEvent(new KeyboardEvent('keydown',{code:'Enter',key:'Enter',bubbles:true}))");await new Promise(r=>setTimeout(r,300));let objective=await evaljs("document.querySelector('#objective').textContent");let a=Number(await evaljs("document.querySelector('#speed').textContent"));await evaljs("for(let i=0;i<40;i++)document.dispatchEvent(new KeyboardEvent('keydown',{code:'KeyW',key:'w',bubbles:true}))");await new Promise(r=>setTimeout(r,1700));let b=Number(await evaljs("document.querySelector('#speed').textContent"));console.log(JSON.stringify({objective,speedBefore:a,speedAfter:b,started:await evaljs("!document.querySelector('#hud').classList.contains('hidden')")}));if(!objective||a===b)throw Error('Live interaction probe failed');
}finally{try{ws?.close()}catch{}browser?.kill('SIGTERM');server.kill('SIGTERM');await rm(profile,{recursive:true,force:true})}
