
import { MONUMENTS, TYPES, CARD_FILTERS, RAD_FILTERS } from './monuments-data.js';
import { MONUMENT_PHOTOS } from './monuments-photos.js';
const root = document.getElementById('monument-library');
const esc = (s='') => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
if (root) init();
function init(){
  const initial = MONUMENTS[0]?.id || '';
  root.innerHTML = `
    <div class="mon-head">
      <div class="mon-intro">
        <p class="mon-kicker">FIELD MANUAL / MONUMENTS</p>
        <h3>Everything you need before you leave base.</h3>
        <p>No long walkthroughs. Just the fast information: where the RT is, how much radiation to expect, what cards and fuses you need, what you get back, what utility is on site and a fast YouTube guide link if you want a route video.</p>
      </div>
      <div class="mon-stats">
        <div class="mon-stat"><strong>${MONUMENTS.length}</strong><span>Monument cards</span></div>
        <div class="mon-stat"><strong>${MONUMENTS.filter(m=>m.cards!=='None').length}</strong><span>Card routes</span></div>
        <div class="mon-stat"><strong>${MONUMENTS.filter(m=>m.type==='small').length}</strong><span>Small / roadside</span></div>
        <div class="mon-stat"><strong>${MONUMENTS.filter(m=>m.type==='large'||m.type==='ocean').length}</strong><span>High-tier / ocean</span></div>
      </div>
    </div>
    <form class="mon-filters" id="mon-filters">
      <div class="mon-filters-grid">
        <label class="mon-field"><span>Search</span><input id="mon-query" type="search" placeholder="Dome, harbor, red card, recycler…"></label>
        <label class="mon-field"><span>Type</span><select id="mon-type">${TYPES.map(t=>`<option value="${t}">${labelType(t)}</option>`).join('')}</select></label>
        <label class="mon-field"><span>Needed card</span><select id="mon-card">${CARD_FILTERS.map(t=>`<option value="${t}">${labelCard(t)}</option>`).join('')}</select></label>
        <label class="mon-field"><span>Radiation</span><select id="mon-rad">${RAD_FILTERS.map(t=>`<option value="${t}">${labelRad(t)}</option>`).join('')}</select></label>
        <label class="mon-field"><span>Utility</span><select id="mon-amenity"><option value="all">Any</option><option>Recycler</option><option>Oil refinery</option><option>Repair bench</option><option>Research table</option><option>Safe zone</option></select></label>
        <label class="mon-field"><span>Sort</span><select id="mon-sort"><option value="curated">Curated</option><option value="name">Name A–Z</option><option value="rad">Lowest radiation first</option><option value="difficulty">Difficulty</option></select></label>
      </div>
      <div class="mon-toggle-row"><label class="mon-toggle"><input type="checkbox" id="mon-puzzle-only"> Puzzle monuments only</label><button type="reset" class="mon-button">Reset filters</button></div>
    </form>
    <div class="mon-results">
      <div>
        <div class="mon-count"><output id="mon-count" aria-live="polite"></output><span>Quick cards · choose one to open full details</span></div>
        <div class="mon-list" id="mon-list"></div>
      </div>
      <div class="mon-detail" id="mon-detail" data-selected="${esc(initial)}"></div>
    </div>
    <div class="mon-footer">
      <p>Monument categories are grounded on the Rust Wiki monument listing. Puzzle requirements, radiation bands and reward progression were cross-checked against current community-maintained monument references.</p>
      <p>In-game photographs: <a href="https://rusttoolhub.com/en/guides/monuments" target="_blank" rel="noopener noreferrer">Rust Hub</a> / Rustbench, May 2026. Images are hosted by their source; the Rust game and its assets belong to Facepunch. Individual credits are shown on each detail card.</p>
      <p>Where current sources disagree — for example on The Dome, Train Yard or Missile Silo values — the card explicitly warns you instead of pretending the answer is perfectly exact.</p>
    </div>`;
  root.querySelector('#mon-filters').addEventListener('input', render);
  root.querySelector('#mon-filters').addEventListener('reset', ()=>setTimeout(render));
  root.querySelector('#mon-list').addEventListener('click', onCardClick);
  root.querySelector('#mon-list').addEventListener('keydown', e=>{if(e.target.matches('[data-mon-id]') && ['Enter',' '].includes(e.key)){e.preventDefault();onCardClick(e);}});
  render();
}
function labelType(v){return ({all:'All types',small:'Small / roadside',large:'Large / inland',safe:'Safe zones',ocean:'Ocean'}[v])||v;}
function labelCard(v){return ({all:'Any',none:'No card',green:'Green',blue:'Blue',red:'Red'}[v])||v;}
function labelRad(v){return ({all:'Any',none:'No radiation',low:'Low',mid:'Medium',high:'High'}[v])||v;}
function onCardClick(e){
  const card = e.target.closest('[data-mon-id]');
  if(!card) return;
  const id = card.dataset.monId;
  root.querySelector('#mon-detail').dataset.selected = id;
  render();
  if(window.matchMedia('(max-width: 1100px)').matches) root.querySelector('#mon-detail').scrollIntoView({block:'start'});
}
function parseRadLevel(mon){
  const txt = `${mon.radiation} ${mon.protection}`.toLowerCase();
  if (mon.radiation.trim().toLowerCase() === 'none') return 'none';
  if (txt.includes('50') || txt.includes('80') || txt.includes('high')) return 'high';
  if (txt.includes('26') || txt.includes('25') || txt.includes('mid')) return 'mid';
  return 'low';
}
function neededCard(mon){
  const txt = mon.cards.toLowerCase();
  if (txt.includes('red')) return 'red';
  if (txt.includes('blue')) return 'blue';
  if (txt.includes('green')) return 'green';
  return 'none';
}
function isPuzzle(mon){ return mon.cards !== 'None' || mon.fuses > 0; }
function render(){
  const q = root.querySelector('#mon-query').value.trim().toLowerCase();
  const type = root.querySelector('#mon-type').value;
  const card = root.querySelector('#mon-card').value;
  const rad = root.querySelector('#mon-rad').value;
  const amenity = root.querySelector('#mon-amenity').value;
  const sort = root.querySelector('#mon-sort').value;
  const puzzleOnly = root.querySelector('#mon-puzzle-only').checked;
  let list = MONUMENTS.filter(mon => {
    const searchable = `${mon.name} ${mon.type} ${mon.zone} ${mon.description} ${mon.tags.join(' ')} ${mon.cards} ${mon.gives} ${mon.amenities.join(' ')} ${mon.location}`.toLowerCase();
    if (q && !q.split(/\s+/).every(word => searchable.includes(word))) return false;
    if (type !== 'all' && mon.type !== type) return false;
    if (card !== 'all' && neededCard(mon) !== card) return false;
    if (rad !== 'all' && parseRadLevel(mon) !== rad) return false;
    if (amenity !== 'all' && !mon.amenities.includes(amenity)) return false;
    if (puzzleOnly && !isPuzzle(mon)) return false;
    return true;
  });
  if (sort === 'name') list.sort((a,b)=>a.name.localeCompare(b.name));
  else if (sort === 'rad') list.sort((a,b)=>['none','low','mid','high'].indexOf(parseRadLevel(a)) - ['none','low','mid','high'].indexOf(parseRadLevel(b)));
  else if (sort === 'difficulty') list.sort((a,b)=>a.difficulty.localeCompare(b.difficulty));

  root.querySelector('#mon-count').textContent = `${list.length} of ${MONUMENTS.length} monuments`;
  const selected = root.querySelector('#mon-detail').dataset.selected;
  const safeSelected = list.some(m=>m.id===selected) ? selected : (list[0]?.id || '');
  root.querySelector('#mon-detail').dataset.selected = safeSelected;
  const listEl = root.querySelector('#mon-list');
  listEl.innerHTML = list.length ? list.map(mon=>cardHtml(mon, mon.id===safeSelected)).join('') : `<div class="mon-empty"><h4>No monuments found.</h4><p>Try a broader search or clear one of the filters.</p></div>`;
  const detailEl = root.querySelector('#mon-detail');
  const monument = MONUMENTS.find(m=>m.id===safeSelected);
  detailEl.innerHTML = monument ? detailHtml(monument) : `<div class="mon-empty"><h4>No selection.</h4></div>`;
  root.querySelectorAll('img.mon-photo').forEach(img=>{
    const fail=()=>{
      if(img.dataset.retry==='0'){img.dataset.retry='1';img.src=img.dataset.original;return;}
      img.hidden=true;img.parentElement.classList.add('mon-photo-unavailable');
    };
    img.addEventListener('error',fail);
    if(img.complete && img.naturalWidth===0 && img.loading!=='lazy') fail();
  });
}
function cardHtml(mon, active){
  const radClass = `rad-${parseRadLevel(mon)}`;
  return `<article class="mon-card ${active?'is-active':''}" data-mon-id="${esc(mon.id)}" tabindex="0" role="button" aria-label="View ${esc(mon.name)}" aria-pressed="${active}">
    <div class="mon-visual">
      ${visual(mon)}
      <span class="mon-zone">${esc(mon.zone)}</span>
    </div>
    <div class="mon-card-body">
      <div class="mon-card-top"><div><h4>${esc(mon.name)}</h4><small>${esc(labelType(mon.type))} · ${esc(mon.difficulty)}</small></div><span class="mon-badge ${radClass}">${esc(mon.radiation)}</span></div>
      <div class="mon-mini"><span class="mon-pill">Cards: ${esc(mon.cards)}</span><span class="mon-pill">Fuses: ${mon.fuses||0}</span>${mon.amenities.includes('Recycler')?'<span class="mon-pill">Recycler</span>':''}</div>
      <p>${esc(mon.description)}</p>
    </div>
  </article>`;
}
function detailHtml(mon){
  return `<div class="mon-detail-head"><div><div class="mon-detail-top"><span class="mon-pill">${esc(labelType(mon.type))}</span><span class="mon-pill">${esc(mon.zone)}</span><span class="mon-pill">${esc(mon.difficulty)}</span></div><h3>${esc(mon.name)}</h3><p>${esc(mon.description)}</p></div><div class="mon-actions"><a class="mon-action primary" href="${esc(mon.video)}" target="_blank" rel="noopener noreferrer">▶ Find YouTube guide</a></div></div>
  <figure class="mon-photo-figure">
    <a class="mon-location-visual" href="${esc(MONUMENT_PHOTOS[mon.id].source)}" target="_blank" rel="noopener noreferrer" aria-label="Open photo source for ${esc(mon.name)}">${visual(mon,true)}<span class="mon-photo-link">PHOTO SOURCE ↗</span></a>
    <figcaption><span>${esc(mon.location)}${mon.id==='harbor'?' Photo: large harbor variant.':''}</span><a href="${esc(MONUMENT_PHOTOS[mon.id].source)}" target="_blank" rel="noopener noreferrer">Rust Hub / Rustbench ↗</a></figcaption>
  </figure>
  <div class="mon-detail-grid mon-requirements-grid">
    <div class="mon-panel">
      <h4>Quick requirements</h4>
      <div class="mon-info-grid">
        <div class="mon-info"><span>Radiation</span><strong>${esc(mon.radiation)}</strong></div>
        <div class="mon-info"><span>Recommended protection</span><strong>${esc(mon.protection)}</strong></div>
        <div class="mon-info"><span>Needed card(s)</span><strong>${esc(mon.cards)}</strong></div>
        <div class="mon-info"><span>Fuse boxes</span><strong>${mon.fuses || 0}</strong></div>
        <div class="mon-info"><span>What you get</span><strong>${esc(mon.gives)}</strong></div>
        <div class="mon-info"><span>Utilities on site</span><strong>${mon.amenities.length ? esc(mon.amenities.join(' · ')) : 'None notable in quick card'}</strong></div>
      </div>
    </div>
  </div>
  <div class="mon-detail-grid">
    <div class="mon-panel"><h4>On-site notes</h4><ul class="mon-listing"><li><strong>Loot / purpose:</strong> ${esc(mon.loot)}</li><li><strong>NPCs / threats:</strong> ${esc(mon.npcs)}</li><li><strong>Useful tags:</strong> ${esc(mon.tags.join(' · '))}</li></ul></div>
    <div class="mon-panel"><h4>Practical note</h4><p>${esc(mon.notes)}</p></div>
  </div>`;
}
function visual(mon, large=false){
  const photo=MONUMENT_PHOTOS[mon.id];
  const alt=mon.id==='underwater-labs'?'In-game interior of Underwater Labs':mon.id==='harbor'?'In-game aerial view of the large Harbor variant':`In-game view of ${mon.name}`;
  return `<span class="mon-photo-fallback" aria-hidden="true"><span>IMAGE UNAVAILABLE</span><strong>${esc(mon.name)}</strong><small>View the original source in the details.</small></span><img class="mon-photo" src="${esc(photo.url)}" data-original="${esc(photo.original)}" data-retry="0" alt="${esc(alt)}" width="1000" height="563" loading="${large?'eager':'lazy'}" decoding="async" referrerpolicy="no-referrer">`;
}
