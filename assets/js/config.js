/**
 * GU SENIORS '26 — site configuration
 *
 * Everything you need to fill in lives in this one file.
 * Anything left blank shows an orange "setup incomplete" banner on localhost
 * (never in production), so you can't ship it half-configured by accident.
 */

window.GU_CONFIG = {

  // -- REQUIRED ------------------------------------------------------------

  /** Apps Script web app URL. See backend/SETUP.md step 4. Ends in /exec */
  ORDERS_ENDPOINT: 'https://script.google.com/macros/s/AKfycbx22qT03_KS3pl-TArb27E7RwanwOa_XzExuCv1InrYJPSNXVMAJ7stIcNDbr5oGus3/exec',

  /**
   * WhatsApp number that receives payment screenshots.
   * International format, NO plus sign and NO leading zero.
   * Egyptian 01012345678  ->  '201012345678'
   */
  WHATSAPP_NUMBER: '201066828885',

  /** Human-readable order deadline shown across the site. */
  ORDER_DEADLINE: '',

  // -- PRODUCTS & PRICING --------------------------------------------------

  /**
   * Prices in EGP.
   *
   * `recommended: true` marks the tier the site pushes hardest — it renders
   * first, larger, with the accent border and a "Best value" badge.
   *
   * `items` drives the form: a tier containing 'jacket' asks for a jacket
   * size, one containing 'tshirt' asks for a t-shirt size and fit. Change the
   * items and the form follows automatically.
   *
   * The tote is bundle-only — it has no standalone price, so it never appears
   * as its own tier.
   */
  PRODUCTS: [
    {
      id: 'full-bundle',
      label: 'Full Bundle',
      tagline: 'Jacket + T-shirt + Tote bag',
      price: 1600,
      items: ['jacket', 'tshirt', 'tote'],
      recommended: true,
      perks: ['The varsity jacket, your name on the back',
              'Matching cream t-shirt',
              'Canvas tote bag with your faculty']
    },
    {
      id: 'bundle',
      label: 'Bundle',
      tagline: 'Jacket + T-shirt',
      price: 1400,
      items: ['jacket', 'tshirt'],
      perks: ['The varsity jacket, your name on the back',
              'Matching cream t-shirt']
    },
    {
      id: 'jacket',
      label: 'Jacket only',
      tagline: 'The varsity jacket',
      price: 1050,
      items: ['jacket'],
      perks: ['The varsity jacket, your name on the back']
    },
    {
      id: 'tshirt',
      label: 'T-shirt only',
      tagline: 'The cream tee',
      price: 650,
      items: ['tshirt'],
      perks: ['Cream t-shirt with the Galala calligraphy mark']
    }
  ],

  /**
   * Extra charged for the long-sleeve cut, which needs more fabric.
   * Applies only when the order includes a t-shirt AND the full-sleeve fit
   * is picked.
   */
  HIJABI_SURCHARGE: 75,

  /** Reference prices used to show honest "you save X" figures. */
  ALACARTE: { jacket: 1050, tshirt: 650 },

  // -- OPTIONAL ------------------------------------------------------------

  /** Instagram handle without the @ */
  INSTAGRAM: '',

  /** Faculties in the dropdown — also printed on the tote bag. */
  FACULTIES: [
    'Computer Science & Engineering',
    'Engineering',
    'Medicine',
    'Pharmacy',
    'Dentistry',
    'Physical Therapy',
    'Business',
    'Arts & Design',
    'Other'
  ],

  /**
   * Size charts, garment measured flat, in centimetres.
   *
   * ⚠️ THESE ARE PLACEHOLDER NUMBERS — invented, not measured.
   * Get the real ones from the manufacturer and set PLACEHOLDER to false.
   * While it's true the table renders with an orange dashed outline and a
   * warning, so nobody orders off fake numbers.
   */
  SIZES: {
    PLACEHOLDER: true,
    rows: [
      { size: 'S',   chest: 56, length: 66, sleeve: 58 },
      { size: 'M',   chest: 59, length: 68, sleeve: 60 },
      { size: 'L',   chest: 62, length: 70, sleeve: 62 },
      { size: 'XL',  chest: 65, length: 72, sleeve: 64 },
      { size: 'XXL', chest: 68, length: 74, sleeve: 66 }
    ]
  },

  /**
   * The big number on the back is always 26 (class of 2026) — confirmed, it is
   * not per-person. The field is hidden from the form and every order is
   * submitted as 26. Only the NAME is customised.
   */
  NUMBER_IS_CUSTOM: false,
  DEFAULT_NUMBER: '26'
};
