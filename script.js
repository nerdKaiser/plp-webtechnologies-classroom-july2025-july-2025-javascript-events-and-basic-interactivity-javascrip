/* script.js
   Interactive behaviors for Kai's Interactive Playground
   - modular init functions
   - event handlers, DOM updates, and custom form validation
*/

/* -------------------------
   Helpers / Utilities
   ------------------------- */
const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => Array.from(ctx.querySelectorAll(selector));

/* Small email regex for basic validation (not perfect but practical) */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* -------------------------
   App Initialization
   ------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  initCounterFeature();
  initThemeToggle();
  initDropdown();
  initFAQ();
  initFormValidation();
  initToggleBox();
  initColorChanger();
  initNotes();
});

/* -------------------------
   Part: Counter Feature
   - increment, decrement, double, reset on dblclick
   ------------------------- */
function initCounterFeature() {
  const display = $('#counter-display');
  const incBtn = $('#increment-btn');
  const decBtn = $('#decrement-btn');
  const doubleBtn = $('#double-btn');

  let value = 0;
  updateDisplay();

  function updateDisplay() {
    display.textContent = String(value);
    display.setAttribute('data-value', String(value));
  }

  incBtn.addEventListener('click', () => {
    value++;
    updateDisplay();
  });

  decBtn.addEventListener('click', () => {
    value--;
    updateDisplay();
  });

  doubleBtn.addEventListener('click', () => {
    value = value * 2;
    updateDisplay();
  });

  // Reset on double click of the display area
  display.addEventListener('dblclick', () => {
    value = 0;
    updateDisplay();
  });

  // Keyboard support: arrow up/down focus on display increments/decrements
  display.tabIndex = 0;
  display.addEventListener('keydown', (ev) => {
    if (ev.key === 'ArrowUp') {
      value++;
      updateDisplay();
      ev.preventDefault();
    } else if (ev.key === 'ArrowDown') {
      value--;
      updateDisplay();
      ev.preventDefault();
    }
  });
}

/* -------------------------
   Part: Theme Toggle (light/dark)
   - toggles .dark-theme on documentElement (or body)
   - stores preference in localStorage
   ------------------------- */
function initThemeToggle() {
  const modeBtn = $('#mode-btn') || $('#theme-toggle'); // support both ids
  if (!modeBtn) return;

  const root = document.documentElement; // toggling on root so CSS variables work
  const STORAGE_KEY = 'kai-theme';
  const saved = localStorage.getItem(STORAGE_KEY);

  // Initialize from saved preference
  if (saved === 'dark') {
    root.classList.add('dark-theme');
    modeBtn.setAttribute('aria-pressed', 'true');
  } else {
    root.classList.remove('dark-theme');
    modeBtn.setAttribute('aria-pressed', 'false');
  }

  modeBtn.addEventListener('click', () => {
    const isDark = root.classList.toggle('dark-theme');
    modeBtn.setAttribute('aria-pressed', String(isDark));
    localStorage.setItem(STORAGE_KEY, isDark ? 'dark' : 'light');
  });
}

/* -------------------------
   Part: Accessible Dropdown
   - toggles a simple list and allows keyboard navigation
   ------------------------- */
function initDropdown() {
  const toggle = $('#drop-toggle');
  const list = $('#drop-list');
  const selection = $('#drop-selection');

  if (!toggle || !list || !selection) return;

  // close helper
  function closeList() {
    list.classList.add('hidden');
    toggle.setAttribute('aria-expanded', 'false');
  }
  // open helper
  function openList() {
    list.classList.remove('hidden');
    toggle.setAttribute('aria-expanded', 'true');
  }

  // initial state: hidden
  closeList();

  toggle.addEventListener('click', () => {
    if (list.classList.contains('hidden')) openList();
    else closeList();
  });

  // Clicking an option sets the selection
  $$('.drop-item', list).forEach(btn => {
    btn.addEventListener('click', () => {
      const txt = btn.textContent.trim();
      selection.textContent = 'Selected: ' + txt;
      closeList();
      toggle.focus();
    });

    // keyboard: Enter/Space perform selection
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        btn.click();
      }
    });
  });

  // close on outside click
  document.addEventListener('click', (ev) => {
    if (!list.contains(ev.target) && ev.target !== toggle) {
      closeList();
    }
  });

  // close on Escape
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape') closeList();
  });
}

/* -------------------------
   Part: FAQ Accordion
   - toggles answers, maintains aria-expanded
   ------------------------- */
function initFAQ() {
  const qBtns = $$('.faq-question');
  qBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      // toggle the button aria and the next sibling answer
      btn.setAttribute('aria-expanded', String(!expanded));
      const answer = btn.nextElementSibling;
      if (!answer) return;
      if (expanded) {
        answer.classList.add('hidden');
      } else {
        answer.classList.remove('hidden');
      }
    });

    // keyboard accessibility: Enter/Space
    btn.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter' || ev.key === ' ') {
        ev.preventDefault();
        btn.click();
      }
    });
  });
}

/* -------------------------
   Part: Toggle Box (simple show/hide)
   - toggles class to show/hide element
   ------------------------- */
