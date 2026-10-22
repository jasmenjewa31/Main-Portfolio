'use strict';
// Supply verified destinations before publishing. Empty values open an honest preview notice.
const CONTACT = { email: '', instagram: '', youtube: '' };
// Curatorial labels and sample repertoire are illustrative, not claims about the pictured performances.
const photos = [
  {
    "id": "assets/blue-portrait.jpg",
    "title": "A quiet glance",
    "category": "Abhinaya",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "An expressive portrait in blue and magenta.",
    "credit": "Provided for this portfolio",
    "ratio": "686 / 1024",
    "alt": "An expressive portrait in blue and magenta."
  },
  {
    "id": "assets/offering.png",
    "title": "An offering in movement",
    "category": "Mudras & Details",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "Seated dance gesture in crimson and antique gold.",
    "credit": "Provided for this portfolio",
    "ratio": "1283 / 1226",
    "alt": "Seated dance gesture in crimson and antique gold."
  },
  {
    "id": "assets/stage-peacock.jpeg",
    "title": "In the spotlight",
    "category": "On Stage",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "A stage moment with a peacock-feather headdress.",
    "credit": "Provided for this portfolio",
    "ratio": "854 / 1280",
    "alt": "A stage moment with a peacock-feather headdress."
  },
  {
    "id": "assets/warm-portrait.png",
    "title": "Between the moments",
    "category": "Portraits",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "A close portrait in white and vermilion.",
    "credit": "Provided for this portfolio",
    "ratio": "1108 / 1420",
    "alt": "A close portrait in white and vermilion."
  },
  {
    "id": "assets/gesture.png",
    "title": "The language of gesture",
    "category": "Mudras & Details",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "A raised hand frames an expressive gaze.",
    "credit": "Provided for this portfolio",
    "ratio": "1082 / 1454",
    "alt": "A raised hand frames an expressive gaze."
  },
  {
    "id": "assets/stage-shadow.png",
    "title": "Rhythm and shadow",
    "category": "On Stage",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "An extended pose beneath a sculptural shadow.",
    "credit": "Provided for this portfolio",
    "ratio": "1254 / 1254",
    "alt": "An extended pose beneath a sculptural shadow."
  },
  {
    "id": "assets/temple.png",
    "title": "Temple reverie",
    "category": "Portraits",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "A seated portrait framed by Nataraja and warm lamplight.",
    "credit": "Provided for this portfolio",
    "ratio": "1086 / 1448",
    "alt": "A seated portrait framed by Nataraja and warm lamplight."
  },
  {
    "id": "assets/golden-lines.jpg",
    "title": "Lines of grace",
    "category": "Mudras & Details",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "A full-length gesture in red, green, and gold.",
    "credit": "Provided for this portfolio",
    "ratio": "1305 / 1920",
    "alt": "A full-length gesture in red, green, and gold."
  },
  {
    "id": "assets/peacock-fan.jpeg",
    "title": "A fan of colour",
    "category": "On Stage",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "A seated dance pose against a fan of peacock feathers.",
    "credit": "Provided for this portfolio",
    "ratio": "960 / 681",
    "alt": "A seated dance pose against a fan of peacock feathers."
  },
  {
    "id": "assets/golden-expression.png",
    "title": "A world within",
    "category": "Abhinaya",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "A playful expression surrounded by golden light.",
    "credit": "Provided for this portfolio",
    "ratio": "1054 / 1493",
    "alt": "A playful expression surrounded by golden light."
  },
  {
    "id": "assets/pointing-gesture.png",
    "title": "A gesture of resolve",
    "category": "Mudras & Details",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "A seated dancer in crimson and gold extends a pointing gesture.",
    "credit": "Provided for this portfolio",
    "ratio": "1170 / 954",
    "alt": "A seated dancer in crimson and gold extends a pointing gesture."
  },
  {
    "id": "assets/crimson-portrait.png",
    "title": "A moment of reflection",
    "category": "Portraits",
    "detail": "Bharatanatyam · Selected collection",
    "caption": "A full-length portrait in crimson and gold, with a hand resting beneath the chin.",
    "credit": "Provided for this portfolio",
    "ratio": "342 / 1024",
    "alt": "A full-length portrait in crimson and gold, with a hand resting beneath the chin."
  }
];
// Group the supplied images by their selected backdrop collection.
const blackBackgrounds = new Set(['assets/offering.png', 'assets/blue-portrait.jpg', 'assets/gesture.png', 'assets/warm-portrait.png', 'assets/pointing-gesture.png', 'assets/crimson-portrait.png']);
const photoSet = photo => blackBackgrounds.has(photo.id) ? 'black' : 'colour';
const imageURL = (id, width) => typeof id === 'string' ? id : `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${width}`;
const sourceURL = id => typeof id === 'string' ? id : `https://www.pexels.com/photo/${id}/`;
const grid = document.querySelector('.gallery-grid');
const filters = document.querySelector('.filters');
const modal = document.querySelector('.lightbox');
const fullImage = document.querySelector('.full-image');
const stage = document.querySelector('.image-stage');
const zoomButton = document.querySelector('.zoom-button');
const info = document.querySelector('.info-dialog');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let visible = [...photos], current = 0, openingCard;
const categories = ['All', 'On Stage', 'Abhinaya', 'Mudras & Details', 'Portraits'];
const observer = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.remove('reveal-pending'); entry.target.classList.add('revealed'); observer.unobserve(entry.target); } });
}, {threshold:.05}) : null;
categories.forEach(category => {
  const button = document.createElement('button'); button.className = 'filter';
  const count = category === 'All' ? photos.length : photos.filter(p => p.category === category).length;
  button.innerHTML = `${category === 'Abhinaya' ? 'Abhinaya (Expressions)' : category}<span>${count}</span>`;
  button.setAttribute('aria-pressed', String(category === 'All'));
  button.addEventListener('click', () => {
    filters.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    visible = category === 'All' ? [...photos] : photos.filter(p => p.category === category);
    renderGallery();
  }); filters.append(button);
});
let colourCleanup = () => {};
function renderGallery(){
  colourCleanup();
  observer?.disconnect(); grid.replaceChildren();
  const destinations = new Map();
  const sets = [
    {id:'black',label:'Expressions in Stillness',title:'The art of stillness.',note:'A gesture. A glance. A story.',number:'01'},
    {id:'colour',label:'An Ode to Tradition',title:'A world of colour.',note:'Movement, framed in light.',number:'02'}
  ];
  const blackDisplayOrder = ["assets/offering.png","assets/blue-portrait.jpg","assets/crimson-portrait.png","assets/gesture.png","assets/pointing-gesture.png","assets/warm-portrait.png"];
  visible = ['black','colour'].flatMap(set => {
    const items = visible.filter(photo => photoSet(photo) === set);
    return set === 'black' ? items.sort((a,b) => blackDisplayOrder.indexOf(a.id) - blackDisplayOrder.indexOf(b.id)) : items;
  });
  sets.forEach(set => {
    const count = visible.filter(photo => photoSet(photo) === set.id).length;
    if (!count) return;
    const section = document.createElement('section');
    section.className = 'photo-set set-' + set.id;
    section.setAttribute('aria-labelledby', 'set-title-' + set.id);
    section.innerHTML = '<div class="set-heading"><span>COLLECTION ' + set.number + '</span><h3 id="set-title-' + set.id + '">' + set.label + '</h3></div><div class="set-collage"><div class="set-poem"><p class="eyebrow">' + set.label + '</p><h4>' + set.title + '</h4><p>' + set.note + '</p></div></div>';
    grid.append(section);
    destinations.set(set.id, section.querySelector('.set-collage'));
  });
  visible.forEach((photo,index) => {
    const card = document.createElement(photoSet(photo) === 'black' ? 'figure' : 'button'); card.className = 'gallery-card';
    if (['assets/blue-portrait.jpg','assets/warm-portrait.png'].includes(photo.id)) card.classList.add('portrait');
    card.style.setProperty('--delay',`${Math.min(index,5)*60}ms`);
    card.setAttribute('aria-label',`View ${photo.title}, ${photo.category}`);
    card.innerHTML = `<div class="photo-wrap" style="--ratio:${photo.ratio}"><img src="${imageURL(photo.id,800)}" srcset="${imageURL(photo.id,480)} 480w, ${imageURL(photo.id,800)} 800w, ${imageURL(photo.id,1200)} 1200w" sizes="(max-width:700px) 44vw, 29vw" alt="${photo.alt || `${photo.title} — classical dance stock photograph`}" loading="lazy" decoding="async"><span class="image-number">${String(photos.indexOf(photo)+1).padStart(2,'0')}</span><div class="overlay"><div><h3>${photo.title}</h3><p>${photo.detail}<br>${photo.caption}</p></div></div><span class="expand" aria-hidden="true">↗</span></div><div class="card-caption"><span class="card-title">${photo.title}</span><span class="card-category">${photo.category}</span></div>`;
    const frameNumber = document.createElement('span');
    frameNumber.className = 'frame-index';
    frameNumber.textContent = String(photos.indexOf(photo)+1).padStart(2,'0');
    frameNumber.setAttribute('aria-hidden','true');
    card.prepend(frameNumber);
    const wrap = card.querySelector('.photo-wrap');
    card.querySelector('img').addEventListener('error',()=>wrap.classList.add('failed'));
    if (photoSet(photo) !== 'black') {
    card.addEventListener('click',()=>{current=index;openingCard=card;showImage();modal.showModal();document.body.style.overflow='hidden';});
    }
    card.addEventListener('pointermove',event=>{
      if(photoSet(photo) !== 'black' || !finePointer.matches || reducedMotion.matches || document.body.classList.contains('motion-paused'))return;
      const box=card.getBoundingClientRect();
      wrap.style.setProperty('--rx',`${-(event.clientY-box.top-box.height/2)/box.height*5}deg`);
      wrap.style.setProperty('--ry',`${(event.clientX-box.left-box.width/2)/box.width*5}deg`);
    });
    card.addEventListener('pointerleave',()=>{wrap.style.setProperty('--rx','0deg');wrap.style.setProperty('--ry','0deg');});
    if (photoSet(photo) !== 'black') {
      const description = document.createElement('span');
      description.className = 'editorial-description';
      description.textContent = photo.caption;
      card.querySelector('.card-caption').append(description);
    }
    destinations.get(photoSet(photo)).append(card);
    // Keep photographs visible immediately, including cards outside the horizontal viewport.
    card.classList.add('revealed');
  });
  arrangeColourCarousel();
  document.querySelector('#gallery-status').textContent=`Showing ${visible.length} of ${photos.length} photographs`;
}
function arrangeColourCarousel() {
  const section = grid.querySelector('.set-colour');
  if (!section) return;
  section.classList.add('curved-collection');
  const deck = section.querySelector('.set-collage');
  deck.querySelector('.set-poem')?.remove();
  const cards = [...deck.querySelectorAll('.gallery-card')];
  const quote = document.createElement('blockquote');
  quote.className = 'dance-verse';
  quote.innerHTML = "<div class=\"verse-pair\"><p class=\"verse-line\" lang=\"sa-Latn\">Yatho Hastha Thatho Drishti</p><p class=\"meaning-line\" lang=\"en\">Where the hands move, the eyes must follow.</p></div><div class=\"verse-pair\"><p class=\"verse-line\" lang=\"sa-Latn\">Yatho Drishti Thatho Manaha</p><p class=\"meaning-line\" lang=\"en\">Where the eyes gaze, the mind must follow.</p></div><div class=\"verse-pair\"><p class=\"verse-line\" lang=\"sa-Latn\">Yatho Manaha Thatho Bhavaha</p><p class=\"meaning-line\" lang=\"en\">Where the mind dwells, true emotion is awakened.</p></div><div class=\"verse-pair\"><p class=\"verse-line\" lang=\"sa-Latn\">Yatho Bhava Thatho Rasaha</p><p class=\"meaning-line\" lang=\"en\">Where emotion is awakened, divine essence and artistic bliss are born.</p></div>";
  section.insertBefore(quote,deck);
  deck.setAttribute('role','region');deck.setAttribute('aria-roledescription','carousel');deck.setAttribute('aria-label','An Ode to Tradition photographs');
  cards.forEach(card=>{observer?.unobserve(card);card.classList.remove('reveal-pending','revealed');});
  const controls=document.createElement('div');controls.className='curve-controls';
  controls.innerHTML='<button class="curve-prev" aria-label="Previous photograph">←</button><span class="curve-count"></span><button class="curve-next" aria-label="Next photograph">→</button><button class="curve-pause" aria-pressed="false">Pause carousel</button>';
  section.append(controls);
  let active=0,paused=false,hover=false;
  function select(index){
    active=(index+cards.length)%cards.length;
    cards.forEach((card,i)=>{
      let offset=(i-active+cards.length)%cards.length;
      if(offset>cards.length/2)offset-=cards.length;
      card.style.setProperty('--offset',offset);
      card.style.setProperty('--depth',Math.abs(offset));
      card.style.zIndex=String(10-Math.abs(offset));
      card.classList.toggle('centre-card',offset===0);
      card.classList.toggle('offstage',Math.abs(offset)>2);
      card.tabIndex=offset===0?0:-1;
      card.setAttribute('aria-hidden',String(Math.abs(offset)>2));
      card.inert=Math.abs(offset)>2;
    });
    controls.querySelector('.curve-count').textContent=String(active+1).padStart(2,'0')+' / '+String(cards.length).padStart(2,'0');
  }
  controls.querySelector('.curve-prev').addEventListener('click',()=>select(active-1));
  controls.querySelector('.curve-next').addEventListener('click',()=>select(active+1));
  const pause=controls.querySelector('.curve-pause');
  pause.addEventListener('click',()=>{paused=!paused;pause.textContent=paused?'Play carousel':'Pause carousel';pause.setAttribute('aria-pressed',String(paused));});
  deck.addEventListener('pointerenter',()=>hover=true);deck.addEventListener('pointerleave',()=>hover=false);
  deck.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();select(active+(e.key==='ArrowRight'?1:-1));cards[active].focus({preventScroll:true});}});
  let touchX=null;
  deck.addEventListener('touchstart',e=>{touchX=e.touches.length===1?e.touches[0].clientX:null;},{passive:true});
  deck.addEventListener('touchend',e=>{if(touchX!==null){const distance=e.changedTouches[0].clientX-touchX;if(Math.abs(distance)>50)select(active+(distance<0?1:-1));}touchX=null;},{passive:true});
  controls.querySelectorAll('.curve-prev,.curve-next,.curve-pause').forEach(button=>button.disabled=cards.length<2);
  select(0);
  const timer=setInterval(()=>{
    const bounds=deck.getBoundingClientRect();
    if(cards.length>1&&!paused&&!hover&&!reducedMotion.matches&&!document.body.classList.contains('motion-paused')&&!document.hidden&&!modal.open&&!info.open&&!section.contains(document.activeElement)&&bounds.top<innerHeight&&bounds.bottom>0)select(active+1);
  },4200);
  colourCleanup=()=>clearInterval(timer);
}
function resetZoom(){stage.classList.remove('zoomed');zoomButton.textContent='Zoom +';zoomButton.setAttribute('aria-pressed','false');stage.scrollTop=0;stage.scrollLeft=0;}
function showImage(){
  const photo=visible[current]; resetZoom();fullImage.hidden=false;document.querySelector('.image-error').hidden=true;
  fullImage.src=imageURL(photo.id,2400);fullImage.alt=photo.alt || `${photo.title} — stock photograph by ${photo.credit}`;
  document.querySelector('#lightbox-title').textContent=photo.title;
  document.querySelector('#lightbox-category').textContent=photo.category;
  document.querySelector('#lightbox-detail').textContent=`${photo.detail} · ${photo.caption}`;
  document.querySelector('.image-counter').textContent=`${String(current+1).padStart(2,'0')} / ${String(visible.length).padStart(2,'0')}`;
  const source=document.querySelector('#photo-source');source.href=sourceURL(photo.id);source.textContent=typeof photo.id === 'string' ? 'View original image ↗' : `Stock placeholder · ${photo.credit} / Pexels ↗`;
}
fullImage.addEventListener('error',()=>{fullImage.hidden=true;document.querySelector('.image-error').hidden=false;});
function navigate(direction){current=(current+direction+visible.length)%visible.length;showImage();}
document.querySelector('.previous').addEventListener('click',()=>navigate(-1));
document.querySelector('.next').addEventListener('click',()=>navigate(1));
document.querySelector('.close-lightbox').addEventListener('click',()=>modal.close());
modal.addEventListener('close',()=>{document.body.style.overflow='';resetZoom();openingCard?.focus({preventScroll:true});});
modal.addEventListener('keydown',event=>{if(event.key==='ArrowRight'){event.preventDefault();navigate(1);}if(event.key==='ArrowLeft'){event.preventDefault();navigate(-1);}});
zoomButton.addEventListener('click',()=>{const zoomed=stage.classList.toggle('zoomed');zoomButton.setAttribute('aria-pressed',String(zoomed));zoomButton.textContent=zoomed?'Zoom −':'Zoom +';});
let swipeStart=null;
stage.addEventListener('touchstart',e=>{swipeStart=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
stage.addEventListener('touchend',e=>{if(!swipeStart||stage.classList.contains('zoomed'))return;const dx=e.changedTouches[0].clientX-swipeStart.x,dy=e.changedTouches[0].clientY-swipeStart.y;if(Math.abs(dx)>60&&Math.abs(dx)>Math.abs(dy)*1.5)navigate(dx<0?1:-1);swipeStart=null;},{passive:true});
function notice(title,html){document.querySelector('#info-title').textContent=title;document.querySelector('#info-content').innerHTML=html;info.showModal();document.body.style.overflow='hidden';}
document.querySelector('.close-info').addEventListener('click',()=>info.close());
info.addEventListener('close',()=>{document.body.style.overflow='';});
info.addEventListener('click',e=>{if(e.target===info){const r=info.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)info.close();}});
document.querySelector('[data-contact]').addEventListener('click',()=>{
  if(CONTACT.email){location.href=`mailto:${CONTACT.email}?subject=${encodeURIComponent('Performance & workshop inquiry')}`;return;}
  notice('Performance & workshop inquiries','<p>Thank you for your interest in connecting with Jayshree Jewa. Booking contact details will be available here soon.</p><p>This is a portfolio preview; inquiries cannot be sent yet.</p>');
});
document.querySelectorAll('[data-social]').forEach(link=>{const key=link.dataset.social;if(CONTACT[key]){link.href=key==='email'?`mailto:${CONTACT[key]}`:CONTACT[key];if(key!=='email'){link.target='_blank';link.rel='noopener noreferrer';}}else{link.addEventListener('click',e=>{e.preventDefault();notice('Let’s connect','<p>Jayshree’s verified contact and social links will be added here soon.</p>');});}});
document.querySelector('.credits-button').addEventListener('click',()=>notice('Behind the photographs',`<p>This collection includes twelve images provided for this portfolio.</p><ul>${photos.map(p=>`<li><a href="${sourceURL(p.id)}" target="_blank" rel="noopener noreferrer">${p.title}</a> — ${typeof p.id === 'string' ? p.credit : `${p.credit} / Pexels · Stock placeholder`}</li>`).join('')}</ul>`));
const particles=document.querySelector('.particles');
for(let i=0;i<26;i++){const dot=document.createElement('i');dot.style.cssText=`left:${(i*37)%100}%;top:${(i*23)%100}%;width:${i%3+1}px;height:${i%3+1}px;--duration:${7+i%7}s;animation-delay:-${i%9}s`;particles.append(dot);}
const ring=document.querySelector('.cursor-ring');
document.addEventListener('pointermove',e=>{if(!finePointer.matches||reducedMotion.matches)return;ring.style.left=`${e.clientX}px`;ring.style.top=`${e.clientY}px`;ring.style.opacity='1';ring.classList.toggle('expanded',Boolean(e.target.closest('a,button')));});
document.documentElement.addEventListener('pointerleave',()=>ring.style.opacity='0');
document.querySelector('#year').textContent=new Date().getFullYear();
renderGallery();

