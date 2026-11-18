import { JOBS } from './config.js';

// A seeded block plan keeps roads, targets, and patrol landmarks in fixed places.
export function makeCity(seed = 1) {
  let state = seed >>> 0;
  const random = () => ((state = (state * 1664525 + 1013904223) >>> 0) / 4294967296);
  const city = [];
  const box = (x,y,z,w,h,d,c,kind='building',rot=0) => city.push({x,y,z,w,h,d,c,kind,rot});
  box(0,-.24,0,150,.3,126,[.045,.075,.09],'ground');
  box(-68,-.05,0,15,.12,120,[.015,.075,.09],'water');
  box(0,-.08,0,150,.08,2,[.28,.31,.25],'stripe');
  for (let x=-54;x<=60;x+=18) {
    box(x,-.08,0,9,.11,126,[.075,.095,.105],'road');
    for(let z=-57;z<=57;z+=10) box(x,-.005,z,3,.015,.18,[.65,.47,.29],'dash');
  }
  for(let z=-54;z<=54;z+=18) box(0,-.065,z,150,.1,9,[.066,.086,.093],'road');
  const facades=[[.12,.16,.19],[.17,.15,.18],[.13,.2,.21],[.21,.17,.15]];
  for(let gx=-60;gx<=60;gx+=18) for(let gz=-54;gz<=54;gz+=18) {
    if(Math.abs(gx)<8||Math.abs(gz)<8) continue;
    const w=10+random()*5,d=10+random()*5,h=5+random()*18,x=gx+(random()-.5)*3,z=gz+(random()-.5)*3;
    box(x,h/2,z,w,h,d,facades[Math.floor(random()*facades.length)]);
    for(let y=1.4;y<h-1;y+=2.6) for(let xx=-w/2+1;xx<w/2;xx+=2.4)
      if(random()>.34) box(x+xx,y,z+d/2+.03,1.05,.88,.08,random()>.5?[.91,.48,.23]:[.18,.72,.72],'window');
  }
  for(let i=0;i<7;i++) {const x=-54+i*13,z=40+random()*14;box(x,5,z,1,10,1,[.53,.32,.15],'crane');box(x+4,10,z,9,.7,1,[.58,.39,.18],'crane');box(x+7,7,z,1,6,1,[.46,.28,.15],'crane');for(let j=0;j<4;j++)box(x+j*2,1.2,z-6-(j%2)*3,4,2.4,3,[.36+j*.03,.14+j*.03,.12],'container');}
  for(let i=0;i<22;i++) box(-60+random()*124,.03,-58+random()*116,4+random()*8,.012,2+random()*3,[[.12,.33,.39],[.43,.19,.27],[.58,.39,.19]][i%3],'puddle');
  for(let x=-54;x<=60;x+=18) for(let z=-50;z<=50;z+=24){box(x+6,3,z,.22,6,.22,[.49,.54,.47],'lamp');box(x+6,6,z,1.3,.18,1.3,[.97,.61,.24],'glow');}
  JOBS.forEach(([,district,x,z])=>{box(x,1.8,z,12,3.6,10,[.18,.22,.23],'target');box(x,3.7,z,12,.2,10,[.76,.39,.21],'targetroof');for(const dx of [-13,13])box(x+dx,.12,z+12,1.1,.18,1.1,[.18,.83,.77],'scout');for(let g=0;g<3;g++)box(x-4+g*4,1,z-2,.55,2,.55,[.76,.7,.53],'guard');});
  return city;
}
