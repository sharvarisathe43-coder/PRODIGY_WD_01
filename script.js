/* =============================================================
   NEXORA DIGITAL — SCRIPT.JS
   Vanilla JS only. Responsibilities:
   1. Toggle navbar "scrolled" style on scroll
   2. Mobile hamburger menu open/close
   3. Active nav-link highlighting based on section in view
   4. Close mobile menu when a link is clicked
   5. Scroll-reveal animations for sections (IntersectionObserver)
============================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* -----------------------------------------------------------
     ELEMENT REFERENCES
  ----------------------------------------------------------- */
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');
  const revealEls = document.querySelectorAll('.reveal');

  /* -----------------------------------------------------------
     1. NAVBAR SCROLL STATE
     Adds/removes the "scrolled" class once the user has
     scrolled past a small threshold. Using a class (rather than
     inline styles) keeps all visual logic in CSS transitions.
  ----------------------------------------------------------- */
  const SCROLL_THRESHOLD = 60;

  function handleNavbarScroll() {
    if (window.scrollY > SCROLL_THRESHOLD) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Run once on load in case the page is refreshed mid-scroll
  handleNavbarScroll();
  window.addEventListener('scroll', handleNavbarScroll, { passive: true });

  /* -----------------------------------------------------------
     2. MOBILE HAMBURGER MENU
  ----------------------------------------------------------- */
  function toggleMenu() {
    const isOpen = navMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : ''; // lock scroll behind menu
  }

  hamburger.addEventListener('click', toggleMenu);

  // Close the mobile menu whenever a nav link is chosen
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('open')) {
        toggleMenu();
      }
    });
  });

  /* -----------------------------------------------------------
     3. ACTIVE LINK HIGHLIGHTING WHILE SCROLLING
     Uses IntersectionObserver to detect which section is
     currently most visible, then flags the matching nav link.
  ----------------------------------------------------------- */
  const navObserverOptions = {
    root: null,
    // Shrinks the detection box to roughly the middle of the
    // viewport so a section is "active" once it dominates view.
    rootMargin: '-40% 0px -50% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        setActiveLink(id);
      }
    });
  }, navObserverOptions);

  sections.forEach((section) => sectionObserver.observe(section));

  function setActiveLink(sectionId) {
    navLinks.forEach((link) => {
      const isMatch = link.dataset.section === sectionId;
      link.classList.toggle('active-link', isMatch);
    });
  }

  /* -----------------------------------------------------------
     4. SCROLL-REVEAL ANIMATIONS
     Fade + slide in each `.reveal` element the first time it
     enters the viewport, then stop observing it (one-shot).
  ----------------------------------------------------------- */
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => revealObserver.observe(el));

  /* -----------------------------------------------------------
     5. CONTACT FORM — lightweight front-end only handler
     No backend is wired up (this is a static demo), so we just
     acknowledge submission gracefully instead of reloading.
  ----------------------------------------------------------- */
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Message Sent ✓';
      submitBtn.disabled = true;
      contactForm.reset();

      setTimeout(() => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 2500);
    });
  }

});
