(() => {
  'use strict';
  const dialog = document.getElementById('wa-enquiry');
  // Keep the direct WhatsApp links functional on browsers without native dialogs.
  if (!dialog || typeof dialog.showModal !== 'function') return;

  const form = document.getElementById('wa-form');
  const fields = Object.fromEntries(['name', 'brand', 'type', 'style', 'reference', 'notes']
    .map(key => [key, document.getElementById(`wa-${key}`)]));
  const services = Array.from(form.querySelectorAll('input[type="checkbox"]'));
  const error = document.getElementById('wa-service-error');
  const messageInput = document.getElementById('wa-message-value');
  const preview = document.getElementById('wa-message-preview');
  const triggers = document.querySelectorAll('[data-whatsapp-enquiry]');
  let opener;
  let savedScroll = 0;
  let savedStyles;

  function buildMessage() {
    const values = Object.fromEntries(Object.entries(fields).map(([key, input]) => [key, input.value.trim()]));
    const selected = services.filter(input => input.checked).map(input => input.value);
    const lines = [
      'Hi Jasmen! I found your portfolio on jasmen.asia and would love to discuss a website project.',
      '',
      `Name: ${values.name || 'Not provided yet'}`,
    ];
    if (values.brand) lines.push(`Business / brand: ${values.brand}`);
    lines.push(`Services: ${selected.join(', ') || 'Not selected yet'}`,
      `Website category: ${values.type || 'Not selected yet'}`,
      `Preferred look & feel: ${values.style}`);
    if (values.reference) lines.push(`Website inspiration: ${values.reference}`);
    if (values.notes) lines.push('', 'Project details:', values.notes);
    lines.push('', 'Could you share your availability, recommended approach and an estimated quote? Thank you!');
    return lines.join('\n');
  }

  function update() {
    const selected = services.some(input => input.checked);
    services[0].setCustomValidity(selected ? '' : 'Please choose at least one service.');
    fields.name.setCustomValidity(fields.name.value.trim() ? '' : 'Please enter your name.');
    if (selected) error.hidden = true;
    messageInput.value = buildMessage();
    preview.textContent = messageInput.value;
  }

  function open(event) {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    if (dialog.open) return;
    opener = event.currentTarget;
    savedScroll = window.scrollY;
    savedStyles = Object.fromEntries(['position', 'top', 'left', 'right', 'overflow', 'paddingRight']
      .map(property => [property, document.body.style[property]]));
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.paddingRight = `${parseFloat(getComputedStyle(document.body).paddingRight) + scrollbar}px`;
    Object.assign(document.body.style, { position: 'fixed', top: `-${savedScroll}px`, left: '0', right: '0', overflow: 'hidden' });
    update();
    error.hidden = true;
    dialog.showModal();
    dialog.scrollTop = 0;
    triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'true'));
    document.getElementById('wa-title').focus({ preventScroll: true });
  }

  triggers.forEach(trigger => {
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', 'wa-enquiry');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', open);
  });
  dialog.querySelector('.wa-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const focusable = Array.from(dialog.querySelectorAll('button, input:not([type="hidden"]), select, textarea, summary, a[href]'))
      .filter(element => !element.disabled && element.getClientRects().length);
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && (document.activeElement === first || document.activeElement.id === 'wa-title')) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    Object.assign(document.body.style, savedStyles);
    const behavior = document.documentElement.style.scrollBehavior;
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, savedScroll);
    document.documentElement.style.scrollBehavior = behavior;
    triggers.forEach(trigger => trigger.setAttribute('aria-expanded', 'false'));
    if (opener) opener.focus({ preventScroll: true });
  });
  services[0].addEventListener('invalid', () => { error.hidden = false; });
  form.addEventListener('input', update);
  form.addEventListener('change', update);
  // Only the encoded message is submitted; all other controls intentionally have no name.
  // Native form navigation opens a draft in a new tab without an API or automatic sending.
  form.addEventListener('submit', update);
  update();
})();
