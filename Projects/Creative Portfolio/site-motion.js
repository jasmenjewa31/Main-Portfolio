(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const running = new Set();
  const targets = document.querySelectorAll('.hero-inner > *, .showcase-grid > *, .markets-heading, .sector-grid > *, .process-heading > *, .process-stage, .contact-box, .contact-actions');
  document.querySelectorAll('.sector-grid, .process-stages, .hero-inner').forEach(group => {
    [...group.children].forEach((item, index) => { item.dataset.revealDelay = String((index % 4) * 75); });
  });
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        observer.unobserve(entry.target);
        if (reduced.matches || !entry.target.animate) return;
        const animation = entry.target.animate([
          { opacity: 0.45, translate: '0 18px' },
          { opacity: 1, translate: '0 0' }
        ], { duration: 900, delay: Number(entry.target.dataset.revealDelay || 0), easing: 'cubic-bezier(.22,1,.36,1)', fill: 'backwards' });
        running.add(animation);
        animation.finished.then(() => running.delete(animation), () => running.delete(animation));
      });
    }, { threshold: 0.08 });
    targets.forEach(target => observer.observe(target));
  }
  const progress = document.createElement('div');
  progress.className = 'scroll-progress';
  progress.setAttribute('aria-hidden', 'true');
  document.body.appendChild(progress);
  let frame = 0;
  function updateProgress() {
    frame = 0;
    const distance = document.documentElement.scrollHeight - window.innerHeight;
    const fraction = distance > 0 ? Math.min(1, Math.max(0, window.scrollY / distance)) : 0;
    progress.style.transform = 'scaleX(' + fraction + ')';
  }
  function scheduleProgress() {
    if (!frame && !reduced.matches) frame = requestAnimationFrame(updateProgress);
  }
  window.addEventListener('scroll', scheduleProgress, { passive: true });
  window.addEventListener('resize', scheduleProgress, { passive: true });
  window.addEventListener('load', scheduleProgress, { once: true });
  function onMotionChange() {
    if (reduced.matches) {
      running.forEach(animation => animation.cancel());
      running.clear();
      cancelAnimationFrame(frame);
      frame = 0;
    } else scheduleProgress();
  }
  if (reduced.addEventListener) reduced.addEventListener('change', onMotionChange);
  else if (reduced.addListener) reduced.addListener(onMotionChange);
  scheduleProgress();
})();
