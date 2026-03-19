/* ============================================
   ESPACIO EGAÑA — Premium Landing Page Scripts
   ============================================
   Animations, interactions, and form handling
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Scroll-triggered animations (Intersection Observer) --- */
  var animatedElements = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = parseInt(el.getAttribute('data-delay')) || 0;

          setTimeout(function () {
            el.classList.add('is-visible');
          }, delay);

          observer.unobserve(el);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    animatedElements.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    // Fallback: show all elements immediately
    animatedElements.forEach(function (el) {
      el.classList.add('is-visible');
    });
  }

  /* --- Navbar scroll effect --- */
  var navbar = document.getElementById('navbar');
  var lastScrollY = 0;

  function handleNavbarScroll() {
    var currentScrollY = window.scrollY;

    if (currentScrollY > 80) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }

    lastScrollY = currentScrollY;
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* --- Mobile menu toggle --- */
  var navToggle = document.getElementById('navToggle');
  var navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', function () {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
    // Prevent body scroll when menu is open
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  /* --- Smooth scroll for anchor links --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var offset = 90;
        var targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  /* --- Tipología / Nivel Tabs --- */
  var tipoTabs = document.querySelectorAll('.tipo-tab');
  if (tipoTabs.length > 0) {
    tipoTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var targetId = this.getAttribute('data-tab');

        // Deactivate all tabs and content
        tipoTabs.forEach(function (t) { t.classList.remove('active'); });
        document.querySelectorAll('.tipo-content').forEach(function (c) { c.classList.remove('active'); });

        // Activate clicked
        this.classList.add('active');
        var target = document.getElementById(targetId);
        if (target) {
          target.classList.add('active');
          // Re-trigger animations inside the new tab
          target.querySelectorAll('[data-animate]').forEach(function (el) {
            el.classList.remove('is-visible');
            setTimeout(function () { el.classList.add('is-visible'); }, 100);
          });
        }
      });
    });
  }

  /* --- Parallax effect on hero scroll indicator --- */
  var scrollIndicator = document.querySelector('.hero__scroll-indicator');
  if (scrollIndicator) {
    window.addEventListener('scroll', function () {
      var scrolled = window.scrollY;
      if (scrolled < 600) {
        scrollIndicator.style.opacity = 1 - (scrolled / 400);
      }
    }, { passive: true });
  }

  /* --- Counter animation for hero stats --- */
  var heroStats = document.querySelectorAll('.hero__stat-number');
  var statsAnimated = false;

  function animateCounters() {
    if (statsAnimated) return;
    statsAnimated = true;

    heroStats.forEach(function (stat) {
      var text = stat.textContent.trim();

      // Handle range format (e.g., "30-70" or "30–70")
      if (text.indexOf('–') !== -1 || text.indexOf('-') !== -1) {
        stat.textContent = text;
        return;
      }

      var target = parseInt(text);
      if (isNaN(target)) return;

      var start = 0;
      var duration = 2000;
      var startTime = null;

      function step(timestamp) {
        if (!startTime) startTime = timestamp;
        var progress = Math.min((timestamp - startTime) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
        var current = Math.floor(eased * target);
        stat.textContent = current;
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          stat.textContent = target;
        }
      }

      requestAnimationFrame(step);
    });
  }

  // Trigger counter animation when hero is visible
  var heroSection = document.querySelector('.hero');
  if (heroSection && heroStats.length > 0) {
    // Small delay to let the page render
    setTimeout(animateCounters, 800);
  }

  /* --- Form validation and submission --- */
  var form = document.getElementById('contactForm');
  var submitBtn = document.getElementById('submitBtn');
  var formSuccess = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Reset errors
      form.querySelectorAll('.form-group').forEach(function (g) {
        g.classList.remove('error');
      });

      var isValid = true;

      // Validate required fields
      var nombre = document.getElementById('nombre');
      if (!nombre.value.trim()) {
        nombre.closest('.form-group').classList.add('error');
        isValid = false;
      }

      var rut = document.getElementById('rut');
      if (!rut.value.trim() || !validarRut(rut.value.trim())) {
        rut.closest('.form-group').classList.add('error');
        isValid = false;
      }

      var email = document.getElementById('email');
      if (!email.value.trim() || !validarEmail(email.value.trim())) {
        email.closest('.form-group').classList.add('error');
        isValid = false;
      }

      var telefono = document.getElementById('telefono');
      if (!telefono.value.trim()) {
        telefono.closest('.form-group').classList.add('error');
        isValid = false;
      }

      if (!isValid) {
        // Smooth scroll to first error
        var firstError = form.querySelector('.form-group.error');
        if (firstError) {
          firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Submit form via Formspree
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;
      submitBtn.style.opacity = '0.7';

      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.style.display = 'none';
            formSuccess.style.display = 'block';
          } else {
            alert('Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
            submitBtn.textContent = 'Enviar solicitud';
            submitBtn.disabled = false;
            submitBtn.style.opacity = '1';
          }
        })
        .catch(function () {
          alert('Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.');
          submitBtn.textContent = 'Enviar solicitud';
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
        });
    });
  }

  /* --- RUT formatting --- */
  var rutInput = document.getElementById('rut');
  if (rutInput) {
    rutInput.addEventListener('input', function () {
      this.value = formatRut(this.value);
    });
  }

});

/* --- Helper: Validate email --- */
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* --- Helper: Format Chilean RUT --- */
function formatRut(value) {
  var clean = value.replace(/[^0-9kK]/g, '');
  if (clean.length === 0) return '';

  var body = clean.slice(0, -1);
  var dv = clean.slice(-1).toUpperCase();

  var formatted = '';
  var count = 0;
  for (var i = body.length - 1; i >= 0; i--) {
    formatted = body[i] + formatted;
    count++;
    if (count === 3 && i > 0) {
      formatted = '.' + formatted;
      count = 0;
    }
  }

  if (clean.length > 1) {
    return formatted + '-' + dv;
  }
  return clean;
}

/* --- Helper: Basic Chilean RUT validation --- */
function validarRut(rutCompleto) {
  var rut = rutCompleto.replace(/\./g, '').replace(/-/g, '');
  if (rut.length < 2) return false;

  var cuerpo = rut.slice(0, -1);
  var dv = rut.slice(-1).toUpperCase();

  if (!/^\d+$/.test(cuerpo)) return false;

  var suma = 0;
  var multiplo = 2;

  for (var i = cuerpo.length - 1; i >= 0; i--) {
    suma += parseInt(cuerpo[i]) * multiplo;
    multiplo = multiplo === 7 ? 2 : multiplo + 1;
  }

  var dvEsperado = 11 - (suma % 11);
  var dvFinal;

  if (dvEsperado === 11) dvFinal = '0';
  else if (dvEsperado === 10) dvFinal = 'K';
  else dvFinal = dvEsperado.toString();

  return dv === dvFinal;
}
