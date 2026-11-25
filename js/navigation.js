/* Independent navigation; every section link is also a native HTML anchor. */
(() => {
  const links = [...document.querySelectorAll('.sidebar a[href^="#"], .header-nav a[href^="#"], .guide-card[href^="#"]')];
  const targets = [...document.querySelectorAll('main > section[id]')].filter(section => links.some(link => link.hash === '#' + section.id));
  const header = document.querySelector('.site-header');
  function highlight(id) {
    for (const link of links) {
      const active = link.hash === '#' + id;
      link.classList.toggle('is-active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    }
  }
  let queued = false;
  function onScroll() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      const threshold = (header?.getBoundingClientRect().bottom || 0) + 72;
      const end = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3;
      const currentHash = targets.find(t => '#' + t.id === location.hash);
      const atBottomTarget = end && currentHash && currentHash.getBoundingClientRect().top < window.innerHeight && currentHash.getBoundingClientRect().bottom > threshold;
      const current = atBottomTarget ? currentHash : end ? targets.at(-1) : targets.filter(t => t.getBoundingClientRect().top <= threshold).at(-1) || targets[0];
      if (current) highlight(current.id);
    });
  }
  function onHash() {
    const target = targets.find(t => '#' + t.id === location.hash);
    if (target) highlight(target.id);
    else onScroll();
  }
  window.addEventListener('hashchange', onHash);
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', onScroll, {passive:true});
  // Modules can insert long content above a deep link during startup.
  // Restore the initial anchor once all scripts and initial assets finish loading,
  // but never override a user's intervening click or scroll interaction.
  const initial = location.hash;
  let interacted = false;
  for (const type of ['pointerdown','wheel','touchstart','keydown']) window.addEventListener(type, () => { interacted = true; }, {once:true, passive:true});
  window.addEventListener('load', () => {
    if (!interacted && initial && location.hash === initial) {
      const target = targets.find(t => '#' + t.id === initial);
      if (target) target.scrollIntoView({block:'start',behavior:'instant'});
    }
    onHash();
  }, {once:true});
  onHash();
})();
