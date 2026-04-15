/* ============================================
   HASHTAG LABS — JAVASCRIPT
   ============================================ */

// ---- Navbar scroll effect ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ---- Hamburger / Mobile menu ----
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});

function closeMobile() {
  mobileMenu.classList.remove('open');
}

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
  if (!hamburger.contains(e.target) && !mobileMenu.contains(e.target)) {
    mobileMenu.classList.remove('open');
  }
});

// ---- Scroll reveal ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, idx) => {
    if (entry.isIntersecting) {
      // Stagger siblings slightly
      const siblings = entry.target.parentElement.querySelectorAll('.reveal');
      const siblingsArr = Array.from(siblings);
      const siblingsIdx = siblingsArr.indexOf(entry.target);

      setTimeout(() => {
        entry.target.classList.add('visible');
      }, siblingsIdx * 80);

      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.reveal').forEach(el => {
  revealObserver.observe(el);
});

// ---- Active nav link on scroll ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--text)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

// ---- Smooth scroll for all anchor links ----
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ---- Contact form ----
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending…';
  btn.disabled = true;

  try {
    const response = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (response.ok) {
      form.style.display = 'none';
      formSuccess.classList.add('visible');
    } else {
      const data = await response.json();
      const errorMsg = data.errors ? data.errors.map(e => e.message).join(', ') : 'Something went wrong. Please try again.';
      alert(errorMsg);
      btn.textContent = 'Send Message →';
      btn.disabled = false;
    }
  } catch {
    alert('Network error. Please check your connection and try again.');
    btn.textContent = 'Send Message →';
    btn.disabled = false;
  }
});

// ---- Parallax effect on hero orbs (subtle) ----
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 20;
  const y = (e.clientY / window.innerHeight - 0.5) * 20;

  const orb1 = document.querySelector('.orb-1');
  const orb2 = document.querySelector('.orb-2');
  const orb3 = document.querySelector('.orb-3');

  if (orb1) orb1.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
  if (orb2) orb2.style.transform = `translate(${-x * 0.5}px, ${-y * 0.5}px)`;
  if (orb3) orb3.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px)`;
}, { passive: true });

// ---- Number counter animation for stats ----
function animateCounter(el, target, duration = 1500) {
  const isFloat = target % 1 !== 0;
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const start = 0;
  const step = (timestamp, startTime) => {
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease out cubic
    const current = Math.round(eased * target);
    el.textContent = `${prefix}${current}${suffix}`;
    if (progress < 1) requestAnimationFrame(ts => step(ts, startTime));
  };
  requestAnimationFrame(ts => step(ts, ts));
}

const statNums = document.querySelectorAll('.stat-num');
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const raw = el.textContent.trim();
      // Parse numeric value + suffix
      const match = raw.match(/^([£$€]?)(\d+(?:\.\d+)?)([%+×xBMK]*)(.*)$/);
      if (match) {
        const prefix = match[1];
        const num = parseFloat(match[2]);
        const suffix = match[3] + match[4];
        el.dataset.prefix = prefix;
        el.dataset.suffix = suffix;
        animateCounter(el, num, 1600);
      }
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });

statNums.forEach(el => statsObserver.observe(el));
