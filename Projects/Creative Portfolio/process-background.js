document.querySelectorAll('.process, .contact').forEach((section) => {
  const canvas = section?.querySelector('.process-background');
  const context = canvas?.getContext('2d');
  if (!context) return;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const accent = section.id === 'contact' ? 'rgba(68,208,198,0.30)' : 'rgba(243,78,78,0.30)';
  let width = 1, height = 1, frame = 0, lastTime = 0, elapsed = 0;
  let visible = true;
  const pointer = { x: 0.7, y: 0.45, targetX: 0.7, targetY: 0.45, strength: 0, targetStrength: 0 };
  function draw(time) {
    context.clearRect(0, 0, width, height);
    const radius = Math.min(width * 0.45, 320);
    for (let row = 0; row < 32; row++) {
      context.beginPath();
      context.strokeStyle = row % 4 === 0 ? accent : 'rgba(210,213,220,0.12)';
      context.lineWidth = row % 4 === 0 ? 1.2 : 0.8;
      for (let column = 0; column <= 64; column++) {
        const x = width * column / 64;
        const baseline = height * (row / 31 * 1.2 - 0.1);
        const wave = Math.sin(column * 0.075 + row * 0.13 + time * 0.00024) * 45
          + Math.sin(column * 0.035 - time * 0.00016) * 55;
        const dx = x - pointer.x * width;
        const dy = baseline + wave - pointer.y * height;
        const influence = Math.pow(Math.max(0, 1 - Math.hypot(dx, dy) / radius), 2) * pointer.strength;
        const y = baseline + wave + influence * (dy >= 0 ? 1 : -1) * 100;
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
    const ease = 1 - Math.exp(-delta / 130);
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
    if (reducedMotion.matches) {
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
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.round(width * ratio);
    canvas.height = Math.round(height * ratio);
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    draw(reducedMotion.matches ? 0 : elapsed);
    refresh();
  }
  section.addEventListener('pointermove', (event) => {
    if (reducedMotion.matches || event.pointerType === 'touch') return;
    const rect = section.getBoundingClientRect();
    pointer.targetX = Math.max(0, Math.min(1, (event.clientX - rect.left) / rect.width));
    pointer.targetY = Math.max(0, Math.min(1, (event.clientY - rect.top) / rect.height));
    pointer.targetStrength = 1;
  }, { passive: true });
  section.addEventListener('pointerleave', () => { pointer.targetStrength = 0; });
  document.addEventListener('visibilitychange', refresh);
  reducedMotion.addEventListener('change', refresh);
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
