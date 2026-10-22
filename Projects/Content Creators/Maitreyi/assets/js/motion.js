// Scroll supplies progress; native scrolling and keyboard navigation stay intact.
const motionHero = document.querySelector('.hero');
// Decorative layers sit behind all hero content and never intercept interaction.
const heroAtmosphere = document.createElement('div');
heroAtmosphere.className = 'hero-atmosphere';
heroAtmosphere.setAttribute('aria-hidden','true');
heroAtmosphere.innerHTML = `<div class="hero-light hero-light-rose"></div><div class="hero-light hero-light-amber"></div><div class="hero-light-sweep"></div>
<svg class="hero-silk" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice" focusable="false">
<defs>
 <linearGradient id="hero-ribbon-rose" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#32101d" stop-opacity="0"/><stop offset=".32" stop-color="#a55c70" stop-opacity=".6"/><stop offset=".48" stop-color="#df9b98" stop-opacity=".28"/><stop offset=".62" stop-color="#6b203e" stop-opacity=".6"/><stop offset="1" stop-color="#331020" stop-opacity="0"/></linearGradient>
 <linearGradient id="hero-ribbon-wine"><stop stop-color="#270b17" stop-opacity="0"/><stop offset=".48" stop-color="#994057" stop-opacity=".7"/><stop offset=".7" stop-color="#e5b392" stop-opacity=".23"/><stop offset="1" stop-color="#571a30" stop-opacity="0"/></linearGradient>
 <linearGradient id="hero-filament"><stop stop-color="#ebcba2" stop-opacity="0"/><stop offset=".5" stop-color="#ebcba2" stop-opacity=".5"/><stop offset="1" stop-color="#ebcba2" stop-opacity="0"/></linearGradient>
</defs>
<g class="silk-fold silk-fold-one"><path fill="url(#hero-ribbon-rose)" d="M490 -180 C1310 20 270 430 890 750 S1480 1020 1780 1190 L1810 750 C990 920 630 550 1050 230 S880 -100 750 -180Z"/></g>
<g class="silk-fold silk-fold-two"><path fill="url(#hero-ribbon-wine)" d="M250 1130 C40 710 1150 960 1180 420 S1500 -110 1860 -80 L1750 160 C1230 30 1450 650 950 800 S560 930 490 1150Z"/></g>
<g class="silk-fold silk-fold-three"><path fill="url(#hero-ribbon-rose)" d="M-260 780 C80 460 330 1040 740 620 S1300 310 1790 390 L1770 525 C1280 395 1040 560 790 785 S90 710 -260 1060Z"/><path d="M-260 780 C80 460 330 1040 740 620 S1300 310 1790 390" fill="none" stroke="url(#hero-filament)" stroke-width="1.2"/></g>
<g class="silk-filaments" fill="none" stroke="url(#hero-filament)" stroke-width="1">
 <path d="M600 -100 C1350 130 460 400 920 740 S1590 890 1780 1100"/>
 <path d="M625 -100 C1375 130 485 400 945 740 S1615 890 1805 1100"/>
 <path d="M180 1030 C70 780 1190 910 1210 430 S1530 -70 1790 10"/>
</g></svg>`;
motionHero.prepend(heroAtmosphere);
new IntersectionObserver(entries=>{
  heroAtmosphere.classList.toggle('atmosphere-resting',!entries[0].isIntersecting);
  motionHero.classList.toggle('cover-resting',!entries[0].isIntersecting);
}).observe(motionHero);
const motionVibe = document.querySelector('.vibe-scene');
const personScene = document.querySelector('#about');
const compactPortrait = matchMedia('(max-width: 600px)');
const diary = document.querySelector('.style-diary');
const looks = [...document.querySelectorAll('.look-card')];
const desktopMotion = matchMedia('(min-width: 901px) and (min-height: 620px)');
const clamp = n => Math.max(0, Math.min(1, n));
let motionQueued = false;
let lastLook = -1;
const palette = [[39,19,22],[58,30,43],[64,31,16],[27,39,23],[65,22,28],[48,40,32],[46,35,60],[39,24,29],[30,37,48],[19,40,44]];
const lookCount = looks.length;
diary.style.setProperty('--runway-height', `${100+(lookCount-1)*110}svh`);
const motionTitle = document.querySelector('.hero-title');
const fabric = document.createElement('div');
fabric.className = 'hero-fabric';
fabric.setAttribute('aria-hidden','true');
fabric.innerHTML = '<svg viewBox="0 0 1600 600" preserveAspectRatio="none"><defs><linearGradient id="silk-base" x1="0" y1="0" x2=".7" y2="1"><stop stop-color="#260b15"/><stop offset=".35" stop-color="#a35a67"/><stop offset=".48" stop-color="#542030"/><stop offset=".7" stop-color="#7c3549"/><stop offset="1" stop-color="#6c293c"/></linearGradient><linearGradient id="silk-fold"><stop stop-color="#e5ad9c" stop-opacity="0"/><stop offset=".5" stop-color="#e5ad9c" stop-opacity=".24"/><stop offset="1" stop-color="#2a0d19" stop-opacity="0"/></linearGradient></defs><path fill="url(#silk-base)" d="M0 390 C290 470 380 440 650 275 S1150 35 1600 120 V600 H0Z"/><path fill="url(#silk-fold)" d="M0 420 C380 560 530 235 980 155 S1360 210 1600 140 V260 C1300 120 1090 180 870 270 S370 610 0 490Z"/><path fill="url(#silk-fold)" d="M420 600 C750 315 1000 450 1600 245 V340 C1120 515 990 360 680 600Z"/></svg>';
motionHero.append(fabric);
const diaryMeter = document.createElement('div');
diaryMeter.className = 'diary-meter';
diaryMeter.setAttribute('aria-hidden', 'true');
diaryMeter.innerHTML = `<span>TEN LOOKS. A DISTINCT POINT OF VIEW.</span><span class="diary-count">01 / ${String(lookCount).padStart(2,'0')}</span><i></i>`;
document.querySelector('.diary-stage').append(diaryMeter);

