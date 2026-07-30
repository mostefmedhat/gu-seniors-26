/**
 * GU SENIORS '26 — site behaviour
 * No framework, no build step. Runs straight off GitHub Pages.
 */

(function () {
  'use strict';

  var CFG = window.GU_CONFIG || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // =========================================================== setup check

  var IS_DEV = ['localhost', '127.0.0.1', ''].indexOf(location.hostname) !== -1;

  /**
   * Warns about unfilled config.
   *
   * The banner is developer-facing, so it only renders on localhost — a live
   * visitor should never be told to go edit config.js. In production the same
   * warning goes to the console instead. The one warning that DOES stay visible
   * in production is the size-chart placeholder notice, because ordering a
   * non-returnable custom jacket off invented measurements costs real money.
   */
  function checkSetup() {
    var missing = [];
    if (!CFG.ORDERS_ENDPOINT) missing.push('ORDERS_ENDPOINT');
    if (!CFG.WHATSAPP_NUMBER) missing.push('WHATSAPP_NUMBER');
    if (!CFG.PRICE_EGP)       missing.push('PRICE_EGP');
    if (!CFG.ORDER_DEADLINE)  missing.push('ORDER_DEADLINE');
    if (CFG.SIZES && CFG.SIZES.PLACEHOLDER) missing.push('SIZES (still placeholder)');

    if (!missing.length) return;
    console.warn('[GU] Unconfigured:', missing);

    if (!IS_DEV) return;

    var banner = $('#setup-banner');
    banner.textContent = '⚠ SETUP INCOMPLETE (shown on localhost only) — fill these in assets/js/config.js: ' + missing.join(', ');
    banner.classList.add('is-visible');
  }

  // ================================================================ content

  /* Rather than render a bare "—" at visitors, unset values collapse the line
     they sit in. A missing price should read as "not announced yet", never as
     a broken page. */

  function fillPrice() {
    if (CFG.PRICE_EGP) {
      $$('[data-price]').forEach(function (el) {
        el.textContent = Number(CFG.PRICE_EGP).toLocaleString('en-EG') + ' EGP';
      });
    } else {
      $$('[data-price]').forEach(function (el) { el.textContent = 'the amount'; });
      var meta = $('#hero-meta');
      if (meta) meta.hidden = true;
    }
  }

  function fillDeadline() {
    if (CFG.ORDER_DEADLINE) {
      $$('[data-deadline]').forEach(function (el) { el.textContent = CFG.ORDER_DEADLINE; });
    } else {
      $$('[data-deadline-phrase]').forEach(function (el) { el.hidden = true; });
      $$('[data-deadline]').forEach(function (el) { el.textContent = 'soon'; });
    }
  }

  function fillInstagram() {
    if (!CFG.INSTAGRAM) return;
    $$('[data-instagram]').forEach(function (el) {
      el.href = 'https://instagram.com/' + CFG.INSTAGRAM;
      el.textContent = '@' + CFG.INSTAGRAM;
    });
  }

  function fillFaculties() {
    var sel = $('#faculty');
    if (!sel || !CFG.FACULTIES) return;
    CFG.FACULTIES.forEach(function (f) {
      var o = document.createElement('option');
      o.value = f;
      o.textContent = f;
      sel.appendChild(o);
    });
  }

  /** Duplicates the marquee content so the -50% translate loops seamlessly. */
  function buildMarquee() {
    var track = $('#marquee-track');
    if (!track) return;
    track.innerHTML += track.innerHTML;
  }

  // ============================================================= size table

  var unit = 'cm';

  function renderSizes() {
    var body = $('#size-body');
    if (!body || !CFG.SIZES) return;

    var toIn = function (cm) { return Math.round((cm / 2.54) * 10) / 10; };

    body.innerHTML = CFG.SIZES.rows.map(function (r) {
      var c = unit === 'cm' ? r.chest  : toIn(r.chest);
      var l = unit === 'cm' ? r.length : toIn(r.length);
      var s = unit === 'cm' ? r.sleeve : toIn(r.sleeve);
      return '<tr><td>' + r.size + '</td><td>' + c + '</td><td>' + l + '</td><td>' + s + '</td></tr>';
    }).join('');

    $$('[data-unit-label]').forEach(function (el) { el.textContent = '(' + unit + ')'; });

    if (CFG.SIZES.PLACEHOLDER) {
      var wrap = $('#size-table-wrap');
      wrap.classList.add('is-placeholder');
      $('#size-placeholder-note').hidden = false;
    }
  }

  function wireUnitToggle() {
    $$('[data-unit]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        unit = btn.dataset.unit;
        $$('[data-unit]').forEach(function (b) {
          b.setAttribute('aria-pressed', String(b.dataset.unit === unit));
        });
        renderSizes();
      });
    });
  }

  // =========================================================== view switch

  /**
   * Swaps the showcase stage between the rotating 3D model and a still photo.
   * The generated stills carry the back artwork far more sharply than the mesh
   * texture can, so Front/Back/Side are the honest way to show the print.
   */
  function wireViewSwitch() {
    var bar = $('#viewswitch');
    if (!bar) return;

    var canvas = $('#jacket-canvas');
    var still  = $('#stage-still');
    var hint   = $('#showcase-hint');

    $$('button', bar).forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('button', bar).forEach(function (b) { b.setAttribute('aria-selected', 'false'); });
        btn.setAttribute('aria-selected', 'true');

        var is3d = btn.dataset.view === '3d';

        // Never show the 3D chip as active if the model never loaded.
        if (is3d && canvas.style.display === 'none') return;

        canvas.hidden = !is3d;
        still.hidden  = is3d;
        hint.style.visibility = is3d ? 'visible' : 'hidden';

        if (!is3d) {
          still.src = btn.dataset.src;
          still.alt = btn.dataset.alt || '';
        }
      });
    });
  }

  // =================================================================== faq

  function wireFaq() {
    $$('.faq__q').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq__item');
        var open = item.classList.toggle('is-open');
        btn.setAttribute('aria-expanded', String(open));
        $('.faq__sign', btn).textContent = open ? '–' : '+';
      });
    });
  }

  // ========================================================== live preview

  function wirePreview() {
    var nameIn = $('#nameOnBack');
    var numIn  = $('#numberOnBack');
    var outNm  = $('#preview-name');
    var outNum = $('#preview-num');
    var counter = $('#name-counter');
    if (!nameIn || !outNm) return;

    function sync() {
      var v = nameIn.value.trim().toUpperCase();
      outNm.textContent = v || 'YOUR NAME';
      counter.textContent = nameIn.value.length + '/12';
      if (numIn && outNum) outNum.textContent = numIn.value.trim() || CFG.DEFAULT_NUMBER || '26';
    }

    nameIn.addEventListener('input', sync);
    if (numIn) numIn.addEventListener('input', sync);
    sync();
  }

  /** Hides the number field entirely when the back number isn't customisable. */
  function applyNumberPolicy() {
    if (CFG.NUMBER_IS_CUSTOM !== false) return;
    var f = $('#field-number');
    if (f) f.hidden = true;
  }

  // ================================================================== form

  var ERRORS = {
    BAD_NAME:            'Enter your full name.',
    BAD_PHONE:           'Use a valid Egyptian mobile, e.g. 01012345678.',
    BAD_SIZE:            'Pick a size.',
    BAD_PAYMENT:         'Pick a payment method.',
    BAD_NAME_ON_BACK:    'Enter the name for the back, 1–12 characters.',
    BAD_NUMBER_ON_BACK:  'Enter 1–2 digits.',
    CLOSED:              'Orders are closed. Follow us on Instagram for the next drop.',
    SERVER_ERROR:        'Something broke on our end. Try again in a minute.',
    NETWORK:             'Could not reach the server. Check your connection and try again.'
  };

  function clearErrors(form) {
    $$('.field', form).forEach(function (f) { f.classList.remove('has-error'); });
    $('#form-status').textContent = '';
  }

  function showError(code) {
    var msg = ERRORS[code] || ERRORS.SERVER_ERROR;
    $('#form-status').textContent = msg;

    var map = {
      BAD_NAME: 'field-fullName',
      BAD_PHONE: 'field-whatsapp',
      BAD_NAME_ON_BACK: 'field-nameOnBack',
      BAD_NUMBER_ON_BACK: 'field-number'
    };
    var f = map[code] && $('#' + map[code]);
    if (f) {
      f.classList.add('has-error');
      f.scrollIntoView({ behavior: 'smooth', block: 'center' });
      var input = $('input, select', f);
      if (input) input.focus({ preventScroll: true });
    }
  }

  /** Mirrors the server's rules so users get feedback without a round trip. */
  function validateLocal(data) {
    if (data.fullName.length < 2) return 'BAD_NAME';
    if (!/^01[0125][0-9]{8}$/.test(data.whatsapp.replace(/[^0-9]/g, '').replace(/^20/, '0')))
      return 'BAD_PHONE';
    if (!data.size) return 'BAD_SIZE';
    if (!data.paymentMethod) return 'BAD_PAYMENT';
    if (!data.nameOnBack || data.nameOnBack.length > 12) return 'BAD_NAME_ON_BACK';
    if (!/^[0-9]{1,2}$/.test(data.numberOnBack)) return 'BAD_NUMBER_ON_BACK';
    return null;
  }

  function collect(form) {
    var fd = new FormData(form);
    return {
      fullName:      (fd.get('fullName')      || '').trim(),
      whatsapp:      (fd.get('whatsapp')      || '').trim(),
      faculty:       (fd.get('faculty')       || '').trim(),
      nameOnBack:    (fd.get('nameOnBack')    || '').trim(),
      numberOnBack:  CFG.NUMBER_IS_CUSTOM === false
                       ? (CFG.DEFAULT_NUMBER || '26')
                       : (fd.get('numberOnBack') || '').trim(),
      size:          fd.get('size')          || '',
      paymentMethod: fd.get('paymentMethod') || '',
      notes:         (fd.get('notes')        || '').trim(),
      website:       (fd.get('website')      || '')   // honeypot
    };
  }

  function wireForm() {
    var form = $('#order-form');
    if (!form) return;

    var btn = $('#submit-btn');

    if (!CFG.ORDERS_ENDPOINT) {
      btn.disabled = true;
      btn.textContent = 'BACKEND NOT CONNECTED';
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors(form);

      var data = collect(form);
      var bad = validateLocal(data);
      if (bad) { showError(bad); return; }

      btn.disabled = true;
      btn.textContent = 'SENDING…';

      // text/plain keeps this a CORS "simple request" — Apps Script cannot
      // answer a preflight OPTIONS, so application/json would fail.
      fetch(CFG.ORDERS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json(); })
        .then(function (res) {
          if (res && res.ok) {
            showSuccess(res.orderNumber, data);
          } else {
            showError(res && res.error);
            btn.disabled = false;
            btn.textContent = 'PLACE ORDER';
          }
        })
        .catch(function (err) {
          console.error(err);
          showError('NETWORK');
          btn.disabled = false;
          btn.textContent = 'PLACE ORDER';
        });
    });
  }

  // =============================================================== success

  function showSuccess(orderNumber, data) {
    $('#order-form').classList.add('is-hidden');
    var panel = $('#success');
    panel.classList.add('is-visible');
    $('#success-number').textContent = orderNumber;

    var isCash = data.paymentMethod === 'Cash';

    var msg = isCash
      ? 'Hi! Order ' + orderNumber + ' — ' + data.fullName +
        ', size ' + data.size + '. I want to pay CASH, how do we arrange it?'
      : 'Hi! Order ' + orderNumber + ' — ' + data.fullName +
        ', size ' + data.size + '. Paying by ' + data.paymentMethod +
        '. Sending the payment screenshot now.';

    var wa = $('#wa-link');
    if (CFG.WHATSAPP_NUMBER) {
      wa.href = 'https://wa.me/' + CFG.WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    } else {
      wa.removeAttribute('href');
      wa.setAttribute('aria-disabled', 'true');
    }
    wa.textContent = isCash ? 'ARRANGE CASH ON WHATSAPP' : 'SEND PAYMENT PROOF ON WHATSAPP';

    // Cash orders have nothing to screenshot.
    $('#step-transfer').hidden = isCash;
    $('#step-screenshot').hidden = isCash;
    $('#step-cash').hidden = !isCash;

    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });

    $('#copy-btn').addEventListener('click', function () {
      navigator.clipboard.writeText(orderNumber).then(function () {
        var b = $('#copy-btn');
        b.textContent = 'COPIED';
        setTimeout(function () { b.textContent = 'COPY'; }, 1600);
      });
    });
  }

  // ================================================================== boot

  document.addEventListener('DOMContentLoaded', function () {
    checkSetup();
    fillPrice();
    fillDeadline();
    fillInstagram();
    fillFaculties();
    buildMarquee();
    renderSizes();
    wireUnitToggle();
    wireViewSwitch();
    wireFaq();
    applyNumberPolicy();
    wirePreview();
    wireForm();
    $('#year').textContent = new Date().getFullYear();
  });
})();
