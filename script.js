const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.primary-nav');
const navLinks = [...navigation.querySelectorAll('a')];

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  navigation.classList.remove('is-open');
}
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') !== 'true';
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  navigation.classList.toggle('is-open', open);
});
navLinks.forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeMenu();
});

const serviceButtons = [...document.querySelectorAll('.service-toggle')];
serviceButtons.forEach(button => button.addEventListener('click', () => {
  const wasOpen = button.getAttribute('aria-expanded') === 'true';
  serviceButtons.forEach(other => {
    other.setAttribute('aria-expanded', 'false');
    document.getElementById(other.getAttribute('aria-controls')).hidden = true;
  });
  if (!wasOpen) {
    button.setAttribute('aria-expanded', 'true');
    document.getElementById(button.getAttribute('aria-controls')).hidden = false;
  }
}));

const revealItems = [...document.querySelectorAll('.reveal')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!reduceMotion && 'IntersectionObserver' in window) {
  document.documentElement.classList.add('motion-ready');
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -28px 0px' });
  revealItems.forEach(item => revealObserver.observe(item));
}

if ('IntersectionObserver' in window) {
  const sections = [...document.querySelectorAll('header[id], main section[id]')];
  const navObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      navLinks.forEach(link => link.classList.toggle('nav-active', link.getAttribute('href') === `#${entry.target.id}`));
    });
  }, { rootMargin: '-20% 0px -65% 0px' });
  sections.forEach(section => navObserver.observe(section));
}

const form = document.getElementById('inspection-form');
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const name = form.elements.namedItem('name').value.trim();
  const phone = form.elements.namedItem('phone').value.trim();
  const location = form.elements.namedItem('location').value.trim();
  const concern = form.elements.namedItem('concern').value.trim();
  const subject = encodeURIComponent(`Free inspection request from ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nMobile number: ${phone}\nProperty location: ${location}\n\nPest concern:\n${concern}`);
  document.getElementById('form-feedback').textContent = 'Your email app should open with the request ready to send. If it does not, please call or email Triple A directly.';
  window.location.href = `mailto:inquiry@tripleapestcontrol.com.ph?subject=${subject}&body=${body}`;
});

document.getElementById('year').textContent = new Date().getFullYear();
