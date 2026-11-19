// Add more sites to a genre below. Local paths are relative to this folder.
const portfolioBaseUrl = document.currentScript.src;
const portfolioSites = {
  industrial: [{ name: 'TERAS Heavy Industries', url: '/demos/industrial/' }],
  arts: [{ name: 'Jayshree Jewa — Classical Dance', url: '/demos/performing-arts/' }],
  skincare: [{ name: 'AURA Skin Care', url: '/demos/skin-care/' }],
  fashion: [{ name: 'ELARA Couture', url: '/demos/fashion-retail/' }],
  wellness: [{ name: 'Lotus Life Style', url: '/demos/pilates-yoga-gym/' }],
  dental: [{ name: 'Aurelle Dental', url: '/demos/dental/' }],
  creators: [{ name: 'Maitreyi — Creator Portfolio', url: '/demos/content-creators/' }],
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
