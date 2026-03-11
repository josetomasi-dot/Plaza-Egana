/* ============================================
   ESPACIO EGAÑA — Landing Page Scripts
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Navbar scroll effect --- */
  const navbar = document.getElementById('navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 60) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  /* --- Mobile menu toggle --- */
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  navToggle.addEventListener('click', function () {
    navMenu.classList.toggle('active');
    // Animate hamburger
    navToggle.classList.toggle('active');
  });

  // Close menu when clicking a link
  navMenu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navMenu.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

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

      if (!isValid) return;

      // Submit form via Formspree (or custom endpoint)
      submitBtn.textContent = 'Enviando...';
      submitBtn.disabled = true;

      var formData = new FormData(form);

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            // Show success message
            form.style.display = 'none';
            formSuccess.style.display = 'block';
          } else {
            alert('Hubo un error al enviar el formulario. Por favor intenta nuevamente.');
            submitBtn.textContent = 'Enviar solicitud';
            submitBtn.disabled = false;
          }
        })
        .catch(function () {
          alert('Error de conexión. Por favor verifica tu conexión a internet e intenta nuevamente.');
          submitBtn.textContent = 'Enviar solicitud';
          submitBtn.disabled = false;
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

  /* --- Smooth scroll for anchor links (fallback) --- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

});

/* --- Helper: Validate email --- */
function validarEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* --- Helper: Format Chilean RUT --- */
function formatRut(value) {
  // Remove everything except numbers and kK
  var clean = value.replace(/[^0-9kK]/g, '');
  if (clean.length === 0) return '';

  // Separate body and verifier digit
  var body = clean.slice(0, -1);
  var dv = clean.slice(-1).toUpperCase();

  // Format body with dots
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

  // Validate body is a number
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
