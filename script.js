(() => {
  const header = document.querySelector('[data-header]');
  const progress = document.querySelector('[data-progress]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  const packet = document.querySelector('[data-packet]');
  const year = document.querySelector('[data-year]');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (year) year.textContent = String(new Date().getFullYear());

  const closeMenu = () => {
    if (!menuToggle || !nav) return;
    menuToggle.setAttribute('aria-expanded', 'false');
    nav.classList.remove('open');
    document.body.classList.remove('menu-open');
  };

  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => {
      const nextOpen = menuToggle.getAttribute('aria-expanded') !== 'true';
      menuToggle.setAttribute('aria-expanded', String(nextOpen));
      nav.classList.toggle('open', nextOpen);
      document.body.classList.toggle('menu-open', nextOpen);
    });

    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
    window.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  const updateScroll = () => {
    const y = window.scrollY;
    header?.classList.toggle('scrolled', y > 18);

    if (progress) {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const value = max > 0 ? Math.min(100, Math.max(0, (y / max) * 100)) : 0;
      progress.style.width = `${value}%`;
    }
  };

  updateScroll();
  window.addEventListener('scroll', updateScroll, { passive: true });
  window.addEventListener('resize', updateScroll, { passive: true });

  const reveals = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -7% 0px' });

    reveals.forEach((element) => revealObserver.observe(element));
  } else {
    reveals.forEach((element) => element.classList.add('visible'));
  }

  const navLinks = [...document.querySelectorAll('.nav a[href^="#"]')];
  const targets = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && targets.length) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) return;
      navLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${visible.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { rootMargin: '-28% 0px -58% 0px', threshold: [0, .15, .4] });

    targets.forEach((section) => sectionObserver.observe(section));
  }

  if (packet && !prefersReduced) {
    let value = 42;
    window.setInterval(() => {
      value += Math.floor(Math.random() * 7) + 1;
      if (value > 9999) value = 1;
      packet.textContent = String(value).padStart(4, '0');
    }, 1250);
  }
})();
