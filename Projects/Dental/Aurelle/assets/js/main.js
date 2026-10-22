const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Specialty Discipline Data */
const DISCIPLINES = [
  {
    id: 'restorative',
    title: 'Biomimetic Restorative',
    subtitle: 'Preserving Maximum Tooth Structure',
    description: 'Replacing traditional full crowns with micro-bonded inlays, onlays, and ultra-thin ceramic veneers engineered to match natural dentin flexibility.',
    image: 'assets/images/aurelle-restorative-treatment-v2.png',
    imagePosition: 'center',
    showFullImage: true,
    imageAlt: 'Dentist treating a patient with dental instruments under warm lighting',
    specs: [
      ['0.2 - 0.3mm', 'Preparation Margin Depth'],
      ['15 Years+', 'Clinical Longevity Span'],
      ['100%', 'Biocompatible Resin Matrix']
    ]
  },
  {
    id: 'endodontics',
    title: 'Microscopic Endodontics',
    subtitle: 'Root Preservation Under 25x Magnification',
    description: 'Utilizing Carl Zeiss operating microscopes and ultrasonic instrumentation to locate micro-calcified canals without damaging root wall density.',
    image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=800&q=80',
    specs: [
      ['25x Optical', 'Surgical Magnification'],
      ['Sub-micron', 'Ultrasonic Irrigation'],
      ['Single-Visit', 'Micro-Obturation']
    ]
  },
  {
    id: 'implantology',
    title: 'Guided Implantology',
    subtitle: 'Digital CBCT Surgical Templates',
    description: 'Three-dimensional bone planning and CAD/CAM surgical guides ensure precision implant insertion avoiding critical nerve and vascular structures.',
    image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&w=800&q=80',
    specs: [
      ['< 0.2mm', 'Guided Placement Margin'],
      ['99.6%', 'Implant Osseointegration'],
      ['Immediate', 'Provisional Loading']
    ]
  },
  {
    id: 'periodontics',
    title: 'Periodontal Aesthetics',
    subtitle: 'Laser Biological Tissue Management',
    description: 'Minimally invasive gingival contouring and laser-assisted decontamination to stabilize soft tissue profiles and support long-term tooth health.',
    image: 'https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&w=800&q=80',
    specs: [
      ['Laser Assisted', 'Soft-Tissue Precision'],
      ['Zero Sutures', 'Rapid Healing Protocol'],
      ['Regenerative', 'Bone Graft Integration']
    ]
  }
];

/* Render Discipline Tabs & Handle Interaction */
const tabsContainer = document.getElementById('discipline-tabs');
const displayContainer = document.getElementById('discipline-display');

DISCIPLINES.forEach((disc, idx) => {
  const btn = document.createElement('button');
  btn.className = `p-5 text-left border border-[var(--sand-300)] transition-all ${idx === 0 ? 'bg-[var(--stone-900)] text-[var(--sand-50)]' : 'bg-[var(--sand-100)] text-[var(--stone-800)]'}`;
  btn.setAttribute('role', 'tab');
  btn.innerHTML = `
    <span class="text-[10px] font-bold uppercase tracking-widest block opacity-70 mb-1">0${idx + 1}</span>
    <span class="font-serif-title text-sm block font-semibold">${disc.title}</span>
  `;
  btn.onclick = () => selectDiscipline(idx);
  tabsContainer.appendChild(btn);
});

