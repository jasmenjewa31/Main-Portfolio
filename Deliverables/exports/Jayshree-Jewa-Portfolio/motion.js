'use strict';
// Shared motion control respects both explicit pause and OS accessibility settings.
const motionButton = document.querySelector('.motion-toggle');
const heroArt = document.querySelector('.hero-art');
let motionPaused = reducedMotion.matches;
const featuredStrip = document.querySelector('.hero-filmstrip');
const featuredCards = [...document.querySelectorAll('.hero-frame')];
const cardMotion = featuredCards.map(() => ({x:0,y:0,shift:0,targetX:0,targetY:0}));
featuredCards.forEach((card,index) => {
  card.addEventListener('pointermove', event => {
    if (motionPaused || reducedMotion.matches || !finePointer.matches) return;
    const bounds = card.getBoundingClientRect();
    cardMotion[index].targetX = ((event.clientX - bounds.left) / bounds.width - .5) * 7;
    cardMotion[index].targetY = -((event.clientY - bounds.top) / bounds.height - .5) * 5;
  });
  card.addEventListener('pointerleave', () => {
    cardMotion[index].targetX = 0;
    cardMotion[index].targetY = 0;
  });
});

function syncMotion() {
  document.body.classList.toggle('motion-paused', motionPaused);
  document.body.classList.toggle('ambient-motion-opt-in', reducedMotion.matches && !motionPaused);
  motionButton.textContent = motionPaused ? 'Play motion' : 'Pause motion';
  motionButton.setAttribute('aria-pressed', String(motionPaused));
  if (motionPaused) {
    document.querySelectorAll('[style]').forEach(el => el.style.removeProperty('--parallax'));
    featuredCards.forEach((card,index) => {
      Object.assign(cardMotion[index], {x:0,y:0,shift:0,targetX:0,targetY:0});
      ['--card-shift','--pointer-x','--pointer-y'].forEach(name => card.style.removeProperty(name));
    });
  }
}
motionButton.addEventListener('click', () => { motionPaused = !motionPaused; syncMotion(); });
reducedMotion.addEventListener('change', () => { motionPaused = reducedMotion.matches; syncMotion(); });
syncMotion();
let previousTime = performance.now();
function animateScene(time) {
  const delta = Math.min(time - previousTime, 50);
  previousTime = time;
  if (!motionPaused && !document.hidden && !modal.open && !info.open) {
    const stripBounds = featuredStrip.getBoundingClientRect();
    if (stripBounds.top < innerHeight && stripBounds.bottom > 0) {
      const progress = Math.max(-1, Math.min(1, (innerHeight / 2 - (stripBounds.top + stripBounds.height / 2)) / (innerHeight / 2)));
      const smooth = 1 - Math.exp(-delta / 90);
      featuredCards.forEach((card,index) => {
        const state = cardMotion[index];
        const shiftTarget = progress * [16,-12,20][index];
        state.shift += (shiftTarget - state.shift) * smooth;
        state.x += (state.targetX - state.x) * smooth;
        state.y += (state.targetY - state.y) * smooth;
        card.style.setProperty('--card-shift', state.shift.toFixed(2) + 'px');
        card.style.setProperty('--pointer-x', state.x.toFixed(2) + 'deg');
        card.style.setProperty('--pointer-y', state.y.toFixed(2) + 'deg');
      });
    }

  }
  requestAnimationFrame(animateScene);
}
requestAnimationFrame(animateScene);

function setupAspectCarousel() {
  const section = featuredStrip.closest('.dance-aspects');
  const controls = section.querySelector('.aspect-controls');
  const counter = controls.querySelector('.aspect-count');
  const [previous, next] = controls.querySelectorAll('button');
  const discover = document.querySelector('.hero-bottom a');
  const phone = matchMedia('(max-width: 700px)');
  let current = 0;
  let slides = [];
  let timer;
  let touchStart;

  function update() {
    featuredCards.forEach((card, index) => {
      card.inert = phone.matches && index !== current;
    });
    counter.textContent = (current + 1) + ' / ' + featuredCards.length;
  }

  function advance(step) {
    const outgoing = featuredCards[current];
    current = (current + step + featuredCards.length) % featuredCards.length;
    const incoming = featuredCards[current];
    slides.forEach(animation => animation.cancel());
    update();
    scheduleAdvance();
    if (motionPaused || reducedMotion.matches) return;
    const shift = step * 100;
    const timing = {duration: 520, easing: 'cubic-bezier(.25,.75,.25,1)'};
    slides = [
      outgoing.animate([{visibility:'visible', transform:'translateX(0)'}, {visibility:'visible', transform:'translateX(' + shift + '%)'}], timing),
      incoming.animate([{transform:'translateX(' + -shift + '%)'}, {transform:'translateX(0)'}], timing)
    ];
  }

  function scheduleAdvance() {
    clearInterval(timer);
    if (!phone.matches) return;
    timer = setInterval(() => {
      if (section.classList.contains('motion-in-view') && !motionPaused && !reducedMotion.matches &&
          !document.hidden && !modal.open && !info.open && !touchStart && !section.contains(document.activeElement)) {
        advance(1);
      }
    }, 4200);
  }

  function configure() {
    slides.forEach(animation => animation.cancel());
    section.classList.toggle('aspect-carousel', phone.matches);
    controls.hidden = !phone.matches;
    discover.hash = phone.matches ? 'dance-aspects' : 'gallery';
    update();
    scheduleAdvance();
  }

  previous.addEventListener('click', () => advance(-1));
  next.addEventListener('click', () => advance(1));
  featuredStrip.addEventListener('touchstart', event => {
    touchStart = phone.matches && event.touches.length === 1 ? event.touches[0] : null;
  }, {passive:true});
  featuredStrip.addEventListener('touchcancel', () => { touchStart = null; });
  featuredStrip.addEventListener('touchend', event => {
    if (!touchStart) return;
    const end = event.changedTouches[0];
    const dx = end.clientX - touchStart.clientX;
    const dy = end.clientY - touchStart.clientY;
    touchStart = null;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (event.cancelable) event.preventDefault();
      advance(Math.sign(dx));
    } else if (event.cancelable && Math.hypot(dx, dy) < 8) {
      const card = event.target.closest('.hero-frame');
      if (card && !card.inert) {
        event.preventDefault();
        card.click();
      }
    }
  }, {passive:false});
  phone.addEventListener('change', configure);
  configure();
}
setupAspectCarousel();

