(() => {
  const header = document.querySelector('[data-header]');
  const latency = document.querySelector('[data-latency]');
  const canvas = document.querySelector('[data-network]');
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
    }, { threshold: 0.1, rootMargin: '0px 0px -4% 0px' });
    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i % 4, 3) * 55}ms`;
      observer.observe(el);
    });
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  if (latency && !prefersReduced) {
    let value = 28;
    setInterval(() => {
      value += Math.round((Math.random() - .5) * 14);
      value = Math.max(9, Math.min(89, value));
      latency.textContent = String(value).padStart(3, '0');
    }, 850);
  }

  if (!canvas || prefersReduced) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1, raf;
  let pointer = { x: -1000, y: -1000 };
  let nodes = [];

  const makeNodes = () => {
    const count = Math.max(18, Math.min(42, Math.floor(w / 45)));
    nodes = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - .5) * .18,
      vy: (Math.random() - .5) * .18,
      r: i % 7 === 0 ? 2.2 : 1.2,
      signal: i % 9 === 0
    }));
  };

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    w = rect.width; h = rect.height;
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeNodes();
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      n.x += n.vx; n.y += n.vy;
      if (n.x < -20) n.x = w + 20;
      if (n.x > w + 20) n.x = -20;
      if (n.y < -20) n.y = h + 20;
      if (n.y > h + 20) n.y = -20;
      const pdx = n.x - pointer.x, pdy = n.y - pointer.y;
      const pDist = Math.hypot(pdx, pdy);
      if (pDist < 140 && pDist > 0) {
        n.x += (pdx / pDist) * .35;
        n.y += (pdy / pDist) * .35;
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 165) {
          const alpha = (1 - dist / 165) * .24;
          ctx.strokeStyle = `rgba(240,239,232,${alpha})`;
          ctx.lineWidth = .7;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.signal ? 'rgba(199,255,26,.9)' : 'rgba(240,239,232,.55)';
      ctx.fill();
    }
    raf = requestAnimationFrame(draw);
  };

  canvas.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    pointer.x = e.clientX - rect.left;
    pointer.y = e.clientY - rect.top;
  });
  canvas.addEventListener('pointerleave', () => { pointer = { x: -1000, y: -1000 }; });
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });

  resize();
  draw();
})();
