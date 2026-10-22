(()=>{
 const preference=matchMedia('(prefers-reduced-motion: reduce)');
 const canvas=document.querySelector('#ambient-mesh'),ctx=canvas.getContext('2d');
 const button=document.createElement('button');button.className='motion-control';button.type='button';document.body.append(button);
 let userPaused=false;try{userPaused=sessionStorage.getItem('teras-motion-paused')==='true'}catch{}
 let width=0,height=0,frame=0,last=0,phase=0;
 const pointer={x:0,y:0,tx:0,ty:0,cx:0,cy:0,active:false};
 const finePointer=matchMedia('(hover: hover) and (pointer: fine)');
 const light=document.createElement('div');light.className='cursor-light';light.setAttribute('aria-hidden','true');document.body.append(light);
 addEventListener('pointermove',event=>{if(event.pointerType==='touch'||!finePointer.matches||!window.TerasMotion?.running)return;pointer.tx=(event.clientX/innerWidth-.5)*2;pointer.ty=(event.clientY/innerHeight-.5)*2;pointer.cx=event.clientX;pointer.cy=event.clientY;pointer.active=true},{passive:true});
 function release(){pointer.active=false;pointer.tx=0;pointer.ty=0}document.documentElement.addEventListener('pointerleave',release);addEventListener('blur',release);
 const nodes=Array.from({length:innerWidth<650?36:76},(_,i)=>({x:Math.random(),y:Math.random(),speed:19+Math.random()*27,r:i%5===0?2.4:1.3}));
 function size(){width=innerWidth;height=innerHeight;const ratio=Math.min(devicePixelRatio||1,1.5);canvas.width=width*ratio;canvas.height=height*ratio;ctx.setTransform(ratio,0,0,ratio,0,0);paint(0)}
 function paint(dt){phase+=dt;const follow=1-Math.exp(-dt*9);pointer.x+=(pointer.tx-pointer.x)*follow;pointer.y+=(pointer.ty-pointer.y)*follow;const style=document.documentElement.style;style.setProperty('--pointer-x',pointer.x.toFixed(4));style.setProperty('--pointer-y',pointer.y.toFixed(4));style.setProperty('--cursor-x',((pointer.x+1)*width/2).toFixed(1)+'px');style.setProperty('--cursor-y',((pointer.y+1)*height/2).toFixed(1)+'px');light.style.opacity=pointer.active?'1':'0';ctx.clearRect(0,0,width,height);const spacing=width<650?90:130;const offset=(phase*18)%spacing;ctx.save();ctx.translate(pointer.x*20,pointer.y*16);
 ctx.lineWidth=.7;ctx.strokeStyle='rgba(128,151,172,.11)';ctx.beginPath();for(let x=-spacing+offset;x<width;x+=spacing){ctx.moveTo(x,0);ctx.lineTo(x+height*.13,height)}for(let y=offset-spacing;y<height;y+=spacing){ctx.moveTo(0,y);ctx.lineTo(width,y)}ctx.stroke();
 const positions=nodes.map(n=>{n.y-=dt*n.speed/height;if(n.y<-.02)n.y=1.02;let x=n.x*width+Math.sin(phase*.4+n.x*8)*29+pointer.x*26,y=n.y*height+pointer.y*20;const dx=x-(pointer.x+1)*width/2,dy=y-(pointer.y+1)*height/2,d=Math.hypot(dx,dy);if(pointer.active&&d<250&&d>1){const push=(1-d/250)*60;x+=dx/d*push;y+=dy/d*push}ctx.fillStyle=n.r>2?'rgba(255,133,53,.6)':'rgba(174,188,202,.35)';ctx.beginPath();ctx.arc(x,y,n.r,0,Math.PI*2);ctx.fill();return {x,y}});
 for(let i=0;i<positions.length;i++)for(let j=i+1;j<positions.length;j++){const a=positions[i],b=positions[j],d=Math.hypot(a.x-b.x,a.y-b.y);if(d<180){ctx.strokeStyle=`rgba(202,126,64,${(1-d/180)*.23})`;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}
 if(pointer.active){const px=(pointer.x+1)*width/2,py=(pointer.y+1)*height/2;for(const point of positions){const distance=Math.hypot(point.x-px,point.y-py);if(distance<280){ctx.strokeStyle='rgba(255,143,69,'+((1-distance/280)*.35)+')';ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(point.x,point.y);ctx.stroke()}}}ctx.restore();
 const scan=(phase*55)%(height+260)-130;const glow=ctx.createLinearGradient(0,scan-60,0,scan+60);glow.addColorStop(0,'rgba(255,107,0,0)');glow.addColorStop(.5,'rgba(255,107,0,.055)');glow.addColorStop(1,'rgba(255,107,0,0)');ctx.fillStyle=glow;ctx.fillRect(0,scan-60,width,120);
 // Flowing engineering contour lines sit toward the image side of the page.
 for(let strand=0;strand<5;strand++){
  ctx.beginPath();for(let y=-50;y<height+50;y+=15){const x=width*.78+Math.sin(y/180+phase*.48+strand*.32)*105+Math.cos(y/340-phase*.25)*80+strand*17+pointer.x*35;if(y===-50)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
  ctx.strokeStyle='rgba(255,139,58,'+(.045+strand*.012)+')';ctx.lineWidth=strand===2?1.6:.8;ctx.stroke();
  const y=((phase*65+strand*height/5)%(height+100))-50;
  const x=width*.78+Math.sin(y/180+phase*.48+strand*.32)*105+Math.cos(y/340-phase*.25)*80+strand*17+pointer.x*35;
  ctx.fillStyle='rgba(255,165,87,.6)';ctx.beginPath();ctx.arc(x,y,2.2,0,Math.PI*2);ctx.fill();
 }

 }
 function loop(time){if(!window.TerasMotion.running)return;if(!last)last=time;if(time-last>=32){paint(Math.min((time-last)/1000,.07));last=time}frame=requestAnimationFrame(loop)}
 function sync(){cancelAnimationFrame(frame);last=0;const paused=userPaused||preference.matches;window.TerasMotion={running:!paused&&!document.hidden};document.documentElement.dataset.motion=window.TerasMotion.running?'running':'paused';button.textContent=paused?'▶ Motion paused':'Ⅱ Pause motion';button.setAttribute('aria-label',preference.matches?'Motion paused: reduced-motion preference enabled':paused?'Resume background animation':'Pause background animation');button.setAttribute('aria-pressed',String(paused));button.disabled=preference.matches;if(window.TerasMotion.running)frame=requestAnimationFrame(loop);else paint(0)}
 button.onclick=()=>{userPaused=!userPaused;try{sessionStorage.setItem('teras-motion-paused',String(userPaused))}catch{}sync()};preference.addEventListener('change',sync);document.addEventListener('visibilitychange',sync);addEventListener('resize',size);size();sync();
 const observer=new IntersectionObserver(entries=>entries.forEach(e=>e.target.classList.toggle('motion-in-view',e.isIntersecting)),{rootMargin:'100px'});document.querySelectorAll('.hero,.fleet-photo-wrap,.project-visual,.operations-copy,.closing').forEach(e=>observer.observe(e));
})();