// Featured header cards open the same accessible viewer as the gallery.
document.querySelectorAll('[data-feature]').forEach(button => {
  button.addEventListener('click', () => {
    const selected = photos.find(photo => photo.id === button.dataset.feature);
    if (!selected) return;
    const previousVisible = visible;
    const previousCurrent = current;
    visible = photos.filter(photo => typeof photo.id === 'string');
    current = visible.indexOf(selected);
    openingCard = button;
    showImage();
    modal.showModal();
    document.body.style.overflow = 'hidden';
    modal.addEventListener('close', () => {
      visible = previousVisible;
      current = previousCurrent;
    }, {once:true});
  });
});

// One fluid selection indicator, positioned again when filters wrap or fonts load.
const filterPill = document.createElement('span');
filterPill.className = 'filter-pill';
filterPill.setAttribute('aria-hidden', 'true');
filters.prepend(filterPill);
function updateFilterPill() {
  const selected = filters.querySelector('button[aria-pressed="true"]');
  if (!selected) return;
  filterPill.style.width = selected.offsetWidth + 'px';
  filterPill.style.height = selected.offsetHeight + 'px';
  filterPill.style.transform = 'translate(' + selected.offsetLeft + 'px,' + selected.offsetTop + 'px)';
}
filters.addEventListener('click', () => requestAnimationFrame(updateFilterPill));
new ResizeObserver(updateFilterPill).observe(filters);
document.fonts.ready.then(updateFilterPill);
updateFilterPill();

// Ambient layers stay behind the content of every main site section.
document.querySelectorAll('.cinematic-hero,.dance-aspects,.collection,.philosophy,footer').forEach(section=>{
  section.classList.add('ambient-section');
  const atmosphere=document.createElement('div');
  atmosphere.className='site-atmosphere';
  atmosphere.setAttribute('aria-hidden','true');
  section.prepend(atmosphere);
});

// Section choreography: decoration never intercepts clicks or changes image crops.
const sectionMotionObserver = new IntersectionObserver(entries => {
  entries.forEach(({target,isIntersecting}) => target.classList.toggle('motion-in-view',isIntersecting));
}, {rootMargin:'60px'});
const entranceObserver = new IntersectionObserver(entries => {
  entries.forEach(({target,isIntersecting}) => {
    if (!isIntersecting) return;
    target.classList.add('section-arrived');
    entranceObserver.unobserve(target);
  });
}, {threshold:.12});
function prepareSectionMotion() {
  document.querySelectorAll('.ambient-section,.photo-set').forEach((section,index) => {
    if(section.dataset.motionReady) return;
    section.dataset.motionReady='true';
    section.classList.add('motion-zone');
    sectionMotionObserver.observe(section);
    let atmosphere=section.querySelector(':scope > .site-atmosphere');
    if(!atmosphere){
      section.classList.add('ambient-section');
      atmosphere=document.createElement('div');atmosphere.className='site-atmosphere';
      atmosphere.setAttribute('aria-hidden','true');section.prepend(atmosphere);
    }
    const ribbon=document.createElement('b');ribbon.className='section-light-ribbon';
    ribbon.style.setProperty('--flow-delay',(-index*3)+'s');atmosphere.append(ribbon);
    for(let i=0;i<7;i++){
      const dot=document.createElement('i');
      dot.style.cssText='--x:'+((i*17+index*9)%96)+'%;--y:'+((i*29+18)%94)+'%;--size:3px;--duration:'+(10+i*2)+'s;--delay:'+(-i*2)+'s';
      atmosphere.append(dot);
    }
  });
  document.querySelectorAll('.hero-copy,.hero-actions,.section-heading,.set-heading,.dance-verse,.shiva-copy,.footer-connect,.footer-artwork').forEach(el=>{
    if(el.classList.contains('section-entrance'))return;
    el.classList.add('section-entrance');entranceObserver.observe(el);
  });
  document.querySelectorAll('.dance-aspects .hero-frame,.set-black .gallery-card,.shiva-artwork').forEach((el,index)=>{
    if(el.classList.contains('section-float'))return;
    el.classList.add('section-float');el.style.setProperty('--float-delay',(-index*1.3)+'s');
    sectionMotionObserver.observe(el);
  });
}
prepareSectionMotion();
new MutationObserver(prepareSectionMotion).observe(grid,{childList:true});
