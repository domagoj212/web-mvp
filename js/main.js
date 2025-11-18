function openModal() {
  document.getElementById('infoModal').classList.add('show');
}

function closeModal() {
  document.getElementById('infoModal').classList.remove('show');
}




/* ----------------------------------------------------
   MAIN DOM LOGIC
---------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {

  /* ----------------------------------------------------
     MODAL CLICK FOR IMAGE-BASED SEGMENTS (2,3,4)
     Only elements with:  <div class="iframe-box no-crop">
  ---------------------------------------------------- */
  const imgCards = document.querySelectorAll(".iframe-box.no-crop");

  imgCards.forEach(card => {
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      openModal();
    });
  });


  /* ----------------------------------------------------
     HOVER TIMER POP-UP FOR IFRAME DASHBOARDS
     Applies ONLY to dashboard iframes (not .no-crop)
  ---------------------------------------------------- */
  const iframeBoxes = document.querySelectorAll('.iframe-box:not(.no-crop)');

  iframeBoxes.forEach(box => {
    let timer;
    let overlay;

    // Generate overlay popup
    const createOverlay = () => {
      overlay = document.createElement('div');
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

    // Start timer
    const startTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        createOverlay();
      }, 45000); // 45 sec
    };

    // Hover events
    box.addEventListener('mouseenter', startTimer);
    box.addEventListener('mouseleave', () => clearTimeout(timer));
  });

});

const form = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

form.addEventListener('submit', function(e) {
  e.preventDefault(); // spriječi standardno submitanje

  const formData = new FormData(form);

  fetch('https://formspree.io/f/managqak', {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  }).then(response => {
    if (response.ok) {
      formMessage.innerText = "Hvala, vaša poruka je poslana!";
      form.reset();
    } else {
      formMessage.innerText = "Ups! Došlo je do greške, pokušajte ponovno.";
    }
  }).catch(error => {
    formMessage.innerText = "Ups! Došlo je do greške, pokušajte ponovno.";
  });
});


