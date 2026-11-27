// DealHound: the list with search and filters that work, and a page per deal,
// on hash routes. The deals live in data.js, so the site needs no network to
// show them; each deal links out to its store.
//
//   #/            the list, with search + category/store/discount filters
//   #/deal/<id>   one deal
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals } from './data.js';
import { card, deal, list, missing } from './views.js';

const app = document.getElementById('app');

function pctOff(d) {
  return Math.round((1 - d.price / d.was) * 100);
}

function applyFilters() {
  const q = document.getElementById('q').value.trim().toLowerCase();
  const cat = document.getElementById('cat').value;
  const store = document.getElementById('store').value;
  const disc = Number(document.getElementById('disc').value);
  const shown = deals
    .filter((d) => (q === '' || `${d.title} ${d.store} ${d.category}`.toLowerCase().includes(q)))
    .filter((d) => cat === '' || d.category === cat)
    .filter((d) => store === '' || d.store === store)
    .filter((d) => pctOff(d) >= disc)
    .sort((a, b) => pctOff(b) - pctOff(a));
  const grid = document.getElementById('grid');
  grid.innerHTML = shown.length === 0
    ? '<li class="empty">No deal matches those filters — try clearing one.</li>'
    : shown.map(card).join('');
  document.getElementById('count').textContent = `${shown.length} of ${deals.length} deals`;
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : 'Not found'} | DealHound`;
    app.innerHTML = found ? deal(found) : missing();
  } else {
    document.title = 'DealHound — Real Black Friday 2026 deals, checked today';
    app.innerHTML = list(deals);
    for (const id of ['q', 'cat', 'store', 'disc']) {
      document.getElementById(id).addEventListener('input', applyFilters);
    }
    applyFilters();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
