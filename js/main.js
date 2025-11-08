document.addEventListener('DOMContentLoaded', () => {
  const calcContainer = document.getElementById('calc');

  calcContainer.innerHTML = `
    <div class="calc-box" style="background:#fff; padding:20px; border-radius:8px; box-shadow:0 4px 10px rgba(0,0,0,0.05); max-width:600px; margin:0 auto;">
      <label for="units">Količina:</label>
      <input type="number" id="units" value="10" min="1">

      <label for="price">Cijena po jedinici (EUR):</label>
      <input type="number" id="price" value="5" min="0">

      <label for="addon">Dodatni trošak (EUR):</label>
      <input type="number" id="addon" value="0" min="0">

      <button id="btn-calc" style="margin-top:15px; padding:10px 20px; background:#007bff; color:white; border:none; border-radius:5px; cursor:pointer;">Izračunaj</button>

      <p id="result" style="margin-top:15px; font-weight:bold;"></p>
    </div>
  `;

  document.getElementById('btn-calc').addEventListener('click', () => {
    const units = Number(document.getElementById('units').value);
    const price = Number(document.getElementById('price').value);
    const addon = Number(document.getElementById('addon').value);

    const total = (units * price) + addon;

    document.getElementById('result').textContent = `Ukupna cijena: ${total.toFixed(2)} EUR`;
  });
});

// Select all iframe boxes
const iframeBoxes = document.querySelectorAll('.iframe-box');

iframeBoxes.forEach(box => {
  let timer;
  let overlay;

  // Function to create overlay
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
      <h2>Subscribe for full access</h2>
      <p>This is just a demo. Full access requires subscription.</p>
    `;

    const okBtn = document.createElement('button');
    okBtn.textContent = 'OK';
    okBtn.className = 'cta';
    okBtn.style.marginTop = '20px';
    okBtn.addEventListener('click', () => {
      document.body.removeChild(overlay);
      startTimer(); // restart timer after closing
    });

    message.appendChild(okBtn);
    overlay.appendChild(message);
    document.body.appendChild(overlay);
  };

  // Start 5s timer
  const startTimer = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      createOverlay();
    }, 5000);
  };

  // Trigger timer on hover
  box.addEventListener('mouseenter', startTimer);

  // Optional: clear timer if mouse leaves before 5s
  box.addEventListener('mouseleave', () => clearTimeout(timer));
});

