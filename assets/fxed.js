*(Módulo Three.js — se importa desde CDN, compatible con Pages)*
```js
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.158.0/build/three.module.js';
import { RoomEnvironment } from 'https://cdn.jsdelivr.net/npm/three@0.158.0/examples/jsm/environments/RoomEnvironment.js';


if(!(window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches)){
let scene,camera,renderer; const canvas=document.getElementById('fx3d'); let mx=0,my=0;
addEventListener('pointermove',(e)=>{ mx=(e.clientX/innerWidth)-0.5; my=(e.clientY/innerHeight)-0.5 },{passive:true});
function init(){ if(!canvas) return; scene=new THREE.Scene(); scene.fog=new THREE.FogExp2(0x000000,0.08); camera=new THREE.PerspectiveCamera(60,innerWidth/innerHeight,0.1,200); camera.position.set(0,0.2,9);
renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:true}); renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setSize(innerWidth,innerHeight,false); renderer.outputColorSpace=THREE.SRGBColorSpace; renderer.toneMapping=THREE.ACESFilmicToneMapping; renderer.toneMappingExposure=1.05;
const pmrem=new THREE.PMREMGenerator(renderer); const envTex=pmrem.fromScene(new RoomEnvironment(renderer),0.04).texture; scene.environment=envTex; scene.add(new THREE.HemisphereLight(0xffffff,0x222233,0.6)); const dir=new THREE.DirectionalLight(0xffffff,1.1); dir.position.set(4,6,3); scene.add(dir);
const boneMat=new THREE.MeshPhysicalMaterial({color:0xeadcc2,roughness:0.6,metalness:0.0,clearcoat:0.2,clearcoatRoughness:0.5});
const discMat=new THREE.MeshPhysicalMaterial({color:0x8fc7ff,roughness:0.15,metalness:0.0,transmission:0.7,ior:1.35,thickness:0.35,clearcoat:0.6,clearcoatRoughness:0.15});
const tendonMat=new THREE.MeshPhysicalMaterial({color:0xffffff,roughness:0.05,metalness:0.0,transmission:0.45,ior:1.2,thickness:0.2});
const vertebraGeo=new THREE.CylinderGeometry(1,1,1,28,1,false); const discGeo=new THREE.CylinderGeometry(1,1,1,24,1,false);
const spines=[]; spines.push(makeSpine({segments:64,length:7.2,baseRadius:0.18,vertebraH:0.22,discH:0.10,curvature:1.15,xOffset:-1.9,yOffset:-0.2,zOffset:-1.0,phase:0.0,vertebraGeo,discGeo,boneMat,discMat,tendonMat})); spines.push(makeSpine({segments:64,length:6.6,baseRadius:0.16,vertebraH:0.20,discH:0.09,curvature:0.95,xOffset:1.8,yOffset:0.15,zOffset:0.2,phase:Math.PI/3,vertebraGeo,discGeo,boneMat,discMat,tendonMat})); spines.forEach(g=>scene.add(g.group));
let last=performance.now(); function animate(t){ const dt=Math.min(32,t-last); last=t; const time=t*0.001; camera.position.x+=((mx*1.6)-camera.position.x)*0.05; camera.position.y+=(((-my*1.0))-camera.position.y)*0.05; camera.lookAt(0,0,0); for(const s of spines){ s.update(time,mx,my) } renderer.render(scene,camera); requestAnimationFrame(animate) } requestAnimationFrame(animate);
addEventListener('resize',()=>{ renderer.setSize(innerWidth,innerHeight,false); camera.aspect=innerWidth/innerHeight; camera.updateProjectionMatrix() })
}
function makeSpine({segments=60,length=6.0,baseRadius=0.16,vertebraH=0.20,discH=0.09,curvature=1.0,xOffset=0,yOffset=0,zOffset=0,phase=0,vertebraGeo,discGeo,boneMat,discMat,tendonMat}){
const group=new THREE.Group(); const up=new THREE.Vector3(0,1,0); const m=new THREE.Matrix4(); const q=new THREE.Quaternion(); const s=new THREE.Vector3(); const p0=new THREE.Vector3(); const p1=new THREE.Vector3(); const tangent=new THREE.Vector3(); const vertebraMesh=new THREE.InstancedMesh(vertebraGeo,boneMat,segments); const discMesh=new THREE.InstancedMesh(discGeo,discMat,Math.max(0,segments-1)); vertebraMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); discMesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage); group.add(vertebraMesh); group.add(discMesh);
const beadGeo=new THREE.SphereGeometry(baseRadius*0.22,12,10); const tendL=new THREE.InstancedMesh(beadGeo,tendonMat,segments*2); const tendR=new THREE.InstancedMesh(beadGeo,tendonMat,segments*2); tendL.instanceMatrix.setUsage(THREE.DynamicDrawUsage); tendR.instanceMatrix.setUsage(THREE.DynamicDrawUsage); group.add(tendL,tendR);
function posAt(t,time){ const wob=0.6+0.3*Math.sin(time*0.9+phase+t*4.2); const ang=t*curvature*Math.PI*2+phase; const x=xOffset+Math.sin(ang)*0.55*wob; const y=yOffset+(t-0.5)*length; const z=zOffset+Math.cos(ang)*0.32*wob+Math.sin(time*0.5+t*7+phase)*0.05; return new THREE.Vector3(x,y,z) }
function update(time,mx,my){ for(let i=0;i<segments;i++){ const t=i/(segments-1); p0.copy(posAt(t,time)); const t2=Math.min(1,t+1/(segments-1)); p1.copy(posAt(t2,time)); tangent.copy(p1).sub(p0).normalize(); q.setFromUnitVectors(up,tangent); const radius=baseRadius*(0.9+0.35*Math.sin(t*6+phase+time*1.0)); s.set(radius*1.15,vertebraH,radius*1.15); m.compose(p0,q,s); vertebraMesh.setMatrixAt(i,m); if(i<segments-1){ const mid=p0.clone().lerp(p1,0.5); s.set(radius*1.05,discH,radius*1.05); m.compose(mid,q,s); discMesh.setMatrixAt(i,m) } const bin=new THREE.Vector3().crossVectors(tangent,up); if(bin.lengthSq()<1e-6)bin.set(1,0,0); bin.normalize(); const nrm=new THREE.Vector3().crossVectors(bin,tangent).normalize(); const lateral=radius*1.6; for(let k=0;k<2;k++){ const jitter=(k?-0.35:0.35)*(0.5+0.5*Math.sin(time*1.3+i*0.3+k)); const offL=p0.clone().addScaledVector(nrm,lateral+jitter); const offR=p0.clone().addScaledVector(nrm,-lateral-jitter); const s2=radius*0.55; m.compose(offL,q,new THREE.Vector3(s2,s2,s2)); tendL.setMatrixAt(i*2+k,m); m.compose(offR,q,new THREE.Vector3(s2,s2,s2)); tendR.setMatrixAt(i*2+k,m) } } vertebraMesh.instanceMatrix.needsUpdate=true; discMesh.instanceMatrix.needsUpdate=true; tendL.instanceMatrix.needsUpdate=true; tendR.instanceMatrix.needsUpdate=true }
return {group,update}
}
init();
}
