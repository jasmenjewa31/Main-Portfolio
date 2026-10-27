// Add more sites to a genre below. Local paths are relative to this folder.
const portfolioBaseUrl = document.currentScript.src;
const portfolioSites = {
  industrial: [{ name: 'TERAS Heavy Industries', url: '../Industrial/industrial-site/dist/index.html' }],
  arts: [{ name: 'Jayshree Jewa — Classical Dance', url: '../../Deliverables/exports/Jayshree-Jewa-Portfolio/index.html' }],
  skincare: [{ name: 'AURA Skin Care', url: '../Skin Care/AURA/index.html' }],
  fashion: [{ name: 'ELARA Couture', url: '../Fashion/ELARA/index.html' }],
  wellness: [{ name: 'Lotus Life Style', url: '../Lotus Life Style/Working Project/dist/index.html' }],
  dental: [{ name: 'Aurelle Dental', url: '../Dental/Aurelle/index.html' }],
  creators: [{ name: 'Maitreyi — Creator Portfolio', url: '../Content Creators/Maitreyi/index.html' }],
};

document.querySelectorAll('[data-genre]').forEach(card => {
  const sites = portfolioSites[card.dataset.genre] || [];
  const container = document.createElement('div');
  container.className = 'genre-sites';
  if (sites.length) {
    sites.forEach(site => {
      const link = document.createElement('a');
      link.className = 'project-link';
      link.href = new URL(site.url, portfolioBaseUrl).href;
      link.textContent = `${site.name} ↗`;
      container.append(link);
    });
  } else {
    const note = document.createElement('span');
    note.className = 'project-pending';
    note.textContent = 'New projects coming soon';
    container.append(note);
  }
  card.querySelector('.depth-layer').append(container);
});
