/* ============================================================
   ABDAN — script.js  (v2 — fixed)
   All DOM queries wrapped in DOMContentLoaded to prevent
   the null classList errors seen in the console.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ── 1. Navbar scroll behaviour ────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function handleNavbar() {
    if (!navbar) return;
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', handleNavbar, { passive: true });
  handleNavbar();


  /* ── 2. Mobile menu toggle ──────────────────────────────────── */
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      const isOpen = !mobileMenu.classList.contains('hidden');
      if (isOpen) {
        mobileMenu.classList.add('hidden');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      } else {
        mobileMenu.classList.remove('hidden');
        menuBtn.classList.add('open');
        menuBtn.setAttribute('aria-expanded', 'true');
      }
    });

    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ── 3. Scroll-reveal (IntersectionObserver) ────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }


  /* ── 4. Smooth scroll ───────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        const offset = navbar ? navbar.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - offset - 8;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── 5. Hero card parallax tilt ─────────────────────────────── */
  const cardStack = document.querySelector('.card-stack');
  const hero      = document.getElementById('hero');

  if (cardStack && hero && window.matchMedia('(pointer:fine)').matches) {
    hero.addEventListener('mousemove', e => {
      const r  = hero.getBoundingClientRect();
      const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
      const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
      cardStack.style.transform = `perspective(800px) rotateX(${dy * 5}deg) rotateY(${-dx * 5}deg)`;
    });
    hero.addEventListener('mouseleave', () => {
      cardStack.style.transition = 'transform 0.6s ease';
      cardStack.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg)';
      setTimeout(() => { cardStack.style.transition = ''; }, 600);
    });
  }


  /* ── 6. Testimonial stagger ─────────────────────────────────── */
  document.querySelectorAll('.testimonial-card').forEach((card, i) => {
    card.style.transitionDelay = `${i * 0.12}s`;
  });


  /* ── 7. Collection card image hover ─────────────────────────── */
  document.querySelectorAll('.collection-card').forEach(card => {
    const img = card.querySelector('img');
    if (!img) return;
    card.addEventListener('mouseenter', () => {
      img.style.transform  = 'scale(1.07)';
      img.style.transition = 'transform 700ms cubic-bezier(0.25,0.46,0.45,0.94)';
    });
    card.addEventListener('mouseleave', () => {
      img.style.transform = 'scale(1)';
    });
  });


  /* ── 8. WhatsApp bubble pulse ring ──────────────────────────── */
  const waFloating = document.querySelector('a[aria-label="Chat on WhatsApp"]');
  if (waFloating) {
    const ks = document.createElement('style');
    ks.textContent = `
      @keyframes wa-ring {
        0%   { transform:scale(1);   opacity:0.7; }
        80%  { transform:scale(1.5); opacity:0;   }
        100% { transform:scale(1.5); opacity:0;   }
      }`;
    document.head.appendChild(ks);

    const ring = document.createElement('span');
    ring.style.cssText =
      'position:absolute;inset:-4px;border-radius:50%;' +
      'border:2px solid rgba(37,211,102,0.55);' +
      'animation:wa-ring 2.4s ease-out infinite;pointer-events:none;';
    waFloating.style.position = 'relative';
    waFloating.appendChild(ring);
  }


  /* ── 9. Active nav highlight ────────────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightNav() {
    let current = '';
    sections.forEach(sec => {
      if (sec.getBoundingClientRect().top <= 100) current = sec.id;
    });
    navLinks.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      link.style.color = (href === current) ? 'var(--forest)' : '';
    });
  }
  window.addEventListener('scroll', highlightNav, { passive: true });

}); // end DOMContentLoaded
