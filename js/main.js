// ===========================================================
// Youth to the Nations — Interactions
// ===========================================================

document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initScrollProgressAndHeader();
  initMobileMenu();
  initSmoothScroll();
  initScrollReveal();
  initCounters();
  initStoryCarousel();
  initPrayerCta();
  initContactForm();
  initFooterYear();
});

/* ---------- Preloader ---------- */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;
  window.addEventListener('load', () => setTimeout(() => preloader.classList.add('hidden'), 350));
  // Fallback in case 'load' is slow/blocked
  setTimeout(() => preloader.classList.add('hidden'), 2200);
}

/* ---------- Scroll progress, header state, active nav link ---------- */
function initScrollProgressAndHeader() {
  const header = document.getElementById('header');
  const progressBar = document.getElementById('scroll-progress');
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = Array.from(navLinks).map(link => document.querySelector(link.getAttribute('href')));

  function updateActiveNav() {
    let currentIndex = 0;
    sections.forEach((sec, i) => {
      if (sec && window.scrollY >= sec.offsetTop - 140) currentIndex = i;
    });
    navLinks.forEach((link, i) => link.classList.toggle('active', i === currentIndex));
  }

  function onScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';

    header.classList.toggle('scrolled', scrollTop > 60);
    updateActiveNav();
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ---------- Mobile menu ---------- */
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function closeMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
}

/* ---------- Smooth scroll for internal links ---------- */
function initSmoothScroll() {
  const HEADER_OFFSET = 90;
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

/* ---------- Scroll reveal (fade-up + image mask reveals) ---------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('[data-reveal], .mask-reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));
}

/* ---------- Animated counters ---------- */
function initCounters() {
  function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString();
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target.toLocaleString();
    }
    requestAnimationFrame(tick);
  }

  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  counters.forEach(c => counterObserver.observe(c));
}

/* ---------- Stories carousel ---------- */
function initStoryCarousel() {
  const track = document.getElementById('storyTrack');
  const prevBtn = document.getElementById('storyPrev');
  const nextBtn = document.getElementById('storyNext');
  if (!track || !prevBtn || !nextBtn) return;

  const scrollAmount = () => (track.querySelector('.story-card')?.offsetWidth || 340) + 24;
  nextBtn.addEventListener('click', () => track.scrollBy({ left: scrollAmount(), behavior: 'smooth' }));
  prevBtn.addEventListener('click', () => track.scrollBy({ left: -scrollAmount(), behavior: 'smooth' }));
}

/* ---------- Prayer request CTA ---------- */
function initPrayerCta() {
  const prayerCta = document.getElementById('prayerCta');
  const prayerCheck = document.getElementById('prayerCheck');
  const inquirySelect = document.querySelector('#contactForm select');
  if (!prayerCta || !prayerCheck) return;

  prayerCta.addEventListener('click', () => {
    prayerCheck.checked = true;
    if (inquirySelect) {
      const prayerOption = Array.from(inquirySelect.options).find(o => o.text.includes('Prayer Request'));
      if (prayerOption) inquirySelect.value = prayerOption.value;
    }
  });
}

/* ---------- Contact / prayer form ---------- */
function initContactForm() {
  const form = document.getElementById('contactForm');
  const formFields = document.getElementById('formFields');
  const formSuccess = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formFields.style.display = 'none';
    formSuccess.classList.add('show');
  });
}

/* ---------- Footer year ---------- */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
