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
