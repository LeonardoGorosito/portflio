// Año del footer
document.getElementById('year').textContent = new Date().getFullYear();

// Menú móvil
const toggle = document.querySelector('.nav-toggle');
const menu = document.getElementById('menu');
if (toggle) {
  toggle.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
}

// Mejor enfoque a secciones (sin JS ya hay scroll suave via CSS)
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', () => menu.classList.remove('open'));
});
