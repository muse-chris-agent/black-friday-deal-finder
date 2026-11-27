// DealHound page HTML, built from the deal data. Every value is escaped
// before it goes into the page. The verdict is computed from the two prices
// alone, so a deal can never claim a bigger discount than its numbers show.

const escape = (s) => String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
const usd = (n) => `$${Number(n).toLocaleString('en-US', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })}`;
const percentOff = (d) => Math.round((1 - d.price / d.was) * 100);
const day = (iso) => new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'UTC' }) + ' UTC';

// Is it really a deal? Judged only by how far the sale price sits under the
// usual price: half off or more is a real deal, a small cut is barely one.
export function verdict(d) {
  const pct = percentOff(d);
  if (pct >= 50) return { key: 'real', label: `Real deal — ${pct}% off` };
  if (pct >= 30) return { key: 'solid', label: `Solid deal — ${pct}% off` };
  if (pct >= 15) return { key: 'decent', label: `Decent — ${pct}% off` };
  return { key: 'weak', label: `Weak — only ${pct}% off` };
}

export function card(d) {
  const v = verdict(d);
  return `<li class="card">
  <h2><a href="#/deal/${encodeURIComponent(d.id)}">${escape(d.title)}</a></h2>
  <div class="meta">${escape(d.store)} · ${escape(d.category)}</div>
  <div class="price"><span class="now">${usd(d.price)}</span><span class="was">usually <s>${usd(d.was)}</s></span><span class="off">${percentOff(d)}% off</span></div>
  <span class="verdict ${v.key}">${escape(v.label)}</span>
  <a class="go" href="${escape(d.url)}" rel="noopener">Shop at ${escape(d.store)} &rarr;</a>
  <div class="checked">Checked ${day(d.checked)}</div>
</li>`;
}

export function list(deals) {
  const categories = [...new Set(deals.map((d) => d.category))].sort();
  const stores = [...new Set(deals.map((d) => d.store))].sort();
  return `<h1>Black Friday deals, checked today</h1>
<p class="sub">${deals.length} real deals across ${categories.length} categories and ${stores.length} stores. Use the filters — every one works.</p>
<div class="controls">
  <input type="search" id="q" placeholder="Search a product, store or category…" aria-label="Search deals">
  <label>Category <select id="cat"><option value="">All categories</option>${categories.map((c) => `<option>${escape(c)}</option>`).join('')}</select></label>
  <label>Store <select id="store"><option value="">All stores</option>${stores.map((s) => `<option>${escape(s)}</option>`).join('')}</select></label>
  <label>Discount <select id="disc"><option value="0">Any discount</option><option value="50">50% off or more</option><option value="30">30% off or more</option><option value="15">15% off or more</option></select></label>
  <span class="count" id="count"></span>
</div>
<ul class="grid" id="grid"></ul>`;
}

export function deal(d) {
  const v = verdict(d);
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <h1>${escape(d.title)}</h1>
  <div class="meta">${escape(d.store)} · ${escape(d.category)}</div>
  <p><span class="bigprice">${usd(d.price)}</span> <span class="was">usually <s>${usd(d.was)}</s></span> <span class="off">${percentOff(d)}% off</span></p>
  <p><span class="verdict ${v.key}">${escape(v.label)}</span></p>
  <dl>
    <dt>Store</dt><dd>${escape(d.store)}</dd>
    <dt>Category</dt><dd>${escape(d.category)}</dd>
    <dt>Sale price</dt><dd>${usd(d.price)}</dd>
    <dt>Usual price</dt><dd>${usd(d.was)}</dd>
    <dt>Checked</dt><dd>${day(d.checked)}</dd>
    <dt>Price read in</dt><dd>${escape(d.source)}</dd>
  </dl>
  <p><a class="cta" href="${escape(d.url)}" rel="noopener">Find it at ${escape(d.store)} &rarr;</a></p>
  <p class="checked">Prices move during the sale — re-check at the store before you buy.</p>
</article>`;
}

export function missing() {
  return `<h1>Not found</h1>
<p class="empty">There is no deal at this address. <a href="#/">See all deals</a>.</p>`;
}
