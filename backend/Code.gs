/**
 * GU SENIORS '26 — order intake backend
 *
 * Google Apps Script bound to the orders spreadsheet.
 * Deployed as a Web App ("Execute as: Me", "Who has access: Anyone").
 *
 * The site POSTs JSON as text/plain so the browser treats it as a "simple
 * request" and skips the CORS preflight, which Apps Script cannot answer.
 * See SETUP.md.
 */

// ---------------------------------------------------------------------------
// CONFIG — edit these
// ---------------------------------------------------------------------------

var CONFIG = {
  SHEET_NAME: 'Orders',

  ORDER_PREFIX: 'GU26-',
  ORDER_PAD: 4,
  ORDER_START: 0,

  // Set to false to close the drop. The site reads this on load and swaps the
  // form for a "closed" panel.
  ACCEPTING_ORDERS: true,

  MAX_NAME_ON_BACK: 12,

  /**
   * Sizes actually manufactured, per garment. MUST match SIZES in
   * assets/js/config.js. The jacket and the regular tee are not made in S —
   * only the full-sleeve cut is.
   */
  VALID_SIZES: {
    jacket:        ['M', 'L', 'XL', '2XL'],
    tshirtRegular: ['M', 'L', 'XL', '2XL'],
    tshirtHijabi:  ['S', 'M', 'L', 'XL', '2XL']
  },

  VALID_PAYMENTS: ['InstaPay', 'Vodafone Cash', 'Cash'],
  VALID_FITS: ['Regular', 'Full sleeve'],

  /**
   * Prices in EGP. MUST match assets/js/config.js PRODUCTS.
   *
   * The total is recomputed here rather than trusted from the browser — the
   * client sends what it *chose*, never what it *costs*. Otherwise anyone
   * could edit the request and order the full bundle for 1 EGP.
   */
  PRODUCTS: {
    'full-bundle': { label: 'Full Bundle', price: 1600, items: ['jacket', 'tshirt', 'tote'] },
    'bundle':      { label: 'Bundle',      price: 1400, items: ['jacket', 'tshirt'] },
    'jacket':      { label: 'Jacket only', price: 1050, items: ['jacket'] },
    'tshirt':      { label: 'T-shirt only', price: 650, items: ['tshirt'] }
  },

  /** Extra for the long-sleeve cut — more fabric. */
  HIJABI_SURCHARGE: 75
};

var HEADERS = [
  'Order No',
  'Timestamp',
  'Full Name',
  'WhatsApp',
  'Faculty',
  'Product',
  'Total EGP',
  'Name on Back',
  'Number on Back',
  'Jacket Size',
  'T-shirt Size',
  'T-shirt Fit',
  'Payment Method',
  'Payment Status',
  'Notes'
];

// ---------------------------------------------------------------------------
// Web app entry points
// ---------------------------------------------------------------------------

function doGet() {
  return json({ ok: true, acceptingOrders: CONFIG.ACCEPTING_ORDERS });
}

function doPost(e) {
  try {
    if (!CONFIG.ACCEPTING_ORDERS) return json({ ok: false, error: 'CLOSED' });

    var body = parseBody(e);

    // Honeypot: real users never fill this hidden field, bots do. Pretend it
    // worked so the bot doesn't retry, but write nothing.
    if (body.website) {
      return json({ ok: true, orderNumber: CONFIG.ORDER_PREFIX + '0000', total: 0 });
    }

    var checked = validate(body);
    if (checked.error) return json({ ok: false, error: checked.error });

    var saved = appendOrder(checked.value);
    return json({ ok: true, orderNumber: saved.orderNumber, total: saved.total });

  } catch (err) {
    console.error(err);
    return json({ ok: false, error: 'SERVER_ERROR' });
  }
}

// ---------------------------------------------------------------------------
// Core
// ---------------------------------------------------------------------------

/**
 * Reserves the next order number and writes the row. Held under a script lock
 * so two people submitting at the same moment can't land on the same number.
 */
function appendOrder(order) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    var sheet = getSheet();
    var props = PropertiesService.getScriptProperties();

    var counter = Number(props.getProperty('ORDER_COUNTER') || CONFIG.ORDER_START) + 1;
    props.setProperty('ORDER_COUNTER', String(counter));

    var orderNumber = CONFIG.ORDER_PREFIX + padLeft(counter, CONFIG.ORDER_PAD);

    sheet.appendRow([
      orderNumber,
      new Date(),
      order.fullName,
      order.whatsapp,
      order.faculty,
      order.productLabel,
      order.total,
      order.nameOnBack,
      order.numberOnBack,
      order.jacketSize,
      order.tshirtSize,
      order.tshirtFit,
      order.paymentMethod,
      'PENDING',
      order.notes
    ]);

    SpreadsheetApp.flush();
    return { orderNumber: orderNumber, total: order.total };

  } finally {
    lock.releaseLock();
  }
}

