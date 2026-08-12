(() => {
  const header = document.querySelector('[data-header]');
  const latency = document.querySelector('[data-latency]');
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const onScroll = () => header?.classList.toggle('scrolled', window.scrollY > 20);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !prefersReduced) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });

    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 55}ms`;
      observer.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  if (latency && !prefersReduced) {
    let value = 28;
    window.setInterval(() => {
      value += Math.round((Math.random() - .5) * 10);
      value = Math.max(9, Math.min(89, value));
      latency.textContent = String(value).padStart(3, '0');
    }, 950);
  }
})();
