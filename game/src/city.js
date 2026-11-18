import {JOBS} from './config.js';
export function makeCity(seed=1){let s=seed>>>0;const rand=()=>((s=(s*1664525+1013904223)>>>0)/4294967296);const boxes=[];const add=(x,y,z,w,h,d,c,kind='box',rot=0)=>boxes.push({x,y,z,w,h,d,c,kind,rot});
// Road grid and wet blocks
add(0,-.24,0,150,.3,126,[.045,.075,.09],'ground');add(-68,-.05,0,15,.12,120,[.015,.075,.09],'water');add(0,-.08,0,150,.08,2,[.28,.31,.25],'stripe');
for(let x=-54;x<=60;x+=18){add(x,-.08,0,9,.11,126,[.075,.095,.105],'road');for(let z=-57;z<=57;z+=10)add(x,-.005,z,3,.015,.18,[.65,.47,.29],'dash');}
for(let z=-54;z<=54;z+=18)add(0,-.065,z,150,.10,9,[.066,.086,.093],'road');
// District architecture: procedural windows as emissive facades, city blocks
for(let gx=-60;gx<=60;gx+=18)for(let gz=-54;gz<=54;gz+=18){if(Math.abs(gx)<8||Math.abs(gz)<8||gx<-60)continue;let w=10+rand()*5,d=10+rand()*5,h=5+rand()*18;let x=gx+(rand()-.5)*3,z=gz+(rand()-.5)*3;let base=[[.12,.16,.19],[.17,.15,.18],[.13,.20,.21],[.21,.17,.15]][Math.floor(rand()*4)];add(x,h/2,z,w,h,d,base,'building');for(let yy=1.4;yy<h-1;yy+=2.6)for(let xx=-w/2+1;xx<w/2;xx+=2.4){if(rand()>.34)add(x+xx,yy,z+d/2+.03,1.05,.88,.08,rand()>.5?[.91,.48,.23]:[.18,.72,.72],'window');} }
// Dock cranes, containers, lamps and puddle sheen
for(let i=0;i<7;i++){let x=-54+i*13,z=40+rand()*14;add(x,5,z,1,10,1,[.53,.32,.15],'crane');add(x+4,10,z,9,.7,1,[.58,.39,.18],'crane');add(x+7,7,z,1,6,1,[.46,.28,.15],'crane');for(let j=0;j<4;j++)add(x+j*2,1.2,z-6-j%2*3,4,2.4,3,[.36+j*.03,.14+j*.03,.12],'container');}
for(let i=0;i<22;i++){let x=-60+rand()*124,z=-58+rand()*116;add(x,.03,z,4+rand()*8,.012,2+rand()*3,[[.12,.33,.39],[.43,.19,.27],[.58,.39,.19]][i%3],'puddle');}
for(let x=-54;x<=60;x+=18)for(let z=-50;z<=50;z+=24){add(x+6,3,z, .22,6,.22,[.49,.54,.47],'lamp');add(x+6,6,z,1.3,.18,1.3,[.97,.61,.24],'glow');}
// Distinct targets, crews, parked cars, traffic, pedestrians
JOBS.forEach((j,i)=>{let [name,dist,x,z]=j;add(x,1.8,z,12,3.6,10,[.18,.22,.23],'target');add(x-13,.12,z+12,1.1,.18,1.1,[.18,.83,.77],'marker');add(x+13,.12,z+12,1.1,.18,1.1,[.18,.83,.77],'marker');add(x,3.7,z,12,.2,10,[.76,.39,.21],'targetroof');add(x,1,z+6.5,1,.18,1,[.94,.58,.23],'marker');for(let g=0;g<3;g++)add(x-4+g*4,1,z-2,0.55,2,.55,[.76,.7,.53],'guard');});
return boxes;}
