'use strict';
const grid = document.getElementById('game-grid');
const icons = {
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M11 19h2"/>',
  tablet: '<rect x="4" y="2" width="16" height="20" rx="2"/><path d="M11 19h2"/>',
  desktop: '<path d="M3 3h18v13H3zM8 21h8M12 16v5"/>'
};
function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}
function makeCard(game, index) {
  const card = element('article', 'game-card');
  card.dataset.accent = game.accent;
  const coverLink = element('a', 'cover-link');
  coverLink.href = game.url;
  coverLink.tabIndex = -1;
  coverLink.setAttribute('aria-hidden', 'true');
  const img = element('img');
  img.src = game.cover;
  img.alt = game.coverAlt;
  img.width = 1200;
  img.height = 800;
  img.decoding = 'async';
  img.loading = index === 0 ? 'eager' : 'lazy';
  coverLink.append(img);
  const content = element('div', 'card-content');
  const title = element('h3', '', game.title);
  title.id = 'title-' + game.id;
  card.setAttribute('aria-labelledby', title.id);
  const devices = element('div', 'device-block');
  const row = element('div', 'device-row');
  const iconGroup = element('span', 'device-icons');
  iconGroup.setAttribute('aria-hidden', 'true');
  for (const device of game.devices) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('viewBox', '0 0 24 24');
    svg.innerHTML = icons[device] || '';
    iconGroup.append(svg);
  }
  row.append(iconGroup, element('span', 'device-label', game.deviceLabel));
  devices.append(row, element('p', 'device-note', game.deviceNote));
  const play = element('a', 'play-link', '開始遊戲');
  play.href = game.url;
  play.setAttribute('aria-label', '開始遊戲：' + game.title);
  const arrow = element('span', '', '→');
  arrow.setAttribute('aria-hidden', 'true');
  play.append(arrow);
  content.append(title, element('span', 'category', game.category), element('p', 'description', game.description), devices, play);
  card.append(coverLink, content);
  return card;
}
async function loadGames() {
  grid.setAttribute('aria-busy', 'true');
  try {
    const response = await fetch('games.json', { cache: 'no-cache' });
    if (!response.ok) throw new Error('Unable to load games');
    const games = (await response.json()).filter(game => game.published).sort((a,b) => a.order - b.order);
    grid.replaceChildren(...games.map(makeCard));
    if (!games.length) grid.append(element('p', 'load-message', '新遊戲準備中，稍後再來看看。'));
    document.getElementById('game-count').textContent = games.length + ' 款遊戲';
  } catch {
    const message = element('div', 'load-message');
    const retry = element('button', 'retry-button', '重新載入');
    retry.addEventListener('click', loadGames);
    message.append(element('p', '', '暫時無法載入遊戲，請確認網路後重試。'), retry);
    grid.replaceChildren(message);
  } finally { grid.setAttribute('aria-busy', 'false'); }
}
loadGames();
