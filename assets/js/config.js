/**
 * GU SENIORS '26 — site configuration
 *
 * Everything you need to fill in lives in this one file.
 * Anything left as an empty string shows an orange "setup incomplete" banner
 * at the top of the site, so you can't ship it half-configured by accident.
 */

window.GU_CONFIG = {

  // -- REQUIRED ------------------------------------------------------------

  /** Apps Script web app URL. See backend/SETUP.md step 4. Ends in /exec */
  ORDERS_ENDPOINT: '',

  /**
   * WhatsApp number that receives payment screenshots.
   * International format, NO plus sign and NO leading zero.
   * Egyptian 01012345678  ->  '201012345678'
   */
  WHATSAPP_NUMBER: '',

  /** Price in EGP, numbers only. e.g. 1450 */
  PRICE_EGP: null,

  /** Human-readable order deadline shown in the hero and FAQ. */
  ORDER_DEADLINE: '',

  // -- OPTIONAL ------------------------------------------------------------

  /** Instagram handle without the @ */
  INSTAGRAM: '',

  /** Faculties in the dropdown — trim or extend to match reality. */
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
   * Size chart. Garment measured flat, in centimetres.
   *
   * ⚠️ THESE ARE PLACEHOLDER NUMBERS — invented, not measured.
   * Get the real ones from the manufacturer and set PLACEHOLDER to false.
   * While it's true, the size table renders with an orange dashed outline
   * and a warning so nobody orders off fake numbers.
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
   * not per-person. The field is therefore hidden from the form and every
   * order is submitted as 26. Only the NAME is customised.
   */
  NUMBER_IS_CUSTOM: false,
  DEFAULT_NUMBER: '26'
};
