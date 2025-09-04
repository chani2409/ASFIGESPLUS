*(Canvas partículas con `prefers-reduced-motion`)*
```js
(function(){
if(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
const canvas=document.getElementById('fx3d-extra'); if(!canvas) return;
const ctx=canvas.getContext('2d',{alpha:true}); const DPR=Math.min(window.devicePixelRatio||1,2);
let W=0,H=0,last=performance.now(); let particles=[]; const mouse={x:0,y:0,down:false};
function resize(){ W=canvas.width=Math.floor(innerWidth*DPR); H=canvas.height=Math.floor(innerHeight*DPR); canvas.style.width=innerWidth+'px'; canvas.style.height=innerHeight+'px' }
resize(); addEventListener('resize',resize);
addEventListener('pointermove',e=>{mouse.x=e.clientX*DPR;mouse.y=e.clientY*DPR},{passive:true}); addEventListener('pointerdown',()=>mouse.down=true); addEventListener('pointerup',()=>mouse.down=false);
const sections=[...document.querySelectorAll('section')];
const palettes={default:['#00F0FF','#6CFF00','#FF00EA','#FFD000'],'#inicio':['#7CD9FF','#B38CFF','#7FFFB6'],'#proyectos':['#00FFFF','#00FF99','#00AAFF'],'#clientes':['#00EAFF','#FF00CC','#FFD200'],'#capacidades':['#BFFF00','#00FFD5','#B300FF'],'#contacto':['#00FFD0','#80FF00','#00AAFF']};
let palette=palettes.default;
function updatePalette(){ const mid=innerHeight/2; let id='default'; for(const sec of sections){ const r=sec.getBoundingClientRect(); if(r.top<=mid && r.bottom>=mid){ id='#'+(sec.id||''); break } } palette=palettes[id]||palettes.default }
const MAX=Math.min(180,Math.floor((innerWidth*innerHeight)/22000));
function makeParticle(){ const ang=Math.random()*Math.PI*2; const speed=0.04+Math.random()*0.25; return {x:Math.random()*W,y:Math.random()*H,vx:Math.cos(ang)*speed,vy:Math.sin(ang)*speed,size:3*(0.8+Math.random()*2.2)*DPR,hue:palette[(Math.random()*palette.length)|0],j:Math.random()*Math.PI*2} }
function spawn(n){ for(let i=0;i<n;i++) particles.push(makeParticle()) } spawn(MAX);
function hexToRgba(hex,a){ const h=hex.replace('#',''); const num=parseInt(h,16); const r=(num>>16)&255,g=(num>>8)&255,b=num&255; return `rgba(${r},${g},${b},${a})` }
function tick(t){ const dt=Math.min(32,t-last); last=t; updatePalette(); ctx.clearRect(0,0,W,H); ctx.globalCompositeOperation='lighter';
for(let i=0;i<particles.length;i++){
const p=particles[i]; const dx=mouse.x-p.x,dy=mouse.y-p.y; const d2=dx*dx+dy*dy+10000; const pull=12000/d2; const f=mouse.down?-pull*2.2:pull;
p.vx+=(dx>0?1:-1)*f*0.001*dt; p.vy+=(dy>0?1:-1)*f*0.001*dt; p.vx+=Math.cos(t*0.0010+p.j)*0.005; p.vy+=Math.sin(t*0.0013+p.j)*0.005; p.vx*=0.995; p.vy*=0.995; p.x+=p.vx*dt*0.8; p.y+=p.vy*dt*0.8;
if(p.x<-20)p.x=W+20; else if(p.x>W+20)p.x=-20; if(p.y<-20)p.y=H+20; else if(p.y>H+20)p.y=-20;
const r=p.size*(1+Math.sin(t*0.003+p.j)*0.25); const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,r*6); g.addColorStop(0,hexToRgba(p.hue,0.9)); g.addColorStop(1,hexToRgba(p.hue,0.0)); ctx.fillStyle=g; ctx.beginPath(); ctx.arc(p.x,p.y,r,0,Math.PI*2); ctx.fill();
}
requestAnimationFrame(tick)
}
requestAnimationFrame(tick);
})();
