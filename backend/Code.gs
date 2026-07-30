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

  // Order numbers look like GU26-0001
  ORDER_PREFIX: 'GU26-',
  ORDER_PAD: 4,

  // Order number to start counting from (first order will be START + 1)
  ORDER_START: 0,

  // Set to false to close the drop. The site will show a "closed" message
  // instead of accepting orders.
  ACCEPTING_ORDERS: true,

  // Max characters allowed on the back of the jacket
  MAX_NAME_ON_BACK: 12,
  MAX_NUMBER_ON_BACK: 2,

  VALID_SIZES: ['S', 'M', 'L', 'XL', 'XXL'],
  VALID_PAYMENTS: ['InstaPay', 'Vodafone Cash', 'Cash']
};

var HEADERS = [
  'Order No',
  'Timestamp',
  'Full Name',
  'WhatsApp',
  'Faculty',
  'Name on Back',
  'Number on Back',
  'Size',
  'Payment Method',
  'Payment Status',
  'Notes'
];

// ---------------------------------------------------------------------------
// Web app entry points
// ---------------------------------------------------------------------------

/**
 * Health check + drop status. The site calls this on load so it can grey out
 * the form once ordering closes.
 */
function doGet() {
  return json({
    ok: true,
    acceptingOrders: CONFIG.ACCEPTING_ORDERS
  });
}

function doPost(e) {
  try {
    if (!CONFIG.ACCEPTING_ORDERS) {
      return json({ ok: false, error: 'CLOSED' });
    }

    var body = parseBody(e);

    // Honeypot: real users never fill this hidden field, bots do. Pretend it
    // worked so the bot doesn't retry, but write nothing.
    if (body.website) {
      return json({ ok: true, orderNumber: CONFIG.ORDER_PREFIX + '0000' });
    }

    var order = validate(body);
    if (order.error) {
      return json({ ok: false, error: order.error });
    }

    var saved = appendOrder(order.value);
    return json({ ok: true, orderNumber: saved.orderNumber });

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
      order.nameOnBack,
      order.numberOnBack,
      order.size,
      order.paymentMethod,
      'PENDING',
      order.notes
    ]);

    SpreadsheetApp.flush();
    return { orderNumber: orderNumber };

  } finally {
    lock.releaseLock();
  }
}

function validate(b) {
  var fullName = str(b.fullName);
  var whatsapp = normalizePhone(str(b.whatsapp));
  var size = str(b.size).toUpperCase();
  var payment = str(b.paymentMethod);
  var nameOnBack = str(b.nameOnBack);
  var numberOnBack = str(b.numberOnBack);

  if (fullName.length < 2) return { error: 'BAD_NAME' };
  if (!/^01[0125][0-9]{8}$/.test(whatsapp)) return { error: 'BAD_PHONE' };
  if (CONFIG.VALID_SIZES.indexOf(size) === -1) return { error: 'BAD_SIZE' };
  if (CONFIG.VALID_PAYMENTS.indexOf(payment) === -1) return { error: 'BAD_PAYMENT' };
  if (nameOnBack.length < 1 || nameOnBack.length > CONFIG.MAX_NAME_ON_BACK) {
    return { error: 'BAD_NAME_ON_BACK' };
  }
  if (!/^[0-9]{1,2}$/.test(numberOnBack)) return { error: 'BAD_NUMBER_ON_BACK' };

  return {
    value: {
      fullName: fullName.slice(0, 80),
      whatsapp: whatsapp,
      faculty: str(b.faculty).slice(0, 80),
      nameOnBack: nameOnBack.toUpperCase(),
      numberOnBack: numberOnBack,
      size: size,
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

  if (!sheet) {
    sheet = ss.insertSheet(CONFIG.SHEET_NAME);
  }

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length)
      .setFontWeight('bold')
      .setBackground('#16265C')
      .setFontColor('#FBF8F1');
    sheet.setFrozenRows(1);
    sheet.setColumnWidth(1, 110);
    sheet.setColumnWidth(2, 160);
    sheet.setColumnWidth(3, 200);
  }

  return sheet;
}

function parseBody(e) {
  if (e && e.postData && e.postData.contents) {
    return JSON.parse(e.postData.contents);
  }
  // Fallback for classic form-encoded posts
  return (e && e.parameter) || {};
}

/** Strips spaces/dashes and converts +20 / 0020 prefixes to local 01… form. */
function normalizePhone(p) {
  var d = p.replace(/[^0-9+]/g, '');
  d = d.replace(/^\+?20/, '0').replace(/^0020/, '0');
  if (d.length === 10 && d.charAt(0) === '1') d = '0' + d;
  return d;
}

function str(v) {
  return (v === null || v === undefined) ? '' : String(v).trim();
}

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
// Run this once from the editor to create the sheet + headers before deploying
// ---------------------------------------------------------------------------

function setup() {
  getSheet();
  Logger.log('Sheet ready. Counter is at: ' +
    (PropertiesService.getScriptProperties().getProperty('ORDER_COUNTER') || CONFIG.ORDER_START));
}