function selectDiscipline(index) {
  const disc = DISCIPLINES[index];
  
  [...tabsContainer.children].forEach((child, i) => {
    if (i === index) {
      child.className = 'p-5 text-left border border-[var(--stone-900)] bg-[var(--stone-900)] text-[var(--sand-50)] transition-all';
    } else {
      child.className = 'p-5 text-left border border-[var(--sand-300)] bg-[var(--sand-100)] text-[var(--stone-800)] transition-all';
    }
  });

  displayContainer.innerHTML = `
    <div class="lg:col-span-6">
      <span class="text-xs uppercase font-bold tracking-widest text-[var(--terracotta)]">${disc.subtitle}</span>
      <h3 class="font-serif-title text-2xl sm:text-4xl text-[var(--stone-900)] mt-2">${disc.title}</h3>
      <p class="mt-4 text-sm leading-relaxed font-light" style="color:var(--stone-800)">${disc.description}</p>
      
      <div class="mt-8 space-y-3">
        ${disc.specs.map(spec => `
          <div class="flex justify-between items-center border-b border-[var(--sand-300)] pb-2 text-xs">
            <span class="uppercase tracking-wider font-semibold" style="color:var(--stone-800)">${spec[1]}</span>
            <span class="font-serif-title text-base font-bold text-[var(--stone-900)]">${spec[0]}</span>
          </div>
        `).join('')}
      </div>
    </div>
    <div class="lg:col-span-6">
      <div class="img-reveal arch-card" style="${disc.showFullImage ? 'width:100%;background:var(--sand-100);' : 'height:384px;'}">
        <img src="${disc.image}" alt="${disc.imageAlt || disc.title}" class="w-full h-full object-cover" style="display:block;width:100%;height:${disc.showFullImage ? 'auto' : '100%'};object-fit:${disc.showFullImage ? 'contain' : 'cover'};object-position:${disc.imagePosition || 'center'};${disc.showFullImage ? 'transform:none;' : ''}" loading="lazy">
      </div>

    </div>
  `;

  if (!prefersReducedMotion) {
    gsap.from(displayContainer.children, { opacity: 0, y: 15, duration: 0.5, stagger: 0.1 });
  }
}
selectDiscipline(0);

/* Local consultation review */
document.getElementById('consultation-form').addEventListener('submit', function(event) {
  event.preventDefault();
  const data = new FormData(this);
  document.getElementById('consultation-summary').textContent = [
    'Name: ' + data.get('name'), 'Phone: ' + data.get('phone'),
    'Interest: ' + data.get('interest'),
    data.get('concern') ? 'Concern: ' + data.get('concern') : ''
  ].filter(Boolean).join('\n');
  document.getElementById('consultation-review').hidden = false;
});

/* Numeric Counter Animations */
document.querySelectorAll('[data-val]').forEach(el => {
  const target = parseFloat(el.dataset.val);
  const decimals = parseInt(el.dataset.dec || '0');
  if (prefersReducedMotion) {
    el.textContent = target.toFixed(decimals) + (el.textContent.includes('%') ? '%' : '');
    return;
  }
  const obj = { val: 0 };
  gsap.to(obj, {
    val: target,
    duration: 2,
    ease: 'power2.out',
    onUpdate: () => {
      let suffix = '';
      if (el.dataset.val.includes('%') || el.nextElementSibling?.textContent.includes('%')) suffix = '%';
      if (el.dataset.val.includes('mm')) suffix = 'mm';
      el.textContent = obj.val.toFixed(decimals) + suffix;
    }
  });
});

/* Kinetic Particle & Ambient Organic Wave Mesh (Three.js) */
(function initThree() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.z = 15;

  // Plane Geometry for Biological Organic Topography
  const geometry = new THREE.PlaneGeometry(30, 20, 40, 30);
  const material = new THREE.MeshBasicMaterial({
    color: 0xa65237,
    wireframe: true,
    transparent: true,
    opacity: 0.12
  });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 3;
  scene.add(mesh);

  let clock = new THREE.Clock();

  function animate() {
    const t = clock.getElapsedTime() * (prefersReducedMotion ? 0 : 0.4);
    const pos = geometry.attributes.position;

    for (let i = 0; i < pos.count; i++) {
      const u = pos.getX(i);
      const v = pos.getY(i);
      const z = Math.sin(u * 0.4 + t) * Math.cos(v * 0.3 + t) * 0.8;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;

    mesh.rotation.z = t * 0.05;
    renderer.render(scene, camera);

    if (!prefersReducedMotion) {
      requestAnimationFrame(animate);
    }
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
