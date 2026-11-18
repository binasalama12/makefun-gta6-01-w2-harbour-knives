import { JOBS, UPGRADES, clamp } from './config.js';
import { makeCity } from './city.js';

export function seeded(seed=1){let s=seed>>>0;return()=>((s=(s*1664525+1013904223)>>>0)/4294967296)}
export function makeRun(seed=1){const random=seeded(seed);const vehicle=(x,z,a,color,police=false)=>({x,y:.62,z,a,v:0,car:true,police,color,hull:100});
 const traffic=[];for(let i=0;i<18;i++){const vertical=i%2===0,dir=random()>.5?1:-1,x=vertical?-54+Math.floor(random()*7)*18+(dir>0?-1.2:1.2):-60+random()*120,z=vertical?-55+random()*110:-54+Math.floor(random()*7)*18+(dir>0?1.2:-1.2),a=vertical?(dir>0?0:Math.PI):(dir>0?Math.PI/2:-Math.PI/2);traffic.push(vehicle(x,z,a,i%3===0?[.68,.27,.17]:[.15,.49,.58]));}
 const peds=Array.from({length:25},()=>({x:-58+random()*116,z:-54+random()*108,a:random()*6.28,run:false}));
 const state={running:false,job:0,phase:0,scouts:0,bags:0,cash:0,wanted:0,alarm:0,health:100,caught:0,near:0,takes:[],bagCounts:[],upgrades:[],time:0};
 return {state,random,vehicle,city:makeCity(seed),traffic,peds,player:vehicle(-44,48,0,[.57,.25,.16]),police:[],loot:[],seedLoot(){const [x,z]=[JOBS[state.job][2],JOBS[state.job][3]];this.loot=Array.from({length:6},(_,i)=>({x:x-4+i%3*4,z:z+2+Math.floor(i/3)*3,taken:false}));},jobPos(){return [JOBS[state.job][2],JOBS[state.job][3]];},scoutPos(n){const [x,z]=this.jobPos();return n===0?[x-13,z+12]:[x+13,z+12];},clamp};
}
export { JOBS, UPGRADES, clamp };
