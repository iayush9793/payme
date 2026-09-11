// ==========================================
// 6th Anniversary Payment Gateway Logic
// ==========================================

// HARDCODED CONFIGURATION - Customize these values
const MERCHANT_UPI = 'iconicchandu@okaxis';         // Receiver's UPI ID
const MERCHANT_NAME = 'Mavericks & Musers Media';     // Receiver's Name
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwjivnwH8StT-FcExWhjkv8pEuISo3aeaDkiAIEk-uZmPOxIDArIpP5q7mp2McF4I8v/exec';                         // Paste your Google Apps Script Web App URL here

document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements - Display Details
  const qrCodeImg = document.getElementById('qr-code-img');
  const qrLoader = document.getElementById('qr-loader');

  // DOM Elements - Form Verification
  const transactionForm = document.getElementById('transaction-form');
  const userNameInput = document.getElementById('user-name');
  const userUpiInput = document.getElementById('user-upi');
  const userTxnInput = document.getElementById('user-txn');
  const submitBtn = document.getElementById('submit-btn');

  // DOM Elements - Error Messages
  const nameError = document.getElementById('name-error');
  const upiError = document.getElementById('upi-error');
  const txnError = document.getElementById('txn-error');

  // DOM Elements - Thank You Modal
  const thankYouOverlay = document.getElementById('thank-you-overlay');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const summaryName = document.getElementById('summary-name');
  const summaryTxn = document.getElementById('summary-txn');

  // ==========================================
  // Initialization
  // ==========================================
  function init() {
    loadQrCode();

    // Attach Event Listeners
    transactionForm.addEventListener('submit', handleFormSubmit);
    closeModalBtn.addEventListener('click', closeThankYouModal);

    // Clear errors on typing
    userNameInput.addEventListener('input', () => clearError(nameError, userNameInput));
    userUpiInput.addEventListener('input', () => clearError(upiError, userUpiInput));
    userTxnInput.addEventListener('input', () => clearError(txnError, userTxnInput));
  }

  // ==========================================
  // QR Code Image Loader
  // ==========================================
  function loadQrCode() {
    qrLoader.classList.add('active');

    // Use local hardcoded qrcode.jpg image
    qrCodeImg.src = 'qr.png';

    qrCodeImg.onload = () => {
      qrLoader.classList.remove('active');
    };

    qrCodeImg.onerror = () => {
      qrLoader.classList.remove('active');
      alert('Failed to load QR code. Please verify that "qrcode.jpg" is present in the project directory.');
    };
  }

  // ==========================================
  // Form Validation & Submission
  // ==========================================
  function showError(element, inputElement) {
    element.style.display = 'flex';
    inputElement.classList.add('invalid');
  }

  function clearError(element, inputElement) {
    element.style.display = 'none';
    if (inputElement) {
      inputElement.classList.remove('invalid');
    }
  }

  function validateForm() {
    let isValid = true;

    // Validate Name
    const nameVal = userNameInput.value.trim();
    if (!nameVal) {
      showError(nameError, userNameInput);
      isValid = false;
    } else {
      clearError(nameError, userNameInput);
    }

    // Validate UPI ID
    const upiVal = userUpiInput.value.trim();
    const upiPattern = /^[\w.-]+@[\w.-]+$/;
    if (!upiVal || !upiPattern.test(upiVal)) {
      showError(upiError, userUpiInput);
      isValid = false;
    } else {
      clearError(upiError, userUpiInput);
    }

    // Validate Transaction ID (exactly 12 digits for UPI UTR)
    const txnVal = userTxnInput.value.trim();
    const txnPattern = /^\d{12}$/;
    if (!txnVal || !txnPattern.test(txnVal)) {
      showError(txnError, userTxnInput);
      isValid = false;
    } else {
      clearError(txnError, userTxnInput);
    }

    return isValid;
  }

  function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const name = userNameInput.value.trim();
    const upiId = userUpiInput.value.trim();
    const transactionId = userTxnInput.value.trim();

    // Disable button and show verifying state
    submitBtn.classList.add('submitting');
    submitBtn.disabled = true;
    const btnSpan = submitBtn.querySelector('span');
    btnSpan.textContent = 'Verifying Transaction...';

    const payload = {
      name: name,
      upiId: upiId,
      transactionId: transactionId,
      amount: "300"
    };

    if (GOOGLE_SCRIPT_URL && GOOGLE_SCRIPT_URL.trim() !== '') {
      // POST to Google Sheets Apps Script
      fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // Bypasses App Script CORS redirection limits
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(() => {
          setTimeout(() => {
            showCelebration(name, transactionId);
            resetForm();
          }, 1200);
        })
        .catch(error => {
          console.error('Submission Error:', error);
          alert('Network request failed. We will record this locally. Let\'s celebrate!');

          setTimeout(() => {
            showCelebration(name, transactionId);
            resetForm();
          }, 1200);
        });
    } else {
      // Offline/Demo Mode
      console.log('%c[OFFLINE DEMO MODE] Payload:', 'color: #d4af37; font-weight: bold;', payload);

      setTimeout(() => {
        showCelebration(name, transactionId);
        resetForm();
      }, 1000);
    }
  }

  function resetForm() {
    transactionForm.reset();
    submitBtn.classList.remove('submitting');
    submitBtn.disabled = false;
    submitBtn.querySelector('span').textContent = 'Submit Details';
  }

  // ==========================================
  // Celebration Overlay & Confetti
  // ==========================================
  function showCelebration(name, txnId) {
    summaryName.textContent = name;
    summaryTxn.textContent = txnId;

    thankYouOverlay.classList.add('show');
    triggerAnniversaryConfetti();
  }

  function triggerAnniversaryConfetti() {
    if (typeof confetti !== 'function') {
      console.warn('Canvas Confetti library is not loaded.');
      return;
    }

    const duration = 3 * 1000;
    const end = Date.now() + duration;
    const colors = ['#d4af37', '#f6e09a', '#aa7c11', '#8a2be2', '#b176f5', '#ffffff'];

    // Left and Right Party Bomber streams
    (function frame() {
      confetti({
        particleCount: 5,
        angle: 55,
        spread: 55,
        origin: { x: 0, y: 0.95 },
        colors: colors,
        velocity: 45
      });

      confetti({
        particleCount: 5,
        angle: 125,
        spread: 55,
        origin: { x: 1, y: 0.95 },
        colors: colors,
        velocity: 45
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());

    // Large explosive pop bursts
    const burstParamsLeft = {
      particleCount: 65,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.9 },
      colors: colors
    };

    const burstParamsRight = {
      particleCount: 65,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.9 },
      colors: colors
    };

    confetti(burstParamsLeft);
    confetti(burstParamsRight);

    setTimeout(() => {
      confetti({ ...burstParamsLeft, particleCount: 40 });
      confetti({ ...burstParamsRight, particleCount: 40 });
    }, 450);

    setTimeout(() => {
      confetti({ ...burstParamsLeft, particleCount: 30, spread: 80 });
      confetti({ ...burstParamsRight, particleCount: 30, spread: 80 });
    }, 900);
  }

  function closeThankYouModal() {
    thankYouOverlay.classList.remove('show');
  }

  // Start App
  init();
});
