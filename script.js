/* ============================================================
   ABDAN — script.js  v3
   • All DOM ops inside DOMContentLoaded (no classList null errors)
   • Hero staggered text animation
   • IntersectionObserver scroll reveal
   • Navbar scroll state
   • Mobile menu
   • Card parallax tilt
   • Logo fallback
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ────────────────────────────────────────────────────────
     1. LOGO FALLBACK
  ─────────────────────────────────────────────────────── */
  const navLogo = document.getElementById('nav-logo');
  if (navLogo) {
    navLogo.addEventListener('error', function () {
      this.style.display = 'none';
      const fb = document.getElementById('nav-logo-fallback');
      if (fb) fb.style.display = 'flex';
    });
  }

  /* ────────────────────────────────────────────────────────
     2. NAVBAR SCROLL BEHAVIOUR
  ─────────────────────────────────────────────────────── */
  const navbar = document.getElementById('navbar');

  function syncNavbar () {
    if (!navbar) return;
    if (window.scrollY > 64) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }
  window.addEventListener('scroll', syncNavbar, { passive: true });
  syncNavbar(); // initial call


  /* ────────────────────────────────────────────────────────
     3. MOBILE MENU
  ─────────────────────────────────────────────────────── */
  const menuBtn    = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      const open = mobileMenu.classList.toggle('hidden') === false;
      this.classList.toggle('open', open);
      this.setAttribute('aria-expanded', String(open));
    });

    // Close on nav link click
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ────────────────────────────────────────────────────────
     4. SMOOTH SCROLL
  ─────────────────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const id = this.getAttribute('href');
      if (!id || id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = navbar ? navbar.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - offset - 10;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });


  /* ────────────────────────────────────────────────────────
     5. HERO STAGGERED TEXT ANIMATION
     Each line/element fades up with a staggered delay
  ─────────────────────────────────────────────────────── */
  const heroAnimItems = [
    { selector: '.hero-label',   delay: 0.15,  duration: 0.7 },
    { selector: '.hero-line:nth-child(1)', delay: 0.35, duration: 0.75 },
    { selector: '.hero-line:nth-child(2)', delay: 0.50, duration: 0.75 },
    { selector: '.hero-line:nth-child(3)', delay: 0.65, duration: 0.75 },
    { selector: '.hero-line:nth-child(4)', delay: 0.80, duration: 0.75 },
    { selector: '.hero-brand',   delay: 0.95,  duration: 0.7 },
    { selector: '.hero-sub',     delay: 1.10,  duration: 0.7 },
    { selector: '.hero-ctas',    delay: 1.25,  duration: 0.7 },
    { selector: '.hero-trust',   delay: 1.40,  duration: 0.7 },
    { selector: '.hero-visual',  delay: 0.40,  duration: 0.9 },
    { selector: '.scroll-cue',   delay: 1.80,  duration: 0.6 },
  ];

  heroAnimItems.forEach(function (item) {
    const el = document.querySelector(item.selector);
    if (!el) return;
    // Already starts opacity:0 via CSS
    el.style.animation =
      'fadeUp ' + item.duration + 's cubic-bezier(0.25,0.46,0.45,0.94) ' + item.delay + 's forwards';
  });


  /* ────────────────────────────────────────────────────────
     6. SCROLL REVEAL — IntersectionObserver
  ─────────────────────────────────────────────────────── */
  const revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var revealObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) { revealObs.observe(el); });
  } else {
    // Fallback: show all immediately
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ────────────────────────────────────────────────────────
     7. HERO CARD — subtle parallax tilt on desktop
  ─────────────────────────────────────────────────────── */
  var cardStack = document.querySelector('.card-stack');
  var heroSec   = document.getElementById('hero');

  if (cardStack && heroSec && window.matchMedia('(pointer: fine)').matches) {
    var tiltActive = false;

    heroSec.addEventListener('mousemove', function (e) {
      var r  = heroSec.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width  * 0.5)) / (r.width  * 0.5);
      var dy = (e.clientY - (r.top  + r.height * 0.5)) / (r.height * 0.5);
      if (!tiltActive) {
        cardStack.style.transition = 'none';
        tiltActive = true;
      }
      cardStack.style.transform =
        'perspective(900px) rotateX(' + (dy * 4) + 'deg) rotateY(' + (-dx * 4) + 'deg)';
    });

    heroSec.addEventListener('mouseleave', function () {
      tiltActive = false;
      cardStack.style.transition = 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)';
      cardStack.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  }


  /* ────────────────────────────────────────────────────────
     8. TESTIMONIAL STAGGER
  ─────────────────────────────────────────────────────── */
  document.querySelectorAll('.testi-card').forEach(function (card, i) {
    card.style.transitionDelay = (i * 0.12) + 's';
  });


  /* ────────────────────────────────────────────────────────
     9. ACTIVE NAV LINK HIGHLIGHTING
  ─────────────────────────────────────────────────────── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-link');

  function syncActiveNav () {
    var current = '';
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= 110) current = sec.id;
    });
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href').replace('#', '');
      link.style.color = (href === current) ? 'var(--forest)' : '';
      link.style.fontWeight = (href === current) ? '600' : '';
    });
  }
  window.addEventListener('scroll', syncActiveNav, { passive: true });


  /* ────────────────────────────────────────────────────────
     10. COLLECTION CARD — explicit image zoom for Safari
  ─────────────────────────────────────────────────────── */
  document.querySelectorAll('.col-card').forEach(function (card) {
    var img = card.querySelector('.col-card-img');
    if (!img) return;
    card.addEventListener('mouseenter', function () {
      img.style.transform  = 'scale(1.06)';
      img.style.transition = 'transform 700ms cubic-bezier(0.25,0.46,0.45,0.94)';
    });
    card.addEventListener('mouseleave', function () {
      img.style.transform = 'scale(1)';
    });
  });


  /* ────────────────────────────────────────────────────────
     11. WOMEN CARD — explicit image zoom for Safari
  ─────────────────────────────────────────────────────── */
  document.querySelectorAll('.woman-card').forEach(function (card) {
    var img = card.querySelector('.woman-card-img');
    if (!img) return;
    card.addEventListener('mouseenter', function () {
      img.style.transform  = 'scale(1.05)';
      img.style.transition = 'transform 700ms cubic-bezier(0.25,0.46,0.45,0.94)';
    });
    card.addEventListener('mouseleave', function () {
      img.style.transform = 'scale(1)';
    });
  });


  /* ────────────────────────────────────────────────────────
     12. REDUCED MOTION RESPECT
  ─────────────────────────────────────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    // Show hero elements instantly
    document.querySelectorAll(
      '.hero-label,.hero-line,.hero-brand,.hero-sub,.hero-ctas,.hero-trust,.hero-visual,.scroll-cue'
    ).forEach(function (el) {
      el.style.animation = 'none';
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
    // Show all reveal elements instantly
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

}); // ── end DOMContentLoaded ──