function validate(b) {
  var fullName = str(b.fullName);
  var whatsapp = normalizePhone(str(b.whatsapp));
  var payment  = str(b.paymentMethod);

  if (fullName.length < 2) return { error: 'BAD_NAME' };
  if (!/^01[0125][0-9]{8}$/.test(whatsapp)) return { error: 'BAD_PHONE' };

  var product = CONFIG.PRODUCTS[str(b.product)];
  if (!product) return { error: 'BAD_PRODUCT' };

  var hasJacket = product.items.indexOf('jacket') !== -1;
  var hasTshirt = product.items.indexOf('tshirt') !== -1;

  var nameOnBack = '', numberOnBack = '', jacketSize = '';
  if (hasJacket) {
    nameOnBack   = str(b.nameOnBack);
    numberOnBack = str(b.numberOnBack);
    jacketSize   = str(b.jacketSize).toUpperCase();

    if (nameOnBack.length < 1 || nameOnBack.length > CONFIG.MAX_NAME_ON_BACK) {
      return { error: 'BAD_NAME_ON_BACK' };
    }
    if (!/^[0-9]{1,2}$/.test(numberOnBack)) return { error: 'BAD_NUMBER_ON_BACK' };
    if (CONFIG.VALID_SIZES.jacket.indexOf(jacketSize) === -1) return { error: 'BAD_JACKET_SIZE' };
  }

  var tshirtSize = '', tshirtFit = '';
  if (hasTshirt) {
    tshirtSize = str(b.tshirtSize).toUpperCase();
    tshirtFit  = str(b.tshirtFit);

    if (CONFIG.VALID_FITS.indexOf(tshirtFit) === -1) return { error: 'BAD_FIT' };

    // The size run depends on the fit — the regular tee has no S.
    var run = (tshirtFit === 'Full sleeve')
      ? CONFIG.VALID_SIZES.tshirtHijabi
      : CONFIG.VALID_SIZES.tshirtRegular;
    if (run.indexOf(tshirtSize) === -1) return { error: 'BAD_TSHIRT_SIZE' };
  }

  if (CONFIG.VALID_PAYMENTS.indexOf(payment) === -1) return { error: 'BAD_PAYMENT' };

  // Authoritative price — computed here, never taken from the request.
  var total = product.price;
  if (hasTshirt && tshirtFit === 'Full sleeve') total += CONFIG.HIJABI_SURCHARGE;

  return {
    value: {
      fullName: fullName.slice(0, 80),
      whatsapp: whatsapp,
      faculty: str(b.faculty).slice(0, 80),
      productLabel: product.label,
      total: total,
      nameOnBack: nameOnBack.toUpperCase(),
      numberOnBack: numberOnBack,
      jacketSize: jacketSize,
      tshirtSize: tshirtSize,
      tshirtFit: tshirtFit,
      paymentMethod: payment,
      notes: str(b.notes).slice(0, 500)
    }
  };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(CONFIG.SHEET_NAME);

  if (!sheet) sheet = ss.insertSheet(CONFIG.SHEET_NAME);

  // Write (or repair) the header row. Only safe to rewrite while the sheet
  // holds nothing but headers — once real orders exist, changing the columns
  // would silently misalign every existing row, so we leave it alone and warn.
  if (sheet.getLastRow() === 0) {
    writeHeaders(sheet);
  } else if (sheet.getLastRow() === 1) {
    var current = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].join('|');
    if (current !== HEADERS.join('|')) writeHeaders(sheet);
  } else {
    var cols = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].join('|');
    if (cols !== HEADERS.join('|')) {
      console.warn('Header mismatch and the sheet already holds orders. ' +
                   'Columns were NOT rewritten — migrate manually.');
    }
  }

  return sheet;
}

function writeHeaders(sheet) {
  sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
  sheet.getRange(1, 1, 1, HEADERS.length)
    .setFontWeight('bold')
    .setBackground('#16265C')
    .setFontColor('#FBF8F1');
  sheet.setFrozenRows(1);
  sheet.setColumnWidth(1, 110);
  sheet.setColumnWidth(2, 160);
  sheet.setColumnWidth(3, 200);
}

function parseBody(e) {
  if (e && e.postData && e.postData.contents) return JSON.parse(e.postData.contents);
  return (e && e.parameter) || {};
}

/** Strips spaces/dashes and converts +20 / 0020 prefixes to local 01… form. */
function normalizePhone(p) {
  var d = p.replace(/[^0-9+]/g, '');
  d = d.replace(/^\+?20/, '0').replace(/^0020/, '0');
  if (d.length === 10 && d.charAt(0) === '1') d = '0' + d;
  return d;
}

function str(v) { return (v === null || v === undefined) ? '' : String(v).trim(); }

function padLeft(n, width) {
  var s = String(n);
  while (s.length < width) s = '0' + s;
  return s;
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ---------------------------------------------------------------------------
// Run once from the editor to create/repair the sheet before deploying
// ---------------------------------------------------------------------------

function setup() {
  getSheet();
  Logger.log('Sheet ready. Counter is at: ' +
    (PropertiesService.getScriptProperties().getProperty('ORDER_COUNTER') || CONFIG.ORDER_START));
}
