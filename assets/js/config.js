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
  WHATSAPP_NUMBER: '201145051525',

  /**
   * Where buyers actually send the money.
   *
   * ⚠️ While PLACEHOLDER is true the site does NOT print these digits. It tells
   * buyers the details will come on WhatsApp instead. That is deliberate — a
   * plausible-looking but wrong number on a live page means someone transfers
   * real money to a stranger, and you will never get it back.
   *
   * Put the real numbers in, set PLACEHOLDER to false, and they appear on the
   * success screen and in the FAQ automatically.
   */
  PAYMENT: {
    PLACEHOLDER: false,

    /** Same mobile number takes both InstaPay and Vodafone Cash transfers. */
    instapay: '01023211896',
    vodafoneCash: '01023211896',

    /** InstaPay payment address — easier to get right than typing digits. */
    instapayAddress: 'gu.seniors@instapay',

    /**
     * InstaPay QR. Save the QR picture to this path.
     * If the file is missing the QR block hides itself rather than showing a
     * broken image, so the number and address still work on their own.
     */
    qr: 'assets/images/qr-pay.png'
  },


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
  INSTAGRAM: 'med_seniors_2026',

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
   * Real size charts from the manufacturer. Garment measured flat, in cm.
   *
   * Each garment carries its OWN size list — the jacket and the regular tee
   * are not made in S, only the hijabi cut is. The order form builds its size
   * buttons from these arrays, so a size that doesn't exist here can never be
   * ordered.
   *
   * `width` is across the chest laid flat; `length` is shoulder to hem.
   */
  SIZES: {
    PLACEHOLDER: false,

    jacket: {
      label: 'Jacket',
      rows: [
        { size: 'M',   width: 61, length: 67 },
        { size: 'L',   width: 63, length: 67 },
        { size: 'XL',  width: 65, length: 68 },
        { size: '2XL', width: 67, length: 68 }
      ]
    },

    tshirtRegular: {
      label: 'T-shirt',
      rows: [
        { size: 'M',   width: 54, length: 67 },
        { size: 'L',   width: 56, length: 67 },
        { size: 'XL',  width: 58, length: 69 },
        { size: '2XL', width: 60, length: 69 }
      ]
    },

    /* The long-sleeve cut is a different garment with its own grading, and the
       manufacturer supplies a body-weight guide for it. */
    tshirtHijabi: {
      label: 'T-shirt · full sleeve',
      hasWeight: true,
      rows: [
        { size: 'S',   width: 54, length: 68, weight: '35–45' },
        { size: 'M',   width: 56, length: 71, weight: '45–55' },
        { size: 'L',   width: 58, length: 73, weight: '55–65' },
        { size: 'XL',  width: 60, length: 76, weight: '65–80' },
        { size: '2XL', width: 62, length: 78, weight: '80–100' }
      ]
    }
  },

  /**
   * The big number on the back is always 26 (class of 2026) — confirmed, it is
   * not per-person. The field is hidden from the form and every order is
   * submitted as 26. Only the NAME is customised.
   */
  NUMBER_IS_CUSTOM: false,
  DEFAULT_NUMBER: '26'
};
