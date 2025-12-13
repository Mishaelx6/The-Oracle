/* script.js
   Interactivity:
   - Smooth scroll for internal links
   - Reveal on scroll (simple)
   - Back to top button
   - Simple contact form handling (client-side)
   - Social icon hover interaction (tiny)
*/

/* Helpers */
const on = (el, ev, fn) => el && el.addEventListener(ev, fn);
const qs = s => document.querySelector(s);
const qsa = s => Array.from(document.querySelectorAll(s));

/* Smooth scroll for anchor links */
qsa('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', href);
  });
});

/* Reveal-on-scroll: simple intersection observer to add 'revealed' class */
(function initReveal(){
  const els = qsa('.section, .card, .song, .bio-image, .artist-photo-frame, .top-socials .social');
  if (!('IntersectionObserver' in window)) {
    els.forEach(el=>el.classList.add('revealed'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        io.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

  els.forEach(el => io.observe(el));
})();

/* Simple back to top behavior */
const toTop = qs('#toTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 450) toTop.classList.add('show');
  else toTop.classList.remove('show');
});
on(toTop, 'click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* Populate current year in footer */
const yearEl = qs('#year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* Contact form client-side handler (example: prevents real submit and shows a friendly message).
   Replace with real backend endpoint or integrate with a form service. */
const contactForm = qs('#contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = data.get('name') || 'friend';
    // simple inline feedback
    form.querySelector('.form-actions .btn-primary').textContent = 'Sending...';
    setTimeout(() => {
      alert(`Thanks ${name}! Your message was received (demo). Replace the handler with a real backend to process bookings.`);
      form.reset();
      form.querySelector('.form-actions .btn-primary').textContent = 'Send Message';
    }, 900);
  });
}

/* Tiny hover animation for socials: animate the small dot */
qsa('.top-socials .social').forEach(s => {
  s.addEventListener('mouseenter', () => {
    const dot = s.querySelector('.dot');
    if (!dot) return;
    dot.style.transform = 'scale(1.6)';
    dot.style.boxShadow = `0 8px 26px ${getComputedStyle(document.documentElement).getPropertyValue('--accent1') || '#d63eff'}`;
  });
  s.addEventListener('mouseleave', () => {
    const dot = s.querySelector('.dot');
    if (!dot) return;
    dot.style.transform = 'scale(1)';
    dot.style.boxShadow = 'none';
  });
});

/* Image lazy-loading fallback: add loading="lazy" to images if supported */
qsa('img').forEach(img => {
  if (!('loading' in HTMLImageElement.prototype)) return;
  img.setAttribute('loading', 'lazy');
});

/* Accessibility: allow keyboard "Enter" to trigger top social links */
qsa('.top-socials .social').forEach(s => {
  s.setAttribute('tabindex', '0');
  s.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') s.click();
  });
});

/* Small utility: allows you to set socials later via data attributes or JS
   Example usage to fill links dynamically:
     setSocial('instagram','https://instagram.com/yourhandle');
*/
function setSocial(name, url){
  const node = qsa(`.top-socials .social[data-network="${name}"]`)[0];
  if (node) node.setAttribute('href', url);
  const footerNode = qsa(`.footer-socials a[title="${capitalize(name)}"]`)[0];
  if (footerNode) footerNode.setAttribute('href', url);
}
function capitalize(s){ return s && s[0].toUpperCase()+s.slice(1) }

/* Expose small API to window for later dynamic updates (images/links) */
window.orvcle = {
  setSocial,
  setImage: (selector, src) => { const el = document.querySelector(selector); if(el) el.src = src; },
  scrollTo: (id) => { const t = document.getElementById(id); if(t) t.scrollIntoView({behavior:'smooth'}); }
};
