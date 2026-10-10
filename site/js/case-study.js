/* Case study pages: side stepper (active section + smooth jump) and reveal-on-scroll.
   Shared behaviour (nav, menu, accessibility panel) lives in js/site.js. */
(() => {
  const $$ = (q, r = document) => [...r.querySelectorAll(q)];
  const calm = () => document.documentElement.hasAttribute('data-a11y-calm') || matchMedia('(prefers-reduced-motion: reduce)').matches;

  const items = $$('.stepper-item');
  if (items.length) {
    const sections = items.map(i => document.getElementById(i.dataset.section));
    const setActive = id => items.forEach(i => {
      const on = i.dataset.section === id;
      i.classList.toggle('active', on);
      if (on) i.setAttribute('aria-current', 'true'); else i.removeAttribute('aria-current');
    });
    const current = () => {
      const mid = innerHeight * 0.4;
      let cur = sections[0];
      sections.forEach(s => { if (s && s.getBoundingClientRect().top <= mid) cur = s; });
      return cur && cur.id;
    };
    let queued = false;
    addEventListener('scroll', () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => { setActive(current()); queued = false; });
    }, { passive: true });
    items.forEach(i => i.addEventListener('click', () => {
      const t = document.getElementById(i.dataset.section);
      if (t) t.scrollIntoView({ behavior: calm() ? 'auto' : 'smooth', block: 'start' });
    }));
    setActive(current());

    /* Stop the stepper above the contact block: once the (dark beige) contact
       section scrolls up to the stepper's bottom edge, the stepper rides up with it. */
    const stepper = document.getElementById('side-stepper');
    const contact = document.getElementById('contact');
    if (stepper && contact) {
      let pushQueued = false;
      const place = () => {
        const h = stepper.offsetHeight;
        const naturalBottom = innerHeight / 2 + h / 2;
        const limit = contact.getBoundingClientRect().top - 24;
        stepper.style.setProperty('--push', Math.min(0, limit - naturalBottom) + 'px');
        pushQueued = false;
      };
      const queuePlace = () => { if (!pushQueued) { pushQueued = true; requestAnimationFrame(place); } };
      addEventListener('scroll', queuePlace, { passive: true });
      addEventListener('resize', queuePlace);
      place();
    }
  }

  const targets = $$('.appear');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -8% 0px' });
    targets.forEach(t => io.observe(t));
  } else {
    targets.forEach(t => t.classList.add('visible'));
  }
})();
