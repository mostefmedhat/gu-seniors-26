/**
 * GU SENIORS '26 — site behaviour
 * No framework, no build step. Runs straight off GitHub Pages.
 */

(function () {
  'use strict';

  var CFG = window.GU_CONFIG || {};
  var $  = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var IS_DEV = ['localhost', '127.0.0.1', ''].indexOf(location.hostname) !== -1;

  var EGP = function (n) { return Number(n).toLocaleString('en-EG') + ' EGP'; };

  /** The tier object the visitor currently has selected, or null. */
  var chosen = null;

  // =========================================================== setup check

  /**
   * Warns about unfilled config.
   *
   * The banner is developer-facing, so it only renders on localhost — a live
   * visitor should never be told to go edit config.js. In production the same
   * warning goes to the console instead. The one warning that DOES stay visible
   * in production is the size-chart placeholder notice, because ordering a
   * non-returnable custom garment off invented measurements costs real money.
   */
  function checkSetup() {
    var missing = [];
    if (!CFG.ORDERS_ENDPOINT) missing.push('ORDERS_ENDPOINT');
    if (!CFG.WHATSAPP_NUMBER) missing.push('WHATSAPP_NUMBER');
    if (!CFG.PRODUCTS || !CFG.PRODUCTS.length) missing.push('PRODUCTS');
    if (CFG.SIZES && CFG.SIZES.PLACEHOLDER) missing.push('SIZES (still placeholder)');

    if (!missing.length) return;
    console.warn('[GU] Unconfigured:', missing);

    if (!IS_DEV) return;
    var banner = $('#setup-banner');
    banner.textContent = '⚠ SETUP INCOMPLETE (localhost only) — fill these in assets/js/config.js: ' + missing.join(', ');
    banner.classList.add('is-visible');
  }

  // ================================================================ content

  function fillPriceFrom() {
    if (!CFG.PRODUCTS || !CFG.PRODUCTS.length) return;
    var lowest = Math.min.apply(null, CFG.PRODUCTS.map(function (p) { return p.price; }));
    $$('[data-price-from]').forEach(function (el) { el.textContent = EGP(lowest); });
  }

  function fillSurcharge() {
    $$('[data-surcharge]').forEach(function (el) { el.textContent = CFG.HIJABI_SURCHARGE; });
  }

  /** Fills any element tagged with a product id, e.g. data-product-price="tshirt". */
  function fillProductPrices() {
    if (!CFG.PRODUCTS) return;
    $$('[data-product-price]').forEach(function (el) {
      var t = CFG.PRODUCTS.filter(function (p) { return p.id === el.dataset.productPrice; })[0];
      if (t) el.textContent = EGP(t.price);
    });
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

  function buildMarquee() {
    var track = $('#marquee-track');
    if (!track) return;
    track.innerHTML += track.innerHTML;
  }

  // ======================================================= pricing helpers

  var THUMBS = {
    jacket: { src: 'assets/images/product-front.jpg',      alt: 'Varsity jacket' },
    tshirt: { src: 'assets/images/tshirt.jpg',             alt: 'Cream t-shirt' },
    tote:   { src: 'assets/images/totebag.jpg',            alt: 'Canvas tote bag' }
  };

  /**
   * What a tier would cost bought piece by piece, using only items that
   * actually have a standalone price. The tote has none — it is bundle-only —
   * so it is simply left out rather than guessed at.
   */
  function alacarteValue(tier) {
    var a = CFG.ALACARTE || {};
    return tier.items.reduce(function (sum, item) { return sum + (a[item] || 0); }, 0);
  }

  function savingFor(tier) {
    var full = alacarteValue(tier);
    return full > tier.price ? full - tier.price : 0;
  }

  function escapeHtml(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  // ========================================================= pricing tiers

  function renderTiers() {
    var wrap = $('#tiers');
    if (!wrap || !CFG.PRODUCTS) return;

    wrap.innerHTML = CFG.PRODUCTS.map(function (t) {
      var saving = savingFor(t);
      var full   = alacarteValue(t);
      var hasTote = t.items.indexOf('tote') !== -1;

      var thumbs = t.items.map(function (i) {
        var th = THUMBS[i];
        return th ? '<img src="' + th.src + '" alt="' + th.alt + '" width="52" height="52" loading="lazy">' : '';
      }).join('');

      var perks = (t.perks || []).map(function (p) {
        return '<li>' + escapeHtml(p) + '</li>';
      }).join('');

      return '' +
        '<article class="tier' + (t.recommended ? ' tier--recommended' : '') + '">' +
          (t.recommended ? '<span class="tier__badge">Best value</span>' : '') +
          '<div class="tier__thumbs">' + thumbs + '</div>' +
          '<h3 class="tier__name">' + escapeHtml(t.label) + '</h3>' +
          '<p class="tier__tagline">' + escapeHtml(t.tagline) + '</p>' +
          '<div class="tier__price">' + Number(t.price).toLocaleString('en-EG') + '<small>EGP</small></div>' +
          (saving
            ? '<div class="tier__was">' + EGP(full) + ' separately</div>' +
              '<span class="tier__save">Save ' + Number(saving).toLocaleString('en-EG') + ' EGP' +
              (hasTote ? ' + free tote' : '') + '</span>'
            : '') +
          '<ul class="tier__perks">' + perks + '</ul>' +
          '<a class="btn ' + (t.recommended ? 'btn--turf' : 'btn--navy') + '" href="#order" ' +
             'data-pick="' + t.id + '">Choose this</a>' +
        '</article>';
    }).join('');

    // Clicking a tier's button jumps to the form with that option pre-selected.
    $$('[data-pick]', wrap).forEach(function (a) {
      a.addEventListener('click', function () {
        var input = $('#product-' + a.dataset.pick);
        if (input) { input.checked = true; onProductChange(); }
      });
    });
  }

  // ======================================================== product picker

  function renderProductPicker() {
    var wrap = $('#product-picker');
    if (!wrap || !CFG.PRODUCTS) return;

    wrap.innerHTML = CFG.PRODUCTS.map(function (t) {
      return '' +
        '<input type="radio" id="product-' + t.id + '" name="product" value="' + t.id + '">' +
        '<label for="product-' + t.id + '">' +
          '<span class="pp__main">' +
            '<span class="pp__name">' + escapeHtml(t.label) +
              (t.recommended ? '<span class="pp__flag">Best value</span>' : '') +
            '</span>' +
            '<span class="pp__sub">' + escapeHtml(t.tagline) + '</span>' +
          '</span>' +
          '<span class="pp__price">' + Number(t.price).toLocaleString('en-EG') + '</span>' +
        '</label>';
    }).join('');

    $$('input[name="product"]', wrap).forEach(function (i) {
      i.addEventListener('change', onProductChange);
    });
  }

  /** Shows only the blocks the chosen option needs, then re-totals. */
  function onProductChange() {
    var sel = $('input[name="product"]:checked');
    chosen = sel ? CFG.PRODUCTS.filter(function (p) { return p.id === sel.value; })[0] : null;

    var hasJacket = !!chosen && chosen.items.indexOf('jacket') !== -1;
    var hasTshirt = !!chosen && chosen.items.indexOf('tshirt') !== -1;

    $('#jacket-block').hidden = !hasJacket;
    $('#tshirt-block').hidden = !hasTshirt;
    $('#product-error').style.display = 'none';

    updateTotal();
  }

  function currentFit() {
    var f = $('input[name="tshirtFit"]:checked');
    return f ? f.value : 'Regular';
  }

  /** Single source of truth for what an order costs, mirrored server-side. */
  function orderTotal() {
    if (!chosen) return null;
    var total = chosen.price;
    var hasTshirt = chosen.items.indexOf('tshirt') !== -1;
    if (hasTshirt && currentFit() === 'Full sleeve') total += (CFG.HIJABI_SURCHARGE || 0);
    return total;
  }

  function updateTotal() {
    var valueEl = $('#total-value');
    var breakEl = $('#total-breakdown');
    if (!valueEl) return;

    var total = orderTotal();
    if (total === null) {
      valueEl.textContent = '—';
      breakEl.textContent = 'Pick an option above.';
      return;
    }

    valueEl.textContent = EGP(total);

    var parts = [chosen.label + ' ' + Number(chosen.price).toLocaleString('en-EG')];
    if (chosen.items.indexOf('tshirt') !== -1 && currentFit() === 'Full sleeve') {
      parts.push('full-sleeve fit +' + CFG.HIJABI_SURCHARGE);
    }
    breakEl.textContent = parts.join('  ·  ');
  }

  // ============================================================= size table

  var unit = 'cm';
  var garment = 'jacket';

  var GARMENT_FIGURE = {
    jacket:        { src: 'assets/images/product-front.jpg',      alt: 'The jacket, used as the measurement reference.' },
    tshirtRegular: { src: 'assets/images/tshirt.jpg',             alt: 'The t-shirt, used as the measurement reference.' },
    tshirtHijabi:  { src: 'assets/images/tshirt-fullsleeve.jpg',  alt: 'The full-sleeve t-shirt, used as the measurement reference.' }
  };

  var toIn = function (cm) { return Math.round((cm / 2.54) * 10) / 10; };

  function renderSizes() {
    var head = $('#size-head');
    var body = $('#size-body');
    var chart = CFG.SIZES && CFG.SIZES[garment];
    if (!head || !body || !chart) return;

    var u = '<span data-unit-label>(' + unit + ')</span>';
    head.innerHTML =
      '<th scope="col">Size</th>' +
      '<th scope="col">W Width ' + u + '</th>' +
      '<th scope="col">L Length ' + u + '</th>' +
      (chart.hasWeight ? '<th scope="col">Body weight (kg)</th>' : '');

    body.innerHTML = chart.rows.map(function (r) {
      var w = unit === 'cm' ? r.width  : toIn(r.width);
      var l = unit === 'cm' ? r.length : toIn(r.length);
      return '<tr><td>' + r.size + '</td><td>' + w + '</td><td>' + l + '</td>' +
             (chart.hasWeight ? '<td>' + (r.weight || '—') + '</td>' : '') + '</tr>';
    }).join('');

    var fig = $('#size-figure');
    var meta = GARMENT_FIGURE[garment];
    if (fig && meta) { fig.src = meta.src; fig.alt = meta.alt; }

    // Say plainly which sizes this garment isn't made in, rather than letting
    // someone hunt for an S that was never an option.
    var nos = $('#size-nos');
    var have = chart.rows.map(function (r) { return r.size; });
    var missing = ['S', 'M', 'L', 'XL', '2XL'].filter(function (s) { return have.indexOf(s) === -1; });
    if (missing.length) {
      nos.hidden = false;
      nos.innerHTML = '<strong>Not made in ' + missing.join(', ') + '.</strong> ' +
                      chart.label + ' runs ' + have[0] + '–' + have[have.length - 1] + '.';
    } else {
      nos.hidden = true;
    }

    if (CFG.SIZES.PLACEHOLDER) {
      $('#size-table-wrap').classList.add('is-placeholder');
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

  function wireGarmentTabs() {
    var bar = $('#garment-tabs');
    if (!bar) return;
    $$('button', bar).forEach(function (btn) {
      btn.addEventListener('click', function () {
        garment = btn.dataset.garment;
        $$('button', bar).forEach(function (b) {
          b.setAttribute('aria-selected', String(b.dataset.garment === garment));
        });
        renderSizes();
      });
    });
  }

  // ========================================================== size pickers

  /**
   * Builds the size buttons from the chart for that garment, so the form can
   * only ever offer sizes that are actually manufactured.
   * Keeps the current choice selected if it still exists in the new set.
   */
  function renderSizePicker(wrapId, inputName, chart) {
    var wrap = $('#' + wrapId);
    if (!wrap || !chart) return;

    var previous = (($('input[name="' + inputName + '"]:checked') || {}).value) || '';

    wrap.innerHTML = chart.rows.map(function (r, i) {
      var id = wrapId + '-' + i;
      return '<input type="radio" id="' + id + '" name="' + inputName + '" value="' + r.size + '"' +
             (r.size === previous ? ' checked' : '') + '>' +
             '<label for="' + id + '">' + r.size + '</label>';
    }).join('');
  }

  function renderJacketSizes() {
    renderSizePicker('jacket-size-picker', 'jacketSize', CFG.SIZES && CFG.SIZES.jacket);
  }

  /** The regular tee and the full-sleeve cut have different size runs. */
  function renderTshirtSizes() {
    var hijabi = currentFit() === 'Full sleeve';
    var chart  = CFG.SIZES && (hijabi ? CFG.SIZES.tshirtHijabi : CFG.SIZES.tshirtRegular);
    renderSizePicker('tshirt-size-picker', 'tshirtSize', chart);

    var hint = $('#tshirt-size-hint');
    if (hint && chart) {
      hint.textContent = hijabi
        ? 'The full-sleeve cut has its own chart and does come in S.'
        : 'The regular tee starts at M.';
    }
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
        if (is3d && canvas.style.display === 'none') return;  // model never loaded

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
      outNm.textContent = nameIn.value.trim().toUpperCase() || 'YOUR NAME';
      counter.textContent = nameIn.value.length + '/12';
      if (numIn && outNum) outNum.textContent = numIn.value.trim() || CFG.DEFAULT_NUMBER || '26';
    }

    nameIn.addEventListener('input', sync);
    if (numIn) numIn.addEventListener('input', sync);
    sync();
  }

  function applyNumberPolicy() {
    if (CFG.NUMBER_IS_CUSTOM !== false) return;
    var f = $('#field-number');
    if (f) f.hidden = true;
  }

  // ================================================================== form

  var ERRORS = {
    BAD_NAME:            'Enter your full name.',
    BAD_PHONE:           'Use a valid Egyptian mobile, e.g. 01012345678.',
    BAD_PRODUCT:         'Pick what you want to order.',
    BAD_JACKET_SIZE:     'Pick a jacket size.',
    BAD_TSHIRT_SIZE:     'Pick a t-shirt size.',
    BAD_FIT:             'Pick a t-shirt fit.',
    BAD_PAYMENT:         'Pick a payment method.',
    BAD_NAME_ON_BACK:    'Enter the name for the back, 1–12 characters.',
    BAD_NUMBER_ON_BACK:  'Enter 1–2 digits.',
    CLOSED:              'Orders are closed. Follow us on Instagram for the next drop.',
    SERVER_ERROR:        'Something broke on our end. Try again in a minute.',
    NETWORK:             'Could not reach the server. Check your connection and try again.'
  };

  function clearErrors(form) {
    $$('.field', form).forEach(function (f) { f.classList.remove('has-error'); });
    $('#product-error').style.display = 'none';
    $('#form-status').textContent = '';
  }

  function showError(code) {
    $('#form-status').textContent = ERRORS[code] || ERRORS.SERVER_ERROR;

    if (code === 'BAD_PRODUCT') {
      var pe = $('#product-error');
      pe.style.display = 'block';
      pe.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    var map = {
      BAD_NAME: 'field-fullName',
      BAD_PHONE: 'field-whatsapp',
      BAD_NAME_ON_BACK: 'field-nameOnBack',
      BAD_NUMBER_ON_BACK: 'field-number',
      BAD_JACKET_SIZE: 'field-jacketSize',
      BAD_TSHIRT_SIZE: 'field-tshirtSize'
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
  function validateLocal(d) {
    if (d.fullName.length < 2) return 'BAD_NAME';
    if (!/^01[0125][0-9]{8}$/.test(d.whatsapp.replace(/[^0-9]/g, '').replace(/^20/, '0')))
      return 'BAD_PHONE';
    if (!chosen) return 'BAD_PRODUCT';

    if (chosen.items.indexOf('jacket') !== -1) {
      if (!d.nameOnBack || d.nameOnBack.length > 12) return 'BAD_NAME_ON_BACK';
      if (!/^[0-9]{1,2}$/.test(d.numberOnBack))      return 'BAD_NUMBER_ON_BACK';
      if (!d.jacketSize)                              return 'BAD_JACKET_SIZE';
    }
    if (chosen.items.indexOf('tshirt') !== -1) {
      if (!d.tshirtSize) return 'BAD_TSHIRT_SIZE';
      if (!d.tshirtFit)  return 'BAD_FIT';
    }
    if (!d.paymentMethod) return 'BAD_PAYMENT';
    return null;
  }

  function collect(form) {
    var fd = new FormData(form);
    var hasJacket = chosen && chosen.items.indexOf('jacket') !== -1;
    var hasTshirt = chosen && chosen.items.indexOf('tshirt') !== -1;

    return {
      fullName:      (fd.get('fullName') || '').trim(),
      whatsapp:      (fd.get('whatsapp') || '').trim(),
      faculty:       (fd.get('faculty')  || '').trim(),

      product:       chosen ? chosen.id : '',
      productLabel:  chosen ? chosen.label : '',

      nameOnBack:    hasJacket ? (fd.get('nameOnBack') || '').trim() : '',
      numberOnBack:  hasJacket
                       ? (CFG.NUMBER_IS_CUSTOM === false
                            ? (CFG.DEFAULT_NUMBER || '26')
                            : (fd.get('numberOnBack') || '').trim())
                       : '',
      jacketSize:    hasJacket ? (fd.get('jacketSize') || '') : '',

      tshirtSize:    hasTshirt ? (fd.get('tshirtSize') || '') : '',
      tshirtFit:     hasTshirt ? (fd.get('tshirtFit')  || '') : '',

      paymentMethod: fd.get('paymentMethod') || '',
      notes:         (fd.get('notes') || '').trim(),
      website:       (fd.get('website') || '')   // honeypot
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

    // Switching fit swaps the whole size run, not just the price.
    $$('input[name="tshirtFit"]').forEach(function (i) {
      i.addEventListener('change', function () {
        renderTshirtSizes();
        updateTotal();
      });
    });

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
            showSuccess(res.orderNumber, data, res.total);
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

  function showSuccess(orderNumber, data, serverTotal) {
    $('#order-form').classList.add('is-hidden');
    var panel = $('#success');
    panel.classList.add('is-visible');
    $('#success-number').textContent = orderNumber;

    // Trust the server's figure — it is the one the sheet recorded.
    var total = (typeof serverTotal === 'number') ? serverTotal : orderTotal();
    $('#success-total').textContent = total ? EGP(total) : 'the amount';

    var isCash = data.paymentMethod === 'Cash';

    var bits = [data.productLabel];
    if (data.jacketSize) bits.push('jacket ' + data.jacketSize);
    if (data.tshirtSize) bits.push('t-shirt ' + data.tshirtSize + ' ' + data.tshirtFit.toLowerCase());

    var msg = isCash
      ? 'Hi! Order ' + orderNumber + ' — ' + data.fullName + '. ' + bits.join(', ') +
        '. Total ' + EGP(total) + '. I want to pay CASH, how do we arrange it?'
      : 'Hi! Order ' + orderNumber + ' — ' + data.fullName + '. ' + bits.join(', ') +
        '. Total ' + EGP(total) + '. Paying by ' + data.paymentMethod +
        '. Sending the payment screenshot now.';

    var wa = $('#wa-link');
    if (CFG.WHATSAPP_NUMBER) {
      wa.href = 'https://wa.me/' + CFG.WHATSAPP_NUMBER + '?text=' + encodeURIComponent(msg);
    } else {
      wa.removeAttribute('href');
      wa.setAttribute('aria-disabled', 'true');
    }
    wa.textContent = isCash ? 'ARRANGE CASH ON WHATSAPP' : 'SEND PAYMENT PROOF ON WHATSAPP';

    $('#step-transfer').hidden   = isCash;
    $('#step-screenshot').hidden = isCash;
    $('#step-cash').hidden       = !isCash;

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
    fillPriceFrom();
    fillSurcharge();
    fillProductPrices();
    fillInstagram();
    fillFaculties();
    buildMarquee();
    renderTiers();
    renderProductPicker();
    renderSizes();
    renderJacketSizes();
    renderTshirtSizes();
    wireUnitToggle();
    wireGarmentTabs();
    wireViewSwitch();
    wireFaq();
    applyNumberPolicy();
    wirePreview();
    wireForm();
    onProductChange();          // collapse both blocks until something is picked
    $('#year').textContent = new Date().getFullYear();
  });
})();
