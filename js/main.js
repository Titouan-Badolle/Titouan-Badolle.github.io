/* ============================================================
   E-PORTFOLIO – Titouan Badolle  |  main.js
   ============================================================ */

/* ============================================================
   PRELOADER
   ============================================================ */
(function preloader() {
  const el   = document.getElementById('preloader');
  const fill = document.getElementById('preloader-fill');
  const pct  = document.getElementById('preloader-percent');
  const stat = document.getElementById('preloader-status');
  if (!el) return;

  const messages = [
    'Chargement des modules...',
    'Initialisation du réseau...',
    'Vérification des certificats...',
    'Déploiement des composants...',
    'Portfolio prêt.',
  ];

  let progress = 0;
  const target = 100;
  const step   = 1.8;
  let msgIdx   = 0;

  const interval = setInterval(() => {
    progress = Math.min(progress + step + Math.random() * step, target);
    fill.style.width = progress + '%';
    pct.textContent  = Math.floor(progress) + '%';

    const newMsgIdx = Math.floor((progress / 100) * messages.length);
    if (newMsgIdx !== msgIdx && newMsgIdx < messages.length) {
      msgIdx = newMsgIdx;
      stat.textContent = messages[msgIdx];
    }

    if (progress >= target) {
      clearInterval(interval);
      fill.style.width = '100%';
      pct.textContent  = '100%';
      setTimeout(() => {
        el.classList.add('done');
        document.querySelector('.floating-social')?.classList.add('visible');
      }, 420);
    }
  }, 28);
})();

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function customCursor() {
  const ring = document.getElementById('cursor-ring');
  const dot  = document.getElementById('cursor-dot');
  if (!ring || !dot) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = mouseX + 'px';
    dot.style.top  = mouseY + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    ringX += (mouseX - ringX) * 0.13;
    ringY += (mouseY - ringY) * 0.13;
    ring.style.left = ringX + 'px';
    ring.style.top  = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .tab-btn, .comp-card, .contact-card, .tool-item, .cert-card, label, input, textarea, .gibbs-card, .proof-card, .tl-content';
  document.querySelectorAll(hoverTargets).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  document.addEventListener('mousedown', () => document.body.classList.add('cursor-click'));
  document.addEventListener('mouseup',   () => document.body.classList.remove('cursor-click'));

  // Hide when leaving window
  document.addEventListener('mouseleave', () => { ring.style.opacity = '0'; dot.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { ring.style.opacity = '1'; dot.style.opacity = '1'; });
})();

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
(function scrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (scrolled / total * 100) + '%';
  });
})();

/* ============================================================
   NAVBAR – scroll + active link
   ============================================================ */
const navbar   = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  highlightActiveNav();
  updateBackToTop();
});

function highlightActiveNav() {
  const scrollY = window.scrollY + 120;
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
   BACK TO TOP
   ============================================================ */
const bttBtn = document.getElementById('back-to-top');

function updateBackToTop() {
  bttBtn?.classList.toggle('visible', window.scrollY > 400);
}

bttBtn?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ============================================================
   HERO – Animated particle canvas
   ============================================================ */
(function heroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles;
  let mouseX = -1000, mouseY = -1000;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', () => { resize(); initParticles(); });

  // Track mouse for interaction
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX; mouseY = e.clientY;
  });

  function initParticles() {
    const count = Math.floor(W * H / 9000);
    particles = Array.from({ length: Math.min(count, 120) }, () => ({
      x:     Math.random() * W,
      y:     Math.random() * H,
      r:     Math.random() * 1.8 + .3,
      vx:    (Math.random() - .5) * .35,
      vy:    (Math.random() - .5) * .35,
      alpha: Math.random() * .5 + .15,
    }));
  }
  initParticles();

  const COLORS = ['99,102,241', '34,211,238', '129,140,248', '168,85,247'];

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      // Mouse repulsion
      const dx = p.x - mouseX, dy = p.y - mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 100) {
        const force = (100 - dist) / 100 * .8;
        p.vx += (dx / dist) * force * .4;
        p.vy += (dy / dist) * force * .4;
      }

      // Damping
      p.vx *= .995; p.vy *= .995;

      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;

      const col = COLORS[i % COLORS.length];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},${p.alpha})`;
      ctx.fill();

      // Lines between nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const ddx = p.x - q.x, ddy = p.y - q.y;
        const d = Math.sqrt(ddx * ddx + ddy * ddy);
        if (d < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${col},${(1 - d / 130) * .12})`;
          ctx.lineWidth = .6;
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
  const el = document.getElementById('typing-text');
  if (!el) return;
  const texts = [
    'Étudiant en Cybersécurité',
    'Administrateur Réseaux',
    'Développeur d\'Applications',
    'Pentester Junior',
    'BUT RT – 2ème Année',
    'Passionné par la Sécurité',
  ];
  let ti = 0, ci = 0, deleting = false;
  const SPEED_TYPE = 75, SPEED_DEL = 35, PAUSE = 2200;

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
  }, { threshold: .1 });

  document.querySelectorAll('[data-aos]').forEach((el, i) => {
    el.style.transitionDelay = (i % 6) * 0.07 + 's';
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
        setTimeout(() => { bar.style.width = (bar.dataset.p || 0) + '%'; }, 200);
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
        const dur = 1400;
        const step = dur / end;
        let cur = 0;
        const interval = setInterval(() => {
          cur++;
          el.textContent = cur;
          if (cur >= end) { el.textContent = end; clearInterval(interval); }
        }, step);
        observer.unobserve(el);
      }
    });
  }, { threshold: .5 });

  document.querySelectorAll('.stat-num[data-count]').forEach(el => observer.observe(el));
})();

