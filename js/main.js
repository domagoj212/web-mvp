/* ----------------------------------------------------
   MODAL HANDLER
---------------------------------------------------- */
const Modal = (() => {
  const modal = document.getElementById('infoModal');

  const open = () => {
    modal.classList.add('show');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('role', 'dialog');
  };

  const close = () => {
    modal.classList.remove('show');
    modal.removeAttribute('aria-modal');
    modal.removeAttribute('role');
  };

  // Close modal on overlay click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) close();
  });

  return { open, close };
})();

/* ----------------------------------------------------
   HOVER OVERLAY FOR IFRAME DASHBOARDS
---------------------------------------------------- */
const HoverPopup = (() => {
  const overlayClass = 'custom-overlay';

  const createOverlay = () => {
    // Check if overlay already exists
    if (document.querySelector(`.${overlayClass}`)) return;

    const overlay = document.createElement('div');
    overlay.className = overlayClass;
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.backdropFilter = 'blur(5px)';
    overlay.style.display = 'flex';
    overlay.style.alignItems = 'center';
    overlay.style.justifyContent = 'center';
    overlay.style.zIndex = '9999';

    const message = document.createElement('div');
    message.style.background = 'rgba(15,20,26,0.95)';
    message.style.color = '#fff';
    message.style.padding = '30px';
    message.style.borderRadius = '12px';
    message.style.textAlign = 'center';
    message.style.maxWidth = '400px';
    message.style.boxShadow = '0 0 20px rgba(0,0,0,0.5)';
    message.innerHTML = `
      <h2>Alat vam je koristan?</h2>
      <p>Kontaktirajte nas i pretplatite se na puni pristup.</p>
    `;

    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.style.marginTop = '20px';
    okBtn.style.padding = '10px 20px';
    okBtn.style.border = 'none';
    okBtn.style.borderRadius = '6px';
    okBtn.style.cursor = 'pointer';
    okBtn.style.background = '#58A6FF';
    okBtn.style.color = '#000';

    okBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
    });

    message.appendChild(okBtn);
    overlay.appendChild(message);
    document.body.appendChild(overlay);
  };

  const init = () => {
    const iframeBoxes = document.querySelectorAll('.iframe-box:not(.no-crop)');

    iframeBoxes.forEach(box => {
      let timer;

      const startTimer = () => {
        clearTimeout(timer);
        timer = setTimeout(createOverlay, 45000); // 45 sec
      };

      box.addEventListener('mouseenter', startTimer);
      box.addEventListener('mouseleave', () => clearTimeout(timer));
    });
  };

  return { init };
})();

/* ----------------------------------------------------
   IMAGE MODAL CARDS (2,3,4)
---------------------------------------------------- */
const ImageCards = (() => {
  const cards = document.querySelectorAll('.iframe-box.no-crop');

  cards.forEach(card => {
    card.style.cursor = 'pointer';
    card.addEventListener('click', () => Modal.open());
  });
})();

/* ----------------------------------------------------
   CONTACT FORM AJAX SUBMIT
---------------------------------------------------- */
const ContactForm = (() => {
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = form.querySelector('button[type="submit"]');

  const toggleCompanyField = () => {
    const type = document.getElementById('personType').value;
    document.getElementById('companyField').style.display = type === 'pravna' ? 'block' : 'none';
  };

  document.getElementById('personType').addEventListener('change', toggleCompanyField);

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    submitBtn.disabled = true; // Prevent multiple submits
    const formData = new FormData(form);

    fetch('https://formspree.io/f/managqak', {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    }).then(response => {
      if (response.ok) {
        formMessage.innerText = "Hvala, vaša poruka je poslana!";
        form.reset();
        document.getElementById('companyField').style.display = 'none';
      } else {
        formMessage.innerText = "Ups! Došlo je do greške, pokušajte ponovno.";
      }
    }).catch(() => {
      formMessage.innerText = "Ups! Došlo je do greške, pokušajte ponovno.";
    }).finally(() => {
      submitBtn.disabled = false;
    });
  });
})();

/* ----------------------------------------------------
   OPEN CONTACT FORM ACCORDION
---------------------------------------------------- */
document.getElementById('openContactForm').addEventListener('click', (e) => {
  e.preventDefault();
  const formSection = document.getElementById('contactFormSection');
  formSection.style.display = formSection.style.display === 'none' ? 'block' : 'none';
  formSection.scrollIntoView({ behavior: 'smooth' });
});

/* ----------------------------------------------------
   INITIALIZE
---------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  HoverPopup.init();
});