document.querySelectorAll('.vibe-photo,.vibe-aside,.vibe-notes > div,.contact h2,.service-list details').forEach((el,i)=>{
  el.classList.add('scene-reveal');
  el.style.setProperty('--reveal-delay', `${i % 3 * 100}ms`);
  observer.observe(el);
});

function updateScenes(){
  motionQueued = false;
  const enabled = !paused;
  const runway = enabled && desktopMotion.matches;
  document.body.classList.toggle('runway-motion', runway);
  document.querySelector('.scroll-progress').style.width = `${clamp(scrollY / Math.max(1,document.documentElement.scrollHeight-innerHeight))*100}%`;
  const heroProgress = enabled ? clamp(-motionHero.getBoundingClientRect().top / motionHero.offsetHeight) : 0;
  motionHero.style.setProperty('--hero-progress', heroProgress);
  const heroEntry = clamp(-motionHero.getBoundingClientRect().top/Math.max(1,motionHero.offsetHeight-innerHeight));
  const heroFocus = enabled ? heroEntry*heroEntry*(3-2*heroEntry) : 0;
  motionHero.style.setProperty('--hero-focus', heroFocus.toFixed(4));
  motionHero.style.setProperty('--portrait-drift', '0px');
  motionHero.style.setProperty('--backdrop-drift', `${heroProgress*motionHero.offsetHeight*.18}px`);
  const fabricProgress = enabled ? clamp((heroProgress-.12)/.7) : 0;
  motionHero.style.setProperty('--fabric-x', `${(1-fabricProgress)*65}%`);
  motionHero.style.setProperty('--fabric-y', `${(1-fabricProgress)*44}%`);
  motionHero.querySelectorAll('.hero-line').forEach((line,i)=>{
    const exit = enabled ? clamp((heroProgress-(i ? .08 : 0))/.8) : 0;
    line.style.translate = `0 ${-heroFocus*(i ? 8 : 18)}px`;
    line.style.opacity = 1;
  });
  const vr = motionVibe.getBoundingClientRect();
  const vp = clamp((innerHeight-vr.top)/(innerHeight+vr.height));
  motionVibe.style.setProperty('--scene-glow', `${25+vp*60}%`);
  motionVibe.style.setProperty('--layer-drift', `${enabled ? (vp-.5)*30 : 0}px`);
  motionVibe.querySelectorAll('.vibe-line').forEach((line,i)=>line.classList.toggle('is-lit',!enabled||vr.top<innerHeight*(.8-i*.11)));
  motionVibe.querySelectorAll('.vibe-rail span').forEach((line,i)=>line.classList.toggle('word-active',!enabled||vp>.12+i*.1));
  let progress = 0;
  if(runway){
    progress = clamp(-diary.getBoundingClientRect().top / (diary.offsetHeight-innerHeight));
    const position = progress*(lookCount-1);
    const index = Math.min(lookCount-1,Math.round(position));
    const lower = Math.min(lookCount-2,Math.floor(position));
    const blend = position-lower;
    const color = palette[lower].map((value,i)=>Math.round(value+(palette[lower+1][i]-value)*blend));
    diary.style.setProperty('--diary-color', `rgb(${color.join(',')})`);
    looks.forEach((look,i)=>{
      const distance = i-position;
      const opacity = clamp(1-Math.abs(distance)*1.65);
      look.style.setProperty('--look-x', `${distance*105}%`);
      look.style.setProperty('--look-depth', `${-Math.abs(distance)*170}px`);
      look.style.setProperty('--look-opacity', opacity);
      look.inert = i!==index;
      look.classList.toggle('active-look', i===index);
    });
    if(lastLook!==index){
      diary.querySelector('.diary-count').textContent = `${String(index+1).padStart(2,'0')} / ${String(lookCount).padStart(2,'0')}`;
      lastLook=index;
    }
  }else{
    looks.forEach(look=>{look.inert=false;look.classList.remove('active-look')});
  }
  diary.style.setProperty('--diary-progress', progress);
  // Enlarge on entry and hold the close-up while reading; reverse on scrolling up.
  const personRect = personScene.getBoundingClientRect();
  const travel = Math.max(innerHeight*.6,personRect.height-innerHeight);
  const entry = clamp((innerHeight*.3-personRect.top)/(travel+innerHeight*.3));
  const focus = enabled ? entry*entry*(3-2*entry) : 0;
  personScene.style.setProperty('--person-zoom', (1+focus*(compactPortrait.matches ? .12 : .24)).toFixed(4));
  personScene.style.setProperty('--person-enlarge', (1+focus*(compactPortrait.matches ? 0 : .035)).toFixed(4));
  personScene.style.setProperty('--person-focus', focus.toFixed(4));
  personScene.style.setProperty('--person-copy', (enabled ? clamp((innerHeight-personRect.top)/(innerHeight*.6)) : 1).toFixed(4));
  personScene.classList.toggle('portrait-in-view',enabled&&personRect.top<innerHeight&&personRect.bottom>0);
}
function queueScenes(){if(!motionQueued){motionQueued=true;requestAnimationFrame(updateScenes)}}
addEventListener('scroll',queueScenes,{passive:true});
addEventListener('resize',queueScenes,{passive:true});
motionButton.addEventListener('click',queueScenes);
reduced.addEventListener('change',queueScenes);
desktopMotion.addEventListener('change',queueScenes);
updateScenes();

