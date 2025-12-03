/* main.js — spojeno i očišćeno */

/* Utility: safe query selector */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from((ctx || document).querySelectorAll(sel));

/* Modal control */
function openModal() {
  const modal = document.getElementById("infoModal");
  if (modal) modal.style.display = "flex";
}

function closeModal() {
  const modal = document.getElementById("infoModal");
  if (modal) modal.style.display = "none";
}

/* Open contact form from modal */
function goToContactForm() {
  closeModal();
  const formSection = document.getElementById('contactFormSection');
  if (!formSection) return;
  formSection.style.display = 'block';
  formSection.scrollIntoView({ behavior: 'smooth' });
}

/* Toggle company field (used by select in the form) */
function toggleCompanyField() {
  const type = (document.getElementById('personType') || {}).value;
  const companyField = document.getElementById('companyField');
  if (!companyField) return;
  companyField.style.display = type === 'pravna' ? 'block' : 'none';
}

/* Build the hover overlay (single instance factory) */
function createHoverOverlay() {
  const overlay = document.createElement('div');
  overlay.className = 'pb-hover-overlay';
  // Minimal inline styles — prefer moving to CSS later if desired
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.background = 'rgba(0,0,0,0.55)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';

  const message = document.createElement('div');
  message.style.maxWidth = '420px';
  message.style.padding = '28px';
  message.style.borderRadius = '12px';
  message.style.textAlign = 'center';
  message.style.background = 'rgba(12,16,20,0.95)';
  message.style.color = '#fff';
  message.style.boxShadow = '0 10px 30px rgba(0,0,0,0.6)';

  message.innerHTML = `
    <h2 style="margin:0 0 10px;">Alat vam je koristan?</h2>
    <p style="margin:0 0 18px;">Kontaktirajte nas i pretplatite se na puni pristup.</p>
  `;

  const okBtn = document.createElement('button');
  okBtn.textContent = 'OK';
  okBtn.style.padding = '10px 18px';
  okBtn.style.borderRadius = '8px';
  okBtn.style.cursor = 'pointer';
  okBtn.style.border = 'none';
  okBtn.style.fontWeight = '600';

  okBtn.addEventListener('click', () => {
    if (overlay.parentElement) overlay.parentElement.removeChild(overlay);
  });

  message.appendChild(okBtn);
  overlay.appendChild(message);
  return overlay;
}

/* DOM ready */
document.addEventListener('DOMContentLoaded', () => {

  // 1) Image cards that open modal (elements with .iframe-box.no-crop)
  const imgCards = $$('.iframe-box.no-crop');
  imgCards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', openModal);
  });

  // 2) Hover timer for iframe dashboards (only .iframe-box that are NOT .no-crop)
  const iframeBoxes = $$('.iframe-box:not(.no-crop)');
  iframeBoxes.forEach(box => {
    let timerId = null;
    let overlay = null;

    const startTimer = () => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        // avoid adding more than one overlay
        if (!overlay) {
          overlay = createHoverOverlay();
          document.body.appendChild(overlay);
        }
      }, 45000); // 45 seconds
    };

    const stopTimer = () => {
      clearTimeout(timerId);
      if (overlay && overlay.parentElement) {
        overlay.parentElement.removeChild(overlay);
        overlay = null;
      }
    };

    box.addEventListener('mouseenter', startTimer);
    box.addEventListener('mouseleave', stopTimer);

    // if user clicks inside iframe-box (e.g., to interact), stop timer too
    box.addEventListener('mousedown', stopTimer);
    box.addEventListener('touchstart', stopTimer);
  });

  // 3) Contact form show/hide using the "#openContactForm" button (already in HTML)
  const openContactBtn = document.getElementById('openContactForm');
  const formSection = document.getElementById('contactFormSection');
  if (openContactBtn && formSection) {
    openContactBtn.addEventListener('click', (e) => {
      e.preventDefault();
      // toggle visibility
      const isHidden = getComputedStyle(formSection).display === 'none';
      formSection.style.display = isHidden ? 'block' : 'none';
      if (isHidden) formSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // 4) Hero CTA — open contact form instead of mailto (optional). We keep mailto but also open form when clicked.
  const heroCTA = document.getElementById('heroCTA'); // we asked to add this id in HTML
  if (heroCTA && formSection) {
    heroCTA.addEventListener('click', (e) => {
      // If you want hero button to open form instead of mailto, uncomment next line:
      // e.preventDefault();
      // formSection.style.display = 'block'; formSection.scrollIntoView({ behavior: 'smooth' });

      // Current behavior: let mailto run. We'll still open the form below after small delay (non-blocking)
      setTimeout(() => {
        try { formSection.style.display = 'block'; } catch (err) {}
      }, 800);
    });
  }

  // 5) Contact form: toggle company field when select changes
  const personTypeSelect = document.getElementById('personType');
  if (personTypeSelect) {
    personTypeSelect.addEventListener('change', toggleCompanyField);
    // set initial visibility
    toggleCompanyField();
  }

  // 6) Form submission (AJAX) using FormData -> Formspree
  const contactForm = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  if (contactForm && formMessage) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      formMessage.textContent = ''; // reset

      const fd = new FormData(contactForm);

      fetch('https://formspree.io/f/managqak', {
        method: 'POST',
        body: fd,
        headers: { 'Accept': 'application/json' }
      })
      .then(async response => {
        if (response.ok) {
          formMessage.innerText = "Hvala, vaša poruka je poslana!";
          contactForm.reset();
          toggleCompanyField();
        } else {
          // try to parse error message for more detail
          let errText = "Ups! Došlo je do greške, pokušajte ponovno.";
          try {
            const json = await response.json();
            if (json && json.error) errText = json.error;
          } catch (_) {}
          formMessage.innerText = errText;
        }
      })
      .catch(() => {
        formMessage.innerText = "Ups! Došlo je do greške, pokušajte ponovno.";
      });
    });
  }

  // 7) Modal buttons: attach close handlers (in case markup added but handlers not bound)
  const modalOverlay = document.getElementById('infoModal');
  if (modalOverlay) {
    // click outside modal-box closes
    modalOverlay.addEventListener('click', (ev) => {
      if (ev.target === modalOverlay) closeModal();
    });
  }

  // Attach modal buttons that run goToContactForm / closeModal if they exist
  $$('.modal-buttons .btn-primary').forEach(b => b.addEventListener('click', goToContactForm));
  $$('.modal-buttons .btn-secondary').forEach(b => b.addEventListener('click', closeModal));
});
