// src/main.js
import Lenis from '@studio-freight/lenis';

// ---- Año del footer ----
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- Menú mobile ----
const toggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('menu-mobile');

if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => {
    const willOpen = mobileMenu.classList.contains('hidden');
    mobileMenu.classList.toggle('hidden'); // mostrar/ocultar
    toggle.setAttribute('aria-expanded', String(willOpen));
    // bloquear scroll del fondo cuando está abierto
    document.body.classList.toggle('overflow-hidden', willOpen);
  });

  // Cerrar al tocar un link del menú mobile
  mobileMenu.addEventListener('click', (e) => {
    if (e.target.tagName === 'A') {
      mobileMenu.classList.add('hidden');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overflow-hidden');
    }
  });
}

// ---- Lenis: scroll suave global ----
const header = document.querySelector('.site-header');
const headerOffset = header ? header.offsetHeight + 8 : 0; // compensa header fijo

const lenis = new Lenis({
  duration: 0.7,
  smoothWheel: true,
  smoothTouch: false,
  easing: (t) => 1 - Math.pow(1 - t, 2), // easeOutQuad
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ---- Enlaces internos con scroll animado + cierre de menú ----
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    // permitir nueva pestaña/middle-click
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

    const href = a.getAttribute('href');
    const id = href?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    e.preventDefault(); // evita /# en la URL
    lenis.scrollTo(target, { offset: -headerOffset });

    // cerrar menú mobile si estuviera abierto
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
      mobileMenu.classList.add('hidden');
      toggle?.setAttribute('aria-expanded', 'false');
      document.body.classList.remove('overflow-hidden');
    }

    // // Si querés actualizar el hash sin salto visual:
    // history.replaceState(null, '', `#${id}`);
  });
});

// ---- Formspree (AJAX) opcional ----
const form = document.getElementById('contact-form');
const statusBox = document.getElementById('form-status');
const sendBtn = document.getElementById('send-btn');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!sendBtn) return;

    sendBtn.disabled = true;
    const original = sendBtn.textContent;
    sendBtn.textContent = 'Enviando...';

    try {
      const formData = new FormData(form);
      const endpoint = form.getAttribute('action');
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        statusBox?.classList.remove('hidden');
        form.reset();
      } else {
        alert('No pude enviar el mensaje. Probá de nuevo o escribime por email.');
      }
    } catch {
      alert('Error de red. Intentá nuevamente.');
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = original;
    }
  });
}
