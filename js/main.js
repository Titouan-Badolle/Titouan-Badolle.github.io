/* ============================================================
   E-PORTFOLIO – Titouan Badolle  |  main.js
   ============================================================ */

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightActiveNav();
});

function highlightActiveNav() {
  const scrollY = window.scrollY + 100;
  sections.forEach(sec => {
    if (scrollY >= sec.offsetTop && scrollY < sec.offsetTop + sec.offsetHeight) {
      navLinks.forEach(l => l.classList.remove('active'));
      const active = document.querySelector(`.nav-link[href="#${sec.id}"]`);
      if (active) active.classList.add('active');
    }
  });
}

/* ---- Mobile nav toggle ---- */
const toggle = document.getElementById('nav-toggle');
const menu   = document.getElementById('nav-menu');
toggle.addEventListener('click', () => {
  toggle.classList.toggle('open');
  menu.classList.toggle('open');
});
navLinks.forEach(l => l.addEventListener('click', () => {
  toggle.classList.remove('open');
  menu.classList.remove('open');
}));

/* ============================================================
   HERO – Animated particle canvas
   ============================================================ */
(function heroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  function initParticles() {
    const count = Math.floor(W * H / 10000);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.5 + .3,
      vx: (Math.random() - .5) * .3,
      vy: (Math.random() - .5) * .3,
      alpha: Math.random() * .5 + .15,
    }));
  }
  initParticles();

  const COLORS = ['99,102,241', '34,211,238', '129,140,248'];

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      const col = COLORS[i % COLORS.length];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${p.alpha})`;
      ctx.fill();

      // draw lines between nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dx = p.x - q.x, dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${col},${(1 - dist / 120) * .12})`;
          ctx.lineWidth = .5;
          ctx.stroke();
        }
      }
    });
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ============================================================
   HERO – Typing effect
   ============================================================ */
(function typingEffect() {
  const el   = document.getElementById('typing-text');
  if (!el) return;
  const texts = [
    'Étudiant en Cybersécurité',
    'Administrateur Réseaux',
    'Développeur d\'Applications',
    'Pentester Junior',
    'BUT RT – 2ème Année',
  ];
  let ti = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 75, SPEED_DEL = 38, PAUSE = 2000;

  function type() {
    const full = texts[ti];
    if (!deleting) {
      el.textContent = full.slice(0, ++ci);
      if (ci === full.length) { deleting = true; return setTimeout(type, PAUSE); }
    } else {
      el.textContent = full.slice(0, --ci);
      if (ci === 0) { deleting = false; ti = (ti + 1) % texts.length; }
    }
    setTimeout(type, deleting ? SPEED_DEL : SPEED_TYPE);
  }
  type();
})();

/* ============================================================
   TABS – Preuves section
   ============================================================ */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const id = btn.dataset.tab;
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const pane = document.getElementById('tab-' + id);
    if (pane) pane.classList.add('active');
  });
});

/* ============================================================
   AOS – Animate on Scroll
   ============================================================ */
(function aos() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: .12 });

  document.querySelectorAll('[data-aos]').forEach((el, i) => {
    el.style.transitionDelay = (i % 5) * 0.08 + 's';
    observer.observe(el);
  });
})();

/* ============================================================
   Progress bars – animated when visible
   ============================================================ */
(function progressBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const bar = e.target;
        bar.style.width = (bar.dataset.p || 0) + '%';
        observer.unobserve(bar);
      }
    });
  }, { threshold: .3 });

  document.querySelectorAll('.progress-bar').forEach(b => observer.observe(b));
})();

/* ============================================================
   Counter animation – hero stats
   ============================================================ */
(function counterAnimation() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el  = e.target;
        const end = parseInt(el.dataset.count, 10);
        const dur = 1200;
        const step = dur / end;
        let cur = 0;
        const interval = setInterval(() => {
          cur++;
          el.textContent = cur;
          if (cur >= end) clearInterval(interval);
        }, step);
        observer.unobserve(el);
      }
    });
  }, { threshold: .5 });

  document.querySelectorAll('.stat-num[data-count]').forEach(el => observer.observe(el));
})();
