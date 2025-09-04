*(JS no-módulo: UI, navegación, marquee, overlay YouTube — **sin** duplicar `iframe_api`)*


// Año dinámico
(function(){ const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear(); })();


// Mouse FX + reveal + tilt + magnético + header size CSS var
window.addEventListener('pointermove',(e)=>{ document.body.style.setProperty('--mx',e.clientX+'px'); document.body.style.setProperty('--my',e.clientY+'px') });
(function(){ const io=new IntersectionObserver((entries)=>{ entries.forEach(en=>{ if(en.isIntersecting){ en.target.classList.add('is-in'); io.unobserve(en.target) }}) },{threshold:.15}); document.querySelectorAll('.reveal').forEach(el=>io.observe(el))})();
(function(){ const max=12,perspective=900; document.querySelectorAll('.tilt').forEach(el=>{ el.addEventListener('pointermove',(e)=>{ const r=el.getBoundingClientRect(); const cx=r.left+r.width/2,cy=r.top+r.height/2; const dx=(e.clientX-cx)/(r.width/2),dy=(e.clientY-cy)/(r.height/2); const rx=(-dy*max).toFixed(2),ry=(dx*max).toFixed(2); el.style.transform=`perspective(${perspective}px) rotateX(${rx}deg) rotateY(${ry}deg)` }); el.addEventListener('pointerleave',()=>{ el.style.transform=`perspective(${perspective}px) rotateX(0) rotateY(0)` }) })})();
(function(){ const els=document.querySelectorAll('[data-magnetic]'); els.forEach(el=>{ const k=parseFloat(el.dataset.magnetic)||0.35; el.addEventListener('pointermove',(e)=>{ const r=el.getBoundingClientRect(); const mx=e.clientX-(r.left+r.width/2); const my=e.clientY-(r.top+r.height/2); el.style.transform=`translate(${mx*k}px, ${my*k}px)` }); el.addEventListener('pointerleave',()=>{ el.style.transform='translate(0,0)' }) })})();
(function(){ const h=document.querySelector('header').getBoundingClientRect().height; document.documentElement.style.setProperty('--hdr',h+'px'); window.addEventListener('resize',()=>{ const hh=document.querySelector('header').getBoundingClientRect().height; document.documentElement.style.setProperty('--hdr',hh+'px') }) })();
(function(){ if(matchMedia('(pointer:fine)').matches) return; document.querySelectorAll('.card').forEach(c=>{ c.addEventListener('click',()=>{ c.classList.toggle('is-flipped') }) })})();


// Cursor custom sólo en puntero fino
(function(){ if(!matchMedia('(pointer:fine)').matches) return; const dot=document.createElement('div'); dot.className='cursor-dot'; const ring=document.createElement('div'); ring.className='cursor-ring'; document.body.append(dot,ring); let xr=0,yr=0,xd=0,yd=0; function loop(){ xr+=(xd-xr)*0.15; yr+=(yd-yr)*0.15; ring.style.transform=`translate(${xr}px, ${yr}px)`; requestAnimationFrame(loop) } window.addEventListener('pointermove',(e)=>{ xd=e.clientX-12; yd=e.clientY-12; dot.style.transform=`translate(${e.clientX-2}px, ${e.clientY-2}px)` }); document.addEventListener('mouseover',e=>{ if(e.target.closest('a, button, .tilt, .watch-btn')) ring.classList.add('is-big') }); document.addEventListener('mouseout',e=>{ if(e.target.closest('a, button, .tilt, .watch-btn')) ring.classList.remove('is-big') }); loop() })();
