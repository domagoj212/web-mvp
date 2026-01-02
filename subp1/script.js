/***********************
 * 1. KONFIGURACIJA
 ***********************/

/**
 * 🔐 OVO JE JEDINO MJESTO GDJE JE "TOČAN PASSWORD"
 *
 * Password NIJE zapisan direktno,
 * nego je on ključ kojim je URL enkodiran.
 *
 * 👉 To znači:
 * - Točan password = onaj koji ispravno dekodira URL
 * - Nema hashova, nema plain texta
 */

// ⛔️ ZAMIJENI OVIM SVOJ ENKODIRANI NIZ
const encodedIframeUrl = [
  24,21,7,3,3,91,92,92,17,17,3,93,0,14,4,22,2,3,26,93,19,14,30,92,6,8,22,4,79,19,78,22,9,43,1,58,26,14,26,42,39,36,9,61,10,52,11,60,55,48,7,62,55,48,9,62,25,81,67,62,55,40,71,63,39,36,9,42,29,52,7,42,26,13,27,61,36,56,71,61,10,36,64,61,36,2,65,58,25,22,26,23,51,40,69,58,26,36,4,60,52,56,64,42,10,44,11,63,39,48,70,61,52,56,7,61,52,56,10,61,35,81,71,60,55,36,67,63,39,52,9,61,36,13,24,42,36,39,26,42,36,40,11,41,25,40,0,58,29,44,26,60,26,13,74
  // ... cijeli niz koji si dobio iz offline encodera
];

// 👤 DOZVOLJENI KORISNICI
const allowedUsernames = ['user1', 'user2', 'user3'];


/***********************
 * 2. DEKODER FUNKCIJA
 ***********************/

function decodeUrl(encodedArray, password) {
  return encodedArray
    .map((charCode, index) =>
      String.fromCharCode(
        charCode ^ password.charCodeAt(index % password.length)
      )
    )
    .join('');
}


/***********************
 * 3. AUTENTIFIKACIJA LOGIKA
 ***********************/

let sessionTimeout = null;

function startSessionTimeout() {
  // Clear any existing timeout
  if (sessionTimeout) {
    clearTimeout(sessionTimeout);
  }

  // Set timeout for 60 minutes (3,600,000 ms)
  sessionTimeout = setTimeout(() => {
    lockSession();
  }, 60 * 60 * 1000);
}

function lockSession() {
  const container = document.getElementById('protected-content');
  const modal = document.getElementById('password-modal');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  const errorEl = document.getElementById('error');

  // Hide content and show modal
  container.style.display = 'none';
  container.innerHTML = '';
  modal.style.display = 'flex';
  
  // Clear inputs and show timeout message
  usernameInput.value = '';
  passwordInput.value = '';
  errorEl.textContent = 'Sesija je istekla. Unesite podatke ponovno.';
  errorEl.style.color = 'orange';
  usernameInput.focus();
}

document.getElementById('submitBtn').addEventListener('click', () => {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const errorEl = document.getElementById('error');
  const container = document.getElementById('protected-content');
  const modal = document.getElementById('password-modal');

  try {
    // ✅ VALIDACIJA USERNAMEA
    if (!allowedUsernames.includes(username)) {
      throw new Error('Invalid username');
    }

    const decodedUrl = decodeUrl(encodedIframeUrl, password);

    // ✅ VALIDACIJA PASSWORDA: samo pravi URL prolazi
    if (!decodedUrl.startsWith('https://')) {
      throw new Error('Wrong password');
    }

    // 🧱 Kreiramo iframe TEK SAD
    container.innerHTML = `
      <iframe
        src="${decodedUrl}"
        allowfullscreen>
      </iframe>
    `;

    // Hide modal and show content
    modal.style.display = 'none';
    container.style.display = 'block';
    errorEl.textContent = '';
    errorEl.style.color = 'red';

    // Start session timeout
    startSessionTimeout();

  } catch (e) {
    container.style.display = 'none';
    container.innerHTML = '';
    errorEl.textContent = 'Pogrešno korisničko ime ili lozinka';
    errorEl.style.color = 'red';
  }
});

// Allow Enter key to submit from both fields
document.getElementById('username').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('submitBtn').click();
  }
});

document.getElementById('password').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('submitBtn').click();
  }
});
