# Order backend — setup

~15 minutes. Do this once. Your friend should own the spreadsheet, not you,
so the orders stay theirs if you hand the project over.

---

## 1. Create the spreadsheet

1. Go to <https://sheets.new> **while logged into the account that should own
   the orders**.
2. Rename it `GU Seniors 26 — Orders`.

## 2. Add the script

1. In that sheet: **Extensions → Apps Script**.
2. Delete the placeholder `function myFunction() {}`.
3. Paste the entire contents of [`Code.gs`](Code.gs).
4. Edit the `CONFIG` block at the top if you want a different order-number
   prefix or starting number. The defaults are fine.
5. Save (Ctrl+S).

## 3. Initialise

1. In the function dropdown at the top, pick **`setup`**, then hit **Run**.
2. Google will ask for authorisation the first time. Click through
   *Advanced → Go to (project name)* → *Allow*. This warning is normal for
   your own scripts; it appears because the script isn't Google-verified.
3. Switch back to the sheet — you should now see an `Orders` tab with a navy
   header row.

## 4. Deploy as a web app

1. Back in Apps Script: **Deploy → New deployment**.
2. Click the gear next to "Select type" → **Web app**.
3. Set:
   - **Description:** `orders v1`
   - **Execute as:** `Me`
   - **Who has access:** `Anyone`
4. **Deploy**, then copy the **Web app URL**. It looks like:
   `https://script.google.com/macros/s/AKfycb..../exec`
5. Paste that URL into the site's `assets/js/config.js` as `ORDERS_ENDPOINT`.

> ⚠️ "Who has access: Anyone" means anyone can POST to this URL. That's
> required for a public form. The script only ever appends rows — it can't read
> or return existing orders, so nobody can pull the order list out of it.

### Re-deploying after you edit the script

Editing `Code.gs` does **not** update the live URL. You must do
**Deploy → Manage deployments → (pencil icon) → Version: New version → Deploy**.
Keep editing the *same* deployment so the URL never changes.

---

## 5. Closing the drop

When orders close, set `ACCEPTING_ORDERS: false` in `CONFIG`, then re-deploy a
new version as above. The site reads this on page load and swaps the form for a
"orders are closed" panel.

---

## 6. How the payment flow hangs together

```
  User fills form
        │
        ▼
  POST → Apps Script ──► appends row to Sheet, status = PENDING
        │                returns { orderNumber: "GU26-0042" }
        ▼
  Success screen shows GU26-0042
        │
        ▼
  "SEND PAYMENT PROOF ON WHATSAPP" button
        │  opens wa.me/20XXXXXXXXXX with a pre-typed message
        ▼
  User attaches the InstaPay / VF Cash screenshot in WhatsApp
        │
        ▼
  Your friend flips Payment Status to PAID in the sheet
```

The site never touches money and never receives a screenshot — it only hands
the user a number and pushes them into WhatsApp. That keeps you clear of
payment handling entirely, which is what you want for a side project.

**Cash orders** get the same order number; the WhatsApp message just says
"paying cash" instead, and your friend arranges collection.

### The WhatsApp link

```
https://wa.me/<number>?text=<url-encoded message>
```

- `<number>` is international format, **no `+` and no leading zero**:
  Egyptian `01012345678` → `201012345678`.
- Put your friend's number in `assets/js/config.js` as `WHATSAPP_NUMBER`.
- wa.me can pre-fill text but **cannot** attach the screenshot — the user does
  that themselves in WhatsApp. The success screen spells that out in three
  numbered steps so nobody gets confused.

---

## 7. Tracking payments in the sheet

Add a filter view on `Payment Status` so your friend can see PENDING vs PAID at
a glance. Optional but recommended — in the sheet:

**Format → Conditional formatting →** on column J:
- Text is exactly `PENDING` → orange background
- Text is exactly `PAID` → green background

---

## 8. Viewing orders on the site (`admin.html`)

The site includes an `admin.html` page that embeds the sheet in an iframe.

**This page is public.** GitHub Pages has no login. Anyone who guesses or finds
the URL loads the page — the *only* thing protecting the data is the sheet's own
sharing settings.

So: **keep the spreadsheet shared with specific people only** (the default).
Then the iframe renders the sheet for your friend when they're logged in, and
renders a Google "you need permission" box for everyone else.

Do **not** set the sheet to "Anyone with the link can view" — that would expose
every buyer's phone number to the open internet.
