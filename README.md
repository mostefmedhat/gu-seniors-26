# GU Seniors '26

Landing + order site for the Galala University Class of 2026 senior varsity
jacket drop.

Static site, hosted free on GitHub Pages. Orders land in a Google Sheet.
Payment proof is handled over WhatsApp — the site never touches money.

## Status

| Piece | State |
|---|---|
| Stitch design prompts | ✅ [`STITCH_PROMPTS.md`](STITCH_PROMPTS.md) |
| Stitch export folded in | ✅ `stitch-export/` |
| Frontend | ✅ [`index.html`](index.html) + `assets/` |
| Order backend (Apps Script) | ✅ [`backend/Code.gs`](backend/Code.gs) |
| Backend setup guide | ✅ [`backend/SETUP.md`](backend/SETUP.md) |
| Deploy guide | ✅ [`DEPLOY.md`](DEPLOY.md) |
| Ghost-mannequin product shots | ✅ `assets/images/product-*.jpg` |
| Back number fixed at 26 (not custom) | ✅ `NUMBER_IS_CUSTOM: false` |
| Free domain guide (DigitalPlat) | ✅ [`DEPLOY.md`](DEPLOY.md) §4 |
| 3D jacket model | ⚠️ front is good, back artwork bakes soft — see below |
| **Config values** (endpoint, WhatsApp, price, deadline) | ⛔ **you** — `assets/js/config.js` |
| **Size chart numbers** | ⛔ **you** — still placeholders |
| GitHub Pages deploy | ⛔ **you** — see [`DEPLOY.md`](DEPLOY.md) |

### Known limitation: 3D back artwork

Image-to-3D bakes a single texture atlas across the whole garment, so the back
print only receives a few hundred pixels and the lettering smears. There is no
texture-resolution parameter exposed by the model, so this cannot simply be
turned up.

If the back still reads poorly, clamp the viewer's rotation in
`assets/js/viewer.js` so visitors orbit the front three-quarters only:

```js
controls.minAzimuthAngle = -Math.PI / 2.6;
controls.maxAzimuthAngle =  Math.PI / 2.6;
```

The real back is already shown as a photograph in the lookbook section, which is
sharper than any generated mesh will be.

Run it locally:

```bash
python -m http.server 5173 --directory D:/GU_Seniors_26
```

## Stack

- Plain HTML/CSS/JS — no build step, no framework. GitHub Pages serves it as-is.
- [three.js](https://threejs.org/) for the drag-to-rotate 3D jacket.
- Google Apps Script + Google Sheets for order intake.
- `wa.me` deep links for payment proof.

## Layout

```
assets/
  images/     product + lookbook photos
  3d/         jacket .glb model and its texture
  js/         config.js (endpoints), main.js, viewer.js
  css/
backend/
  Code.gs     Apps Script — paste into the sheet's script editor
  SETUP.md    step-by-step deploy guide
index.html
admin.html    embedded orders sheet (see the privacy note in SETUP.md)
```

## What still needs a human

1. **Photos** — drop the shoot images into `assets/images/`.
2. **Measurements** — real chest / length / sleeve in cm per size.
3. **Price** and order deadline.
4. **WhatsApp number** and Instagram handle for the footer.
5. A **GitHub account** to host under.

---

Not an official Galala University store.