// Coalesce pointer input and move only a small composited glow.
let lightFrame=0, lightX=0, lightY=0;
function paintPointerLight(){
  lightFrame=0;
  const glow=heroAtmosphere.querySelector('.hero-light-amber');
  glow.style.translate=paused?'0px 0px':lightX+'px '+lightY+'px';
}
motionHero.addEventListener('pointermove',e=>{
  if(paused||e.pointerType==='touch')return;
  lightX=(e.clientX/innerWidth-.5)*36;
  lightY=(e.clientY/innerHeight-.5)*24;
  if(!lightFrame)lightFrame=requestAnimationFrame(paintPointerLight);
},{passive:true});
motionHero.addEventListener('pointerleave',()=>{
  lightX=0;lightY=0;
  if(!lightFrame)lightFrame=requestAnimationFrame(paintPointerLight);
});

document.querySelectorAll('.contact-button,.look-card').forEach(el=>{
  el.addEventListener('pointermove',e=>{
    if(paused||e.pointerType==='touch')return;
    const rect=el.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width-.5;
    const y=(e.clientY-rect.top)/rect.height-.5;
    const target=el.querySelector('.look-open')||el;
    target.style.translate=`${x*14}px ${y*12}px`;
  });
  el.addEventListener('pointerleave',()=>{(el.querySelector('.look-open')||el).style.translate='0 0'});
});

// Animate native details while retaining their keyboard and accessibility behavior.
document.querySelectorAll('.service-list details').forEach(details=>{
  const summary=details.querySelector('summary');
  let animation;
  summary.addEventListener('click',e=>{
    if(paused)return;
    e.preventDefault();
    if(animation)return;
    const closing=details.open;
    const start=details.offsetHeight;
    if(!closing)details.open=true;
    const end=closing?summary.offsetHeight:details.offsetHeight;
    details.style.overflow='hidden';
    animation=details.animate([{height:`${start}px`},{height:`${end}px`}],{duration:420,easing:'cubic-bezier(.22,1,.36,1)'});
    animation.onfinish=()=>{details.open=!closing;details.style.overflow='';animation=null};
  });
});

// The detail image grows from the exact look the visitor selected.
looks.forEach(look=>look.addEventListener('click',()=>{
  if(paused)return;
  const from=look.querySelector('img').getBoundingClientRect();
  const detail=document.querySelector('#look-detail-image');
  const to=detail.getBoundingClientRect();
  if(!to.width)return;
  detail.animate([
    {transformOrigin:'top left',transform:`translate(${from.left-to.left}px,${from.top-to.top}px) scale(${from.width/to.width},${from.height/to.height})`,opacity:.5},
    {transformOrigin:'top left',transform:'none',opacity:1}
  ],{duration:550,easing:'cubic-bezier(.22,1,.36,1)'});
}));
