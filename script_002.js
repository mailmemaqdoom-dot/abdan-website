/* ============================================================
   ABDAN — script_002.js
   Serial: 002
   All DOM operations inside DOMContentLoaded.
   ============================================================ */

document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  /* ── 1. LOGO FALLBACK ───────────────────────────────────── */
  document.querySelectorAll('img[onerror]').forEach(function (img) {
    // onerror handlers already in HTML; this is just a safety net
    img.addEventListener('error', function () {
      this.style.opacity = '0';
    });
  });


  /* ── 2. NAVBAR SCROLL STATE ─────────────────────────────── */
  var navbar = document.getElementById('navbar');
  function syncNavbar () {
    if (!navbar) return;
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', syncNavbar, { passive: true });
  syncNavbar();


  /* ── 3. MOBILE MENU ─────────────────────────────────────── */
  var menuBtn    = document.getElementById('menu-btn');
  var mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('hidden') === false;
      this.classList.toggle('open', open);
      this.setAttribute('aria-expanded', String(open));
    });
    mobileMenu.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.add('hidden');
        menuBtn.classList.remove('open');
        menuBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }


  /* ── 4. SMOOTH SCROLL ───────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = this.getAttribute('href');
      if (!id || id === '#') return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      var offset = navbar ? navbar.offsetHeight : 0;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset - 10,
        behavior: 'smooth'
      });
    });
  });


  /* ── 5. HERO STAGGERED TEXT ANIMATION ───────────────────── */
  // Each element gets a CSS animation applied via JS to guarantee
  // it fires only after DOMContentLoaded (never on null elements)
  var heroItems = [
    { sel: '.hero-greeting',  delay: 0.18, dur: 0.7  },
    { sel: '.hero-l-1',       delay: 0.38, dur: 0.75 },
    { sel: '.hero-l-2',       delay: 0.54, dur: 0.7  },
    { sel: '.hero-l-3',       delay: 0.68, dur: 0.7  },
    { sel: '.hero-l-4',       delay: 0.82, dur: 0.7  },
    { sel: '.hero-l-5',       delay: 0.98, dur: 0.8  },
    { sel: '.hero-brand',     delay: 1.18, dur: 0.75 },
    { sel: '.hero-sub',       delay: 1.34, dur: 0.7  },
    { sel: '.hero-ctas',      delay: 1.50, dur: 0.7  },
    { sel: '.hero-trust',     delay: 1.65, dur: 0.65 },
    { sel: '.hero-visual',    delay: 0.45, dur: 0.95 },
    { sel: '.scroll-cue',     delay: 2.00, dur: 0.6  },
  ];

  heroItems.forEach(function (item) {
    var el = document.querySelector(item.sel);
    if (!el) return;
    el.style.animation =
      'fadeUp ' + item.dur + 's cubic-bezier(0.25,0.46,0.45,0.94) ' + item.delay + 's forwards';
  });


  /* ── 6. INTERSECTION OBSERVER — SCROLL REVEAL ───────────── */
  var revealEls = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && revealEls.length) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -36px 0px' });

    revealEls.forEach(function (el) { obs.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }


  /* ── 7. CARD STACK PARALLAX TILT (desktop only) ─────────── */
  var cardStack = document.querySelector('.card-stack');
  var heroSec   = document.getElementById('hero');

  if (cardStack && heroSec && window.matchMedia('(pointer:fine)').matches) {
    var tiltLive = false;
    heroSec.addEventListener('mousemove', function (e) {
      var r  = heroSec.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width  * 0.5)) / (r.width  * 0.5);
      var dy = (e.clientY - (r.top  + r.height * 0.5)) / (r.height * 0.5);
      if (!tiltLive) { cardStack.style.transition = 'none'; tiltLive = true; }
      cardStack.style.transform =
        'perspective(900px) rotateX(' + (dy * 4) + 'deg) rotateY(' + (-dx * 4) + 'deg)';
    });
    heroSec.addEventListener('mouseleave', function () {
      tiltLive = false;
      cardStack.style.transition = 'transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)';
      cardStack.style.transform  = 'perspective(900px) rotateX(0deg) rotateY(0deg)';
    });
  }


  /* ── 8. LOGO SHOWCASE — gentle 3D tilt on hover ─────────── */
  var logoShowcase = document.querySelector('.logo-showcase');
  if (logoShowcase && window.matchMedia('(pointer:fine)').matches) {
    logoShowcase.addEventListener('mousemove', function (e) {
      var r  = this.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width  * 0.5)) / (r.width  * 0.5);
      var dy = (e.clientY - (r.top  + r.height * 0.5)) / (r.height * 0.5);
      this.style.transform =
        'perspective(600px) rotateX(' + (-dy * 8) + 'deg) rotateY(' + (dx * 8) + 'deg) scale(1.03)';
      this.style.transition = 'none';
    });
    logoShowcase.addEventListener('mouseleave', function () {
      this.style.transition = 'transform 0.6s cubic-bezier(0.25,0.46,0.45,0.94)';
      this.style.transform  = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }


  /* ── 9. ACTIVE NAV LINK ──────────────────────────────────── */
  var sections = document.querySelectorAll('section[id]');
  var navLinks = document.querySelectorAll('.nav-lnk');

  function syncActiveNav () {
    var current = '';
    sections.forEach(function (sec) {
      if (sec.getBoundingClientRect().top <= 100) current = sec.id;
    });
    navLinks.forEach(function (lnk) {
      var href = lnk.getAttribute('href').replace('#','');
      lnk.style.color      = (href === current) ? 'var(--forest)' : '';
      lnk.style.fontWeight = (href === current) ? '600' : '';
    });
  }
  window.addEventListener('scroll', syncActiveNav, { passive: true });


  /* ── 10. BUTTON RIPPLE EFFECT ────────────────────────────── */
  document.querySelectorAll('.cta-primary, .prod-cta, .community-cta-btn, .wa-preview-btn, .wa-cta-btn').forEach(function (btn) {
    btn.style.position = 'relative';
    btn.style.overflow = 'hidden';

    btn.addEventListener('click', function (e) {
      var ripple = document.createElement('span');
      var rect   = this.getBoundingClientRect();
      var size   = Math.max(rect.width, rect.height);
      ripple.style.cssText =
        'position:absolute;border-radius:50%;background:rgba(255,255,255,0.25);' +
        'width:' + size + 'px;height:' + size + 'px;' +
        'left:' + (e.clientX - rect.left - size/2) + 'px;' +
        'top:'  + (e.clientY - rect.top  - size/2) + 'px;' +
        'transform:scale(0);animation:rippleAnim 0.55s ease-out forwards;pointer-events:none;';
      this.appendChild(ripple);
      setTimeout(function () { if (ripple.parentNode) ripple.parentNode.removeChild(ripple); }, 600);
    });
  });

  // Inject ripple keyframes once
  if (!document.getElementById('ripple-style')) {
    var ks = document.createElement('style');
    ks.id  = 'ripple-style';
    ks.textContent = '@keyframes rippleAnim { to { transform:scale(2.5); opacity:0; } }';
    document.head.appendChild(ks);
  }


  /* ── 11. REDUCED MOTION ─────────────────────────────────── */
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.querySelectorAll(
      '.hero-greeting,.hero-l-1,.hero-l-2,.hero-l-3,.hero-l-4,.hero-l-5,' +
      '.hero-brand,.hero-sub,.hero-ctas,.hero-trust,.hero-visual,.scroll-cue'
    ).forEach(function (el) {
      el.style.animation = 'none';
      el.style.opacity   = '1';
      el.style.transform = 'none';
    });
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

}); // end DOMContentLoaded
