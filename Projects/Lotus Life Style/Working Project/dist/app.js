const $=s=>document.querySelector(s);const reduced=matchMedia('(prefers-reduced-motion: reduce)');let paused=reduced.matches;const motion=$('#motion');function motionLabel(){motion.textContent=paused?'Resume animations':'Pause animations';motion.setAttribute('aria-pressed',String(paused));document.body.classList.toggle('motion-paused',paused)}motionLabel();motion.onclick=()=>{paused=!paused;motionLabel();updateScroll()};reduced.addEventListener('change',e=>{paused=e.matches;motionLabel()});
const cards=[...document.querySelectorAll('.ritual-card')];let pointer={x:0,y:0},wheel=0,frame=0,last=0;cards.forEach((c,i)=>c.style.setProperty('--i',i));function updateScroll(){if(paused)cards.forEach(c=>c.style.transform='none')}
addEventListener('pointermove',e=>{pointer={x:e.clientX/innerWidth-.5,y:e.clientY/innerHeight-.5}},{passive:true});document.addEventListener('pointerleave',()=>pointer={x:0,y:0});addEventListener('wheel',e=>{if(true)wheel+=Math.max(-1,Math.min(1,e.deltaY/100))*.15},{passive:true});
const canvas=$('#ambient'),ctx=canvas.getContext('2d');let cw=0,ch=0;function size(){const d=Math.min(devicePixelRatio||1,2);cw=canvas.clientWidth;ch=canvas.clientHeight;canvas.width=cw*d;canvas.height=ch*d;if(ctx)ctx.setTransform(d,0,0,d,0,0)}size();addEventListener('resize',size);
function animate(now){requestAnimationFrame(animate);if(document.hidden||now-last<30)return;last=now;if(!paused&&true)frame+=.018;const small=innerWidth<=650;if(!paused)cards.forEach((c,i)=>{const phase=frame*(.65+i*.09)+i*1.7+wheel;const hover=c.matches(':hover')&&!small;const base=small?[0,9,-3,7][i]:[12,-12,17,-5][i];const rot=small?[-2,2,-1.5,2][i]:[-2.8,1.8,-1.7,2.5][i];c.style.transform=`translate3d(${Math.sin(phase*.8)*(small?2:7)+pointer.x*(i%2?8:-8)}px,${base+Math.sin(phase)*(small?5:13)+(hover?-18:0)}px,${hover?35:0}px) rotateZ(${rot+Math.cos(phase)*.7}deg) rotateY(${pointer.x*(i%2?-5:5)}deg) rotateX(${-pointer.y*3}deg)`});if(ctx){

ctx.clearRect(0,0,cw,ch);ctx.fillStyle='#091e1c';ctx.fillRect(0,0,cw,ch);
const drift=paused?{x:0,y:0}:pointer;
const atmosphere=frame*1.65;
const clouds=[{x:.12,y:.28,r:.58,c:'28,123,91'},{x:.84,y:.12,r:.52,c:'42,93,87'},{x:.88,y:.84,r:.59,c:'68,92,58'},{x:.14,y:.88,r:.48,c:'16,80,76'},{x:.5,y:.04,r:.32,c:'154,121,57'}];
clouds.forEach((b,i)=>{const x=(b.x+Math.sin(atmosphere*.35+i*1.6)*.25+drift.x*.05)*cw,y=(b.y+Math.cos(atmosphere*.27+i)*.22+drift.y*.04)*ch,r=Math.max(cw,ch)*b.r;const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,'rgba('+b.c+',.72)');g.addColorStop(.5,'rgba('+b.c+',.25)');g.addColorStop(1,'rgba('+b.c+',0)');ctx.fillStyle=g;ctx.fillRect(0,0,cw,ch)});
// Two flowing silk ribbons travel independently behind the cards.
ctx.save();ctx.globalCompositeOperation='screen';
for(let band=0;band<3;band++){
 for(let j=0;j<18;j++){
  ctx.beginPath();
  for(let i=0;i<=90;i++){
   const u=i/90,x=u*cw;
   const y=ch*(.06+band*.36+Math.sin(u*5.6+atmosphere*.46+band*2.3)*.18)+j*(small?4:7)+Math.sin(u*9-atmosphere*.3)*12;
   i?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  const ink=ctx.createLinearGradient(0,0,cw,0);ink.addColorStop(0,'rgba(219,177,101,0)');ink.addColorStop(.3,'rgba(219,177,101,'+(band===1?.2:.27)+')');ink.addColorStop(.65,'rgba(133,193,163,.24)');ink.addColorStop(1,'rgba(219,177,101,0)');
  ctx.strokeStyle=ink;ctx.lineWidth=j%5===0?2.1:.8;ctx.stroke();
 }
}
// Broad pools of light sweep behind the finer ribbons.
for(let glow=0;glow<3;glow++){
 const x=(.5+Math.sin(atmosphere*.29+glow*2.1)*.52)*cw;
 const y=(.45+Math.cos(atmosphere*.22+glow*1.7)*.42)*ch;
 const r=Math.min(cw,ch)*(.33+glow*.08);
 const light=ctx.createRadialGradient(x,y,0,x,y,r);
 light.addColorStop(0,glow===1?'rgba(221,181,100,.14)':'rgba(74,166,128,.17)');
 light.addColorStop(1,'rgba(74,166,128,0)');
 ctx.fillStyle=light;ctx.fillRect(x-r,y-r,r*2,r*2);
}
// Fine rising gold dust and a handful of softly glowing lights.
for(let i=0;i<(small?48:85);i++){
 const x=((i*.618)%1)*cw+Math.sin(atmosphere*.42+i)*22;
 const y=((i*.381-atmosphere*.018+100)%1)*ch;
 const radius=i%9===0?2.4:.7+(i%3)*.4;
 const alpha=.34+Math.sin(atmosphere*1.2+i)*.15;
 if(i%9===0){const halo=ctx.createRadialGradient(x,y,0,x,y,17);halo.addColorStop(0,'rgba(241,205,139,.16)');halo.addColorStop(1,'rgba(241,205,139,0)');ctx.fillStyle=halo;ctx.fillRect(x-17,y-17,34,34)}
 ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);ctx.fillStyle='rgba(247,221,171,'+alpha+')';ctx.fill();
}
ctx.restore();
}}requestAnimationFrame(animate);