function initToggleBox() {
  const toggleBtn = $('#toggle-btn');
  const box = $('#toggle-box');
  if (!toggleBtn || !box) return;

  // initial state (hidden by default in HTML)
  toggleBtn.addEventListener('click', () => {
    box.classList.toggle('hidden');
    const pressed = !box.classList.contains('hidden');
    toggleBtn.setAttribute('aria-pressed', String(pressed));
  });
}

/* -------------------------
   Part: Color changer
   - small demo to change styles via JS
   ------------------------- */
function initColorChanger() {
  const btn = $('#color-btn');
  const text = $('#color-text');
  if (!btn || !text) return;

  // cycle through a few colors
  const colors = ['#0ea5e9', '#ffb020', '#34d399', '#fb7185'];
  let idx = 0;

  btn.addEventListener('click', () => {
    text.style.color = colors[idx];
    idx = (idx + 1) % colors.length;
  });
}

/* -------------------------
   Part: Notes / Dynamic Elements
   - create small notes appended to a container
   ------------------------- */
function initNotes() {
  const addBtn = $('#new-elem-btn');
  const container = $('#notes-container');
  if (!addBtn || !container) return;

  addBtn.addEventListener('click', () => {
    const note = document.createElement('div');
    note.className = 'note';
    const time = new Date().toLocaleTimeString();
    note.textContent = `Note at ${time} — practice makes perfect.`;
    // small remove button for each note
    const rm = document.createElement('button');
    rm.textContent = 'Remove';
    rm.style.marginLeft = '8px';
    rm.addEventListener('click', () => note.remove());
    note.appendChild(rm);
    container.appendChild(note);
  });
}

/* -------------------------
   Part: Form Validation (custom)
   - prevents default submit
   - validates fields and shows helpful errors
   ------------------------- */
function initFormValidation() {
  const form = $('#contact-form');
  if (!form) return;

  const nameInput = $('#input-name');
  const emailInput = $('#input-email');
  const passInput = $('#input-password');
  const confirmInput = $('#input-confirm');
  const ageInput = $('#input-age');
  const termsInput = $('#input-terms');

  const errName = $('#error-name');
  const errEmail = $('#error-email');
  const errPass = $('#error-password');
  const errConfirm = $('#error-confirm');
  const errAge = $('#error-age');
  const errTerms = $('#error-terms');
  const formMessage = $('#form-message');

  // reset errors helper
  function clearErrors() {
    [errName, errEmail, errPass, errConfirm, errAge, errTerms].forEach(el => {
      if (el) {
        el.textContent = '';
        el.style.display = 'none';
      }
    });
    if (formMessage) formMessage.textContent = '';
  }

  // show single error helper
  function showError(el, message) {
    if (!el) return;
    el.textContent = message;
    el.style.display = 'block';
  }

  // real-time validation for some fields (optional)
  emailInput.addEventListener('input', () => {
    if (EMAIL_RE.test(emailInput.value.trim())) {
      errEmail.textContent = '';
      errEmail.style.display = 'none';
    }
  });

  passInput.addEventListener('input', () => {
    if (passInput.value.length >= 8) {
      errPass.textContent = '';
      errPass.style.display = 'none';
    }
  });

  form.addEventListener('submit', (ev) => {
    ev.preventDefault(); // stop native submit
    clearErrors();

    let isValid = true;
    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passInput.value;
    const confirm = confirmInput.value;
    const ageVal = ageInput.value.trim();
    const age = ageVal === '' ? null : Number(ageVal);
    const termsAccepted = termsInput.checked;

    // Name validation
    if (name.length < 2) {
      isValid = false;
      showError(errName, 'Please enter your full name (at least 2 characters).');
    }

    // Email validation
    if (!EMAIL_RE.test(email)) {
      isValid = false;
      showError(errEmail, 'Please enter a valid email address.');
    }

    // Password validation
    if (password.length < 8) {
      isValid = false;
      showError(errPass, 'Password must be at least 8 characters.');
    }

    // Confirm validation
    if (confirm !== password) {
      isValid = false;
      showError(errConfirm, 'Passwords do not match.');
    }

    // Age validation (optional but if provided must be non-negative and reasonable)
    if (age !== null) {
      if (Number.isNaN(age) || age < 0 || age > 120) {
        isValid = false;
        showError(errAge, 'Please enter a valid age.');
      }
    }

    // Terms validation
    if (!termsAccepted) {
      isValid = false;
      showError(errTerms, 'You must agree to the terms to continue.');
    }

    if (!isValid) {
      formMessage.textContent = 'Please fix the errors above and try again.';
      formMessage.style.color = '#ef4444';
      return;
    }

    // If everything is valid, simulate successful submission
    formMessage.textContent = 'Form looks good — sending...';
    formMessage.style.color = '#16a34a';

    // Example: simulate async send then reset
    setTimeout(() => {
      formMessage.textContent = 'Message sent — thanks!';
      form.reset();
      // ensure errors cleared after success
      clearErrors();
    }, 700);
  });

  // Reset button handler to clear UI messages
  const resetBtn = $('#reset-btn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      clearErrors();
      if (formMessage) {
        formMessage.textContent = '';
      }
    });
  }
}

/* -------------------------
   Extra small utilities / graceful fallback
   ------------------------- */

// If any feature relies on an element that isn't present, 
// the corresponding init function returned early; this keeps the script safe to reuse.

// End of script.js
