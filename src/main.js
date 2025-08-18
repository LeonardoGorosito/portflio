// src/main.js
import Lenis from '@studio-freight/lenis';

// Año del footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Menú móvil (opcional)
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
if (toggle && menu) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// ---- Lenis: scroll suave global (wheel/touchpad) ----
const header = document.querySelector('.site-header');
const headerOffset = header ? header.offsetHeight + 8 : 0; // compensa header fijo

const lenis = new Lenis({
  duration: 0.7,            // 0.6–1.4 va bien
  smoothWheel: true,
  smoothTouch: false,        // podés poner true si querés
  easing: (t) => 1 - Math.pow(1 - t, 2), // easeOutQuad suave
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// ---- Enlaces internos: sin “/#” y con scroll animado ----
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    // Permitir abrir en nueva pestaña o usar middle-click
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1) return;

    const href = a.getAttribute('href');
    const id = href?.slice(1);
    const target = id ? document.getElementById(id) : null;
    if (!target) return;

    e.preventDefault();                 // evita cambiar la URL a /#...
    lenis.scrollTo(target, { offset: -headerOffset });

    // Cerrar menú móvil si está abierto
    if (menu?.classList.contains('open')) {
      menu.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }

    // Si querés actualizar el hash sin “salto” visual, descomentá:
    // history.replaceState(null, '', `#${id}`);
  });
});


// --- Formspree (AJAX) ---
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
      const res = await fetch(endpoint, { method: 'POST', body: formData, headers: { Accept: 'application/json' } });

      if (res.ok) {
        statusBox?.classList.remove('hidden');
        form.reset();
      } else {
        alert('No pude enviar el mensaje. Probá de nuevo o escribime por email.');
      }
    } catch (err) {
      alert('Error de red. Intentá nuevamente.');
    } finally {
      sendBtn.disabled = false;
      sendBtn.textContent = original;
    }
  });
}



