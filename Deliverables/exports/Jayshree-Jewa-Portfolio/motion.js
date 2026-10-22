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
    if (innerWidth > 700) document.querySelectorAll('.set-black .set-collage .gallery-card').forEach((card, index) => {
      const rect = card.getBoundingClientRect();
      if (rect.top < innerHeight && rect.bottom > 0) card.style.setProperty('--parallax', `${Math.max(-16, Math.min(16, (innerHeight / 2 - rect.top) * (index % 2 ? .025 : -.025)))}px`);
    });
  }
  requestAnimationFrame(animateScene);
}
requestAnimationFrame(animateScene);

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
