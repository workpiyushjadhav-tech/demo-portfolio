(() => {
  const $ = (q, r = document) => r.querySelector(q);
  const $$ = (q, r = document) => [...r.querySelectorAll(q)];
  const root = document.documentElement;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const calmNow = () => root.hasAttribute('data-a11y-calm');

  /* Navbar scroll state */
  const navInner = $('#navbar-inner');
  const onScroll = () => navInner.classList.toggle('scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  const burger = $('#hamburger'), menu = $('#mobile-menu');
  function setMenu(open) {
    burger.classList.toggle('open', open);
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.setAttribute('aria-hidden', String(!open));
    document.body.style.overflow = open ? 'hidden' : '';
  }
  burger.addEventListener('click', () => setMenu(!menu.classList.contains('open')));
  $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  matchMedia('(min-width: 900px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* Scroll reveal (staggered) */
  const items = $$('.reveal, .project-card');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(en => {
      if (!en.isIntersecting) return;
      const t = en.target;
      const delay = t.classList.contains('project-card') ? [...t.parentElement.children].indexOf(t) * 90 : 0;
      setTimeout(() => t.classList.add('visible'), delay);
      io.unobserve(t);
    }), { threshold: 0.12 });
    items.forEach(el => io.observe(el));
  } else {
    items.forEach(el => el.classList.add('visible'));
  }

  /* Graceful image fallback */
  $$('.card-image img, .about-photo-img, .hero-photo-inline img').forEach(img => {
    const fail = () => img.closest('.card-image, .about-photo-card, .hero-photo-inline')?.classList.add('img-missing');
    img.addEventListener('error', fail);
    if (img.complete && img.naturalWidth === 0) fail();
  });

  /* Card tilt (mouse only) */
  if (fine) {
    $$('.project-card').forEach(card => {
      const inner = $('.project-card-inner', card);
      card.addEventListener('pointermove', e => {
        if (calmNow()) return;
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        inner.style.transform = `perspective(900px) rotateY(${x * 5}deg) rotateX(${-y * 3.5}deg)`;
      });
      card.addEventListener('pointerleave', () => { inner.style.transform = ''; });
    });
  }

  /* Hero photo wiggle */
  const photo = $('.hero-photo-inline');
  photo?.addEventListener('click', () => {
    if (calmNow()) return;
    photo.style.transform = 'rotate(10deg) scale(1.14)';
    setTimeout(() => { photo.style.transform = ''; }, 420);
  });

  /* ── Theme (light / dark) ──
     The inline <head> script sets data-theme before first paint (saved choice, else the OS setting).
     This block keeps the button, the browser UI colour and the OS-change listener in sync. */
  const THEME_KEY = 'pj-theme';
  const THEME_COLOURS = { light: '#FBF6EC', dark: '#17140F' };
  const themeBtn = $('#theme-toggle');
  const themeMeta = $('meta[name="theme-color"]');
  const currentTheme = () => (root.dataset.theme === 'dark' ? 'dark' : 'light');
  function paintTheme(t) {
    root.dataset.theme = t;
    if (themeMeta) themeMeta.setAttribute('content', THEME_COLOURS[t]);
    if (themeBtn) themeBtn.setAttribute('aria-pressed', String(t === 'dark'));
  }
  const savedTheme = () => { try { return localStorage.getItem(THEME_KEY); } catch (e) { return null; } };
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = currentTheme() === 'dark' ? 'light' : 'dark';
      root.classList.add('theme-anim');
      paintTheme(next);
      try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
      setTimeout(() => root.classList.remove('theme-anim'), 400);
    });
  }
  matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    if (!savedTheme()) paintTheme(e.matches ? 'dark' : 'light');
  });
  paintTheme(currentTheme());

  /* ── Accessibility widget ── */
  const KEY = 'pj-a11y', flags = ['contrast', 'font', 'calm', 'links', 'space'];
  const panel = $('#a11y-panel'), fab = $('#a11y-fab'), preset = $('#a11y-preset');
  let fontLink;
  const read = () => {
    const s = { text: +(root.dataset.a11yText || 0) };
    flags.forEach(k => { s[k] = root.hasAttribute('data-a11y-' + k); });
    return s;
  };
  function sync() {
    const s = read();
    $$('[data-flag]', panel).forEach(b => b.setAttribute('aria-checked', String(s[b.dataset.flag])));
    $$('[data-text]', panel).forEach(b => b.setAttribute('aria-pressed', String(+b.dataset.text === s.text)));
    preset.setAttribute('aria-checked', String(s.text > 0 && flags.every(k => s[k])));
    if (s.font && !fontLink) {
      fontLink = document.createElement('link');
      fontLink.rel = 'stylesheet';
      fontLink.href = 'https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible:wght@400;700&display=swap';
      document.head.appendChild(fontLink);
    }
  }
  function apply(s) {
    if (s.text) root.dataset.a11yText = s.text; else delete root.dataset.a11yText;
    flags.forEach(k => root.toggleAttribute('data-a11y-' + k, !!s[k]));
    sync();
    try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {}
  }
  function togglePanel(open) {
    panel.hidden = !open;
    fab.setAttribute('aria-expanded', String(open));
    if (open) preset.focus();
  }
  fab.addEventListener('click', () => togglePanel(panel.hidden));
  panel.addEventListener('click', e => {
    const b = e.target.closest('button');
    if (!b) return;
    const s = read();
    if (b.id === 'a11y-preset') {
      const on = b.getAttribute('aria-checked') === 'true';
      flags.forEach(k => { s[k] = !on; });
      s.text = on ? 0 : 1;
    } else if (b.id === 'a11y-reset') {
      flags.forEach(k => { s[k] = false; });
      s.text = 0;
    } else if (b.dataset.flag) {
      s[b.dataset.flag] = !s[b.dataset.flag];
    } else if (b.dataset.text) {
      s.text = +b.dataset.text;
    } else return;
    apply(s);
  });
  document.addEventListener('click', e => { if (!panel.hidden && !e.target.closest('#a11y-widget')) togglePanel(false); });
  addEventListener('keydown', e => {
    if (e.key !== 'Escape') return;
    if (menu.classList.contains('open')) { setMenu(false); burger.focus(); }
    else if (!panel.hidden) { togglePanel(false); fab.focus(); }
  });
  sync();
})();
