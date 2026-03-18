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

  // --- Content Loading ---
  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  function loadWriting() {
    fetch('content/writing.json')
      .then(function (res) { return res.json(); })
      .then(function (items) {
        const grid = document.getElementById('writing-grid');
        if (!grid) return;
        grid.innerHTML = items.map(function (item) {
          var linkHtml = item.link
            ? '<a href="' + escapeHtml(item.link) + '" class="writing-card-link">Read More &rarr;</a>'
            : '<span class="writing-card-link">Read More &rarr;</span>';
          return '<article class="writing-card fade-element">' +
            '<span class="writing-card-category">' + escapeHtml(item.category) + '</span>' +
            '<h3 class="writing-card-title">' + escapeHtml(item.title) + '</h3>' +
            '<p class="writing-card-excerpt">' + escapeHtml(item.excerpt) + '</p>' +
            '<div class="writing-card-meta">' +
              '<span>' + escapeHtml(item.year) + '</span>' +
              linkHtml +
            '</div>' +
          '</article>';
        }).join('');
        observeNewElements(grid);
      });
  }

  function loadAbout() {
    fetch('content/about.json')
      .then(function (res) { return res.json(); })
      .then(function (data) {
        var layout = document.getElementById('about-layout');
        if (!layout) return;

        var imageHtml;
        if (data.image) {
          imageHtml = '<div class="about-image-wrapper fade-element">' +
            '<div class="about-image">' +
              '<img src="' + escapeHtml(data.image) + '" alt="Guillermo Leon">' +
            '</div>' +
          '</div>';
        } else {
          imageHtml = '<div class="about-image-wrapper fade-element">' +
            '<div class="about-image">' +
              '<div class="about-image-placeholder"><span>GL</span></div>' +
            '</div>' +
          '</div>';
        }

        var paragraphs = data.paragraphs.map(function (p) {
          return '<p class="about-paragraph fade-element">' + escapeHtml(p) + '</p>';
        }).join('');

        var details = data.details.map(function (d) {
          return '<div class="about-detail">' +
            '<span class="about-detail-label">' + escapeHtml(d.label) + '</span>' +
            '<span class="about-detail-value">' + escapeHtml(d.value) + '</span>' +
          '</div>';
        }).join('');

        layout.innerHTML = imageHtml +
          '<div class="about-text">' +
            paragraphs +
            '<div class="about-details fade-element">' + details + '</div>' +
          '</div>';

        observeNewElements(layout);
      });
  }

  function loadPhotos() {
    fetch('content/photos.json')
      .then(function (res) { return res.json(); })
      .then(function (photos) {
        var grid = document.getElementById('photo-grid');
        if (!grid) return;

        grid.innerHTML = photos.map(function (photo) {
          var layoutClass = '';
          if (photo.layout === 'tall') layoutClass = ' photo-item--tall';
          if (photo.layout === 'wide') layoutClass = ' photo-item--wide';

          var innerHtml;
          if (photo.src) {
            innerHtml = '<img src="' + escapeHtml(photo.src) + '" alt="' + escapeHtml(photo.title) + '">' +
              '<div class="photo-overlay">' +
                '<span>' + escapeHtml(photo.title) + '<br><small>' + escapeHtml(photo.series) + '</small></span>' +
              '</div>';
          } else {
            var hue = Math.floor(Math.random() * 360);
            innerHtml = '<div class="photo-placeholder" style="--hue: ' + hue + '; --sat: 15%; --light: 70%;">' +
              '<span>' + escapeHtml(photo.title) + '<br><small>' + escapeHtml(photo.series) + '</small></span>' +
            '</div>';
          }

          return '<div class="photo-item' + layoutClass + ' fade-element">' + innerHtml + '</div>';
        }).join('');

        observeNewElements(grid);
      });
  }

  // --- Intersection Observer for fade-in animations ---
  var observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px'
  };

  var fadeObserver = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  function observeNewElements(container) {
    container.querySelectorAll('.fade-element').forEach(function (el) {
      fadeObserver.observe(el);
    });
  }

  // Observe existing static elements
  document.querySelectorAll('.fade-element').forEach(function (el) {
    fadeObserver.observe(el);
  });

  // --- Scroll-based nav styling ---
  var lastScroll = 0;

  function handleScroll() {
    var scrollY = window.scrollY;

    if (scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    lastScroll = scrollY;
    updateActiveSection();
  }

  window.addEventListener('scroll', handleScroll, { passive: true });

  // --- Active section tracking ---
  function updateActiveSection() {
    var sections = document.querySelectorAll('.section');
    var scrollCenter = window.scrollY + window.innerHeight / 3;
    var currentId = 'home';

    sections.forEach(function (section) {
      if (section.offsetTop <= scrollCenter) {
        currentId = section.id;
      }
    });

    document.querySelectorAll('.nav-link').forEach(function (link) {
      if (link.dataset.section === currentId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  // --- Smooth navigation with page transition ---
  function navigateToSection(sectionId) {
    var target = document.getElementById(sectionId);
    if (!target) return;

    closeMobileMenu();

    pageTransition.classList.remove('animate-out');
    pageTransition.classList.add('animate-in');

    setTimeout(function () {
      var offset = sectionId === 'home' ? 0 : target.offsetTop - nav.offsetHeight;
      window.scrollTo({ top: offset, behavior: 'instant' });

      pageTransition.classList.remove('animate-in');
      pageTransition.classList.add('animate-out');

      setTimeout(function () {
        pageTransition.classList.remove('animate-out');
      }, 500);
    }, 450);
  }

  allNavLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      navigateToSection(link.dataset.section);
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

  navToggle.addEventListener('click', function () {
    if (mobileMenu.classList.contains('open')) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  });

  // --- Contact Form ---
  contactForm.addEventListener('submit', function (e) {
    e.preventDefault();

    var btn = contactForm.querySelector('.form-submit');
    var originalText = btn.querySelector('span').textContent;

    btn.querySelector('span').textContent = 'Sent!';
    btn.style.borderColor = 'var(--color-accent)';
    btn.style.color = 'var(--color-accent)';

    setTimeout(function () {
      btn.querySelector('span').textContent = originalText;
      btn.style.borderColor = '';
      btn.style.color = '';
      contactForm.reset();
    }, 2000);
  });

  // --- Initial load ---
  window.addEventListener('load', function () {
    var heroElements = document.querySelectorAll('.section--hero .fade-element');
    heroElements.forEach(function (el, i) {
      setTimeout(function () {
        el.classList.add('visible');
      }, 300 + i * 120);
    });
  });

  // Load dynamic content
  loadWriting();
  loadAbout();
  loadPhotos();
})();
