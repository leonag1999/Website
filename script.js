/* ============================================
   Guillermo Leon — Author Website
   Smooth Transitions & Interactions
   ============================================ */

(function () {
  'use strict';

  // --- DOM Elements ---
  const nav = document.getElementById('nav');
  const navToggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  const pageTransition = document.getElementById('page-transition');
  const contactForm = document.getElementById('contact-form');
  const allNavLinks = document.querySelectorAll('[data-section]');

  // --- Intersection Observer for fade-in animations ---
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-element').forEach((el) => {
    fadeObserver.observe(el);
  });

  // --- Scroll-based nav styling ---
  let lastScroll = 0;

  function handleScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = scrollY;

    // Update active nav link based on scroll position
    updateActiveSection();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Active section tracking ---
  function updateActiveSection() {
    const sections = document.querySelectorAll('.section');
    const scrollCenter = window.scrollY + window.innerHeight / 3;

    let currentId = 'home';

    sections.forEach((section) => {
      if (section.offsetTop <= scrollCenter) {
        currentId = section.id;
      }
    });

    document.querySelectorAll('.nav-link').forEach((link) => {
      if (link.dataset.section === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --- Smooth navigation with page transition ---
  function navigateToSection(sectionId) {
    const target = document.getElementById(sectionId);
    if (!target) return;

    // Close mobile menu if open
    closeMobileMenu();

    // Animate transition
    pageTransition.classList.remove('animate-out');
    pageTransition.classList.add('animate-in');

    setTimeout(() => {
      // Scroll to target
      const offset = sectionId === 'home' ? 0 : target.offsetTop - nav.offsetHeight;
      window.scrollTo({ top: offset, behavior: 'instant' });

      // Animate out
      pageTransition.classList.remove('animate-in');
      pageTransition.classList.add('animate-out');

      setTimeout(() => {
        pageTransition.classList.remove('animate-out');
      }, 500);
    }, 450);
  }

  // Attach click handlers to all navigation links
  allNavLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = link.dataset.section;
      navigateToSection(sectionId);
    });
  });

  // --- Mobile Menu ---
  function openMobileMenu() {
    navToggle.classList.add('open');
    mobileMenu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    navToggle.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  navToggle.addEventListener('click', () => {
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // --- Contact Form ---
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactForm.querySelector('.form-submit');
    const originalText = btn.querySelector('span').textContent;

    btn.querySelector('span').textContent = 'Sent!';
    btn.style.borderColor = 'var(--color-accent)';
    btn.style.color = 'var(--color-accent)';

    setTimeout(() => {
      btn.querySelector('span').textContent = originalText;
      btn.style.borderColor = '';
      btn.style.color = '';
      contactForm.reset();
    }, 2000);
  });

  // --- Initial load animation ---
  window.addEventListener('load', () => {
    // Trigger hero animations on load
    const heroElements = document.querySelectorAll('.section--hero .fade-element');
    heroElements.forEach((el, i) => {
      setTimeout(() => {
        el.classList.add('visible');
      }, 300 + i * 120);
    });
  });
})();
