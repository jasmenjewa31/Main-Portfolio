document.querySelectorAll('.hero, .showcase, .markets, .process, .contact').forEach((section) => {
  const canvas = section?.querySelector('.process-background');
  const context = canvas?.getContext('2d');
  if (!context) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const mobileDrift = window.matchMedia('(max-width: 720px) and (prefers-reduced-motion: no-preference)');
  const accent = 'rgba(216,195,155,0.28)';
  let width = 1, height = 1, frame = 0, lastTime = 0, elapsed = 0;
  let visible = true;
  const pointer = { x: 0.7, y: 0.45, targetX: 0.7, targetY: 0.45, strength: 0, targetStrength: 0 };
  function drawTrails(time) {
    const drift = (pointer.x - 0.5) * 65 * pointer.strength;
    const slope = 0.42 + (pointer.y - 0.5) * 0.12 * pointer.strength;
    for (let i = 0; i < 55; i++) {
      const length = 180 + (i % 5) * 48;
      const travel = width + length * 2;
      // Spread trails across the visible width instead of a height-sized off-screen area.
      const phase = (i * 0.61803398875) % 1;
      const x = ((phase * travel + time * (0.027 + i % 3 * 0.005)) % travel) - length + drift;
      const y = ((i * 0.41421356237) % 1) * height + length * slope * 0.5;
      const colour = i % 3 === 0 ? 'rgba(240,211,155,0.80)' :
        i % 3 === 1 ? 'rgba(255,239,207,0.68)' : 'rgba(216,185,128,0.55)';
      const trail = context.createLinearGradient(x, y, x + length, y - length * slope);
      trail.addColorStop(0, 'transparent');
      trail.addColorStop(0.30, colour);
      trail.addColorStop(0.70, colour);
      trail.addColorStop(1, 'transparent');
      context.strokeStyle = trail;
      context.lineWidth = i % 3 === 0 ? 1.8 : 1.1;
      context.beginPath();
      context.moveTo(x, y);
      context.lineTo(x + length, y - length * slope);
      context.stroke();
    }
  }
  function draw(time) {
    context.clearRect(0, 0, width, height);
    if (['top', 'showcase', 'markets'].includes(section.id)) { drawTrails(time); return; }
    const radius = Math.min(width * 0.45, 320);
    for (let row = 0; row < 32; row++) {
      context.beginPath();
      context.strokeStyle = row % 4 === 0 ? accent : 'rgba(240,227,202,0.11)';
      context.lineWidth = row % 4 === 0 ? 1.2 : 0.8;
      for (let column = 0; column <= 64; column++) {
        const x = width * column / 64;
        const baseline = height * (row / 31 * 1.2 - 0.1);
        const wave = Math.sin(column * 0.075 + row * 0.13 + time * 0.00013) * 45
          + Math.sin(column * 0.035 - time * 0.000085) * 55;
        const dx = x - pointer.x * width;
        const dy = baseline + wave - pointer.y * height;
        const influence = Math.pow(Math.max(0, 1 - Math.hypot(dx, dy) / radius), 2) * pointer.strength;
        const y = baseline + wave + influence * (dy >= 0 ? 1 : -1) * 65;
        if (column === 0) context.moveTo(x, y);
        else context.lineTo(x, y);
      }
      context.stroke();
    }
  }
  function animate(now) {
    frame = 0;
    if (!visible || document.hidden || reducedMotion.matches) return;
    const delta = lastTime ? Math.min(now - lastTime, 50) : 16;
    lastTime = now;
    elapsed += delta;
    const ease = 1 - Math.exp(-delta / 190);
    pointer.x += (pointer.targetX - pointer.x) * ease;
    pointer.y += (pointer.targetY - pointer.y) * ease;
    pointer.strength += (pointer.targetStrength - pointer.strength) * ease;
    draw(elapsed);
    frame = requestAnimationFrame(animate);
  }
  function refresh() {
    cancelAnimationFrame(frame);
    frame = 0;
    lastTime = 0;
    if (mobileDrift.matches) {
      context.clearRect(0, 0, width, height);
    } else if (reducedMotion.matches) {
      pointer.strength = 0;
      draw(0);
    } else if (visible && !document.hidden) {
      frame = requestAnimationFrame(animate);
    }
  }
  function resize() {
    const rect = section.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    const ratio = Math.min(window.devicePixelRatio || 1, width < 720 ? 1 : 1.5, 4096 / Math.max(width, height));
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(reducedMotion.matches ? 0 : elapsed);
    refresh();
  }
  function track(event) {
    if (reducedMotion.matches) return;
    const rect = section.getBoundingClientRect();
    pointer.targetX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    pointer.targetY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    pointer.targetStrength = 1;
  }
  section.addEventListener('pointermove', track, { passive: true });
  section.addEventListener('pointerdown', track, { passive: true });
  section.addEventListener('pointercancel', () => { pointer.targetStrength = 0; });
  section.addEventListener('pointerup', () => { pointer.targetStrength = 0; });
  section.addEventListener('pointerleave', () => { pointer.targetStrength = 0; });
  document.addEventListener('visibilitychange', refresh);
  window.addEventListener('pageshow', refresh);
  if (reducedMotion.addEventListener) reducedMotion.addEventListener('change', refresh);
  else if (reducedMotion.addListener) reducedMotion.addListener(refresh);
  if ('ResizeObserver' in window) new ResizeObserver(resize).observe(section);
  else window.addEventListener('resize', resize, { passive: true });
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      refresh();
    }, { threshold: 0 }).observe(section);
  }
  resize();
});