/* ============================================================
   3D TILT CARDS
   ============================================================ */
(function tiltCards() {
  const cards = document.querySelectorAll('.tilt-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width  / 2;
      const cy = rect.top  + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width  / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      card.style.transform = `perspective(800px) rotateY(${dx * 5}deg) rotateX(${-dy * 5}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();

/* ============================================================
   VIDEO MODAL
   ============================================================ */
(function videoModal() {
  const modal    = document.getElementById('vid-modal');
  const bg       = document.getElementById('vid-modal-bg');
  const closeBtn = document.getElementById('vid-modal-close');
  const player   = document.getElementById('vid-modal-player');
  const srcEl    = document.getElementById('vid-modal-src');
  const titleEl  = document.getElementById('vid-modal-title-text');
  if (!modal) return;

  function openModal(videoSrc, videoTitle) {
    srcEl.src = videoSrc;
    player.load();
    titleEl.textContent = videoTitle || '';
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    player.play().catch(() => {});
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    player.pause();
    player.currentTime = 0;
    srcEl.src = '';
    document.body.style.overflow = '';
  }

  document.querySelectorAll('[data-modal-video]').forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      openModal(el.dataset.modalVideo, el.dataset.modalTitle);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  bg.addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
  });
})();

/* ============================================================
   TOAST NOTIFICATION
   ============================================================ */
function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const msg   = document.getElementById('toast-msg');
  if (!toast || !msg) return;
  msg.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), duration);
}

/* CV download toast */
const cvBtn = document.getElementById('cv-download-btn');
if (cvBtn) {
  cvBtn.addEventListener('click', () => {
    setTimeout(() => showToast('CV téléchargé !'), 500);
  });
}

/* ============================================================
   CONTACT FORM – EmailJS
   Pour activer : créer un compte sur emailjs.com, ajouter un
   service Gmail, créer un template, puis renseigner les 3
   constantes ci-dessous.
   ============================================================ */
const EMAILJS_PUBLIC_KEY  = 'nXoeZdoDgQAU62ohd';
const EMAILJS_SERVICE_ID  = 'service_yxclt3g';
const EMAILJS_TEMPLATE_ID = 'template_5f08coc';

// Template variables: {{name}}, {{email}}, {{title}}, {{message}}, {{time}}

(function initEmailJS() {
  if (typeof window.emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'VOTRE_CLE_PUBLIQUE') {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }
})();

const contactForm       = document.getElementById('contact-form');
const contactSubmit     = document.getElementById('contact-submit');
const contactSubmitIcon = document.getElementById('contact-submit-icon');
const contactSubmitText = document.getElementById('contact-submit-text');
const formNote          = document.getElementById('form-note');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('cf-name')?.value.trim()    || '';
    const email   = document.getElementById('cf-email')?.value.trim()   || '';
    const subject = document.getElementById('cf-subject')?.value.trim() || 'Contact depuis Portfolio';
    const message = document.getElementById('cf-message')?.value.trim() || '';

    // Validation basique
    if (!name || !email || !message) {
      showToast('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    // EmailJS configuré → envoi réel
    if (typeof window.emailjs !== 'undefined' && EMAILJS_PUBLIC_KEY !== 'VOTRE_CLE_PUBLIQUE') {
      contactSubmit.disabled = true;
      contactSubmitIcon.className = 'fas fa-spinner fa-spin';
      contactSubmitText.textContent = ' Envoi en cours...';

      const now = new Date().toLocaleString('fr-FR', { dateStyle: 'long', timeStyle: 'short' });
      window.emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        name:    name,
        email:   email,
        title:   subject,
        message: message,
        time:    now,
      })
      .then(() => {
        showToast('Message envoyé avec succès !');
        contactForm.reset();
        if (formNote) {
          formNote.textContent = '✓ Message bien reçu, je vous répondrai rapidement !';
          formNote.style.color = 'var(--green)';
        }
      })
      .catch((err) => {
        console.error('EmailJS error:', err);
        showToast('Erreur d\'envoi — ouverture du client email en secours...');
        _mailtoFallback(name, email, subject, message);
      })
      .finally(() => {
        contactSubmit.disabled = false;
        contactSubmitIcon.className = 'fas fa-paper-plane';
        contactSubmitText.textContent = ' Envoyer le message';
      });

    } else {
      // Fallback mailto si EmailJS non configuré
      _mailtoFallback(name, email, subject, message);
      showToast('Client email ouvert (EmailJS non configuré).');
    }
  });
}

function _mailtoFallback(name, email, subject, message) {
  const body = encodeURIComponent(
    `Bonjour Titouan,\n\nNom : ${name}\nEmail : ${email}\n\n${message}`
  );
  window.open(`mailto:badolletitouanpro@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`, '_blank');
}

/* ============================================================
   GIBBS – Highlight card on pentagon click
   ============================================================ */
document.querySelectorAll('.g-step-circle').forEach(circle => {
  circle.addEventListener('click', () => {
    const step = circle.dataset.step;
    const card = document.querySelector(`.gibbs-card[data-step="${step}"]`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.style.boxShadow = '0 0 0 2px var(--primary)';
      setTimeout(() => card.style.boxShadow = '', 1800);
    }
  });
});

/* ============================================================
   SMOOTH SCROLL – offset for fixed navbar
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top    = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ============================================================
   FLOATING SOCIAL – show after preloader
   ============================================================ */
setTimeout(() => {
  document.querySelector('.floating-social')?.classList.add('visible');
}, 2500);
