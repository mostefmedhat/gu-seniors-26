# Deploying to GitHub Pages

Free, no server, no card. ~10 minutes.

---

## 1. Create the repo

1. Sign in at <https://github.com> (your friend can own this instead of you —
   whoever owns the repo owns the URL).
2. **New repository**
   - Name: `gu-seniors-26`
   - **Public** — GitHub Pages needs public on the free plan.
   - Do **not** add a README, .gitignore, or licence. This folder already has them.
3. Copy the repo URL it shows you.

## 2. Push

From `D:\GU_Seniors_26`:

```bash
git add . && git commit -m "GU Seniors '26 site"
```

```bash
git branch -M main && git remote add origin https://github.com/YOUR_USERNAME/gu-seniors-26.git && git push -u origin main
```

## 3. Turn on Pages

1. Repo → **Settings** → **Pages** (left sidebar).
2. **Source:** `Deploy from a branch`
3. **Branch:** `main`, folder `/ (root)` → **Save**.
4. Wait ~1 minute, then reload the page — GitHub shows the live URL:

```
https://YOUR_USERNAME.github.io/gu-seniors-26/
```

The `.nojekyll` file in this repo stops GitHub trying to process the site with
Jekyll, which would otherwise ignore files and folders starting with `_`.

---

## 4. Free custom domain via DigitalPlat FreeDomain

<https://github.com/DigitalPlatDev/FreeDomain> gives real, free domains on these
suffixes:

`.dpdns.org` · `.us.kg` · `.qzz.io` · `.xx.kg` · `.qd.je`

So you can have **`guseniors26.dpdns.org`** instead of
`username.github.io/gu-seniors-26`. Free, no card.

> **The catch nobody mentions up front:** FreeDomain does **not** run DNS for
> you. All it lets you do is point the domain at *someone else's* nameservers.
> So you need a free DNS host in the middle. Budget three services, not one:
> FreeDomain → DNS host → GitHub Pages.

> ⚠️ **Do NOT use Cloudflare for this.** What you get from FreeDomain is a
> *subdomain* (`guseniors26.dpdns.org`), and Cloudflare only accepts a
> subdomain as its own zone on a **Business plan** (~$200/month). On Free and
> Pro the option isn't even shown. Cloudflare is the right answer for a normal
> `.com`; it is the wrong answer here.

Use **Hurricane Electric Free DNS** (<https://dns.he.net/>) instead — free,
no card, been running for two decades, and it happily hosts a delegated
subdomain zone.

### Step by step

**a. Register the name**

1. Go to <https://dash.domain.digitalplat.org/> and sign in with GitHub.
2. Search for `guseniors26`, pick a suffix (`.dpdns.org` reads most credible).
3. Register it. Leave the dashboard open — you come back in step (c).

**b. Create the zone at Hurricane Electric**

1. Sign up free at <https://dns.he.net/>.
2. **Add a new domain** → enter the full name exactly:
   `guseniors26.dpdns.org`
3. It creates the zone. HE's nameservers are:
   ```
   ns1.he.net
   ns2.he.net
   ns3.he.net
   ns4.he.net
   ns5.he.net
   ```

**c. Point FreeDomain at Hurricane Electric**

1. Back in the FreeDomain dashboard → your domain → **Nameservers** tab.
2. Fill the first five boxes with `ns1.he.net` … `ns5.he.net`.
   Leave NS6–NS8 empty.
3. **Update nameservers**. Propagation takes 5–30 minutes.

**d. Create the DNS records at Hurricane Electric**

In the HE zone editor, add four `A` records. Leave the name field as the bare
domain (HE shows it pre-filled), TTL default:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

Those are GitHub Pages' four servers. Optionally also add a `CNAME` for `www`
pointing to `YOUR_USERNAME.github.io`.

Check it resolved before moving on:

```bash
nslookup guseniors26.dpdns.org
```

**e. Tell GitHub about it**

1. Create a file named `CNAME` (no extension) at the repo root containing just
   the domain and nothing else:
   ```
   guseniors26.dpdns.org
   ```
2. Commit and push.
3. Repo → **Settings** → **Pages** → **Custom domain** → enter the same domain
   → Save.
4. Wait for the certificate to provision — usually minutes, up to an hour. Then
   tick **Enforce HTTPS**.

### Honest caveats

- These are **subdomains of someone else's domain**, granted at their
  discretion. Fine for a student merch drop; don't build anything you can't
  afford to lose on one.
- Some corporate networks and spam filters treat unusual TLDs like `.kg` with
  suspicion. `.dpdns.org` is the safest of the five since `.org` is familiar.
- Domains may require periodic renewal — check the dashboard before the drop
  closes so the link doesn't die mid-campaign.
- If this becomes a real business, a `.com` is ~$10/yr and worth it.

**Fallback:** the plain `username.github.io/gu-seniors-26` URL works the whole
time. Set the custom domain up whenever you like — it changes nothing about the
site itself.

---

## 5. Before you share the link — checklist

- [ ] `assets/js/config.js` — `ORDERS_ENDPOINT` set to the Apps Script `/exec` URL
- [ ] `assets/js/config.js` — `WHATSAPP_NUMBER` in `201…` format
- [ ] `assets/js/config.js` — `PRICE_EGP` and `ORDER_DEADLINE` filled
- [ ] `assets/js/config.js` — real `SIZES`, and `PLACEHOLDER: false`
- [ ] `assets/js/config.js` — `NUMBER_IS_CUSTOM` set correctly
- [ ] The orange **SETUP INCOMPLETE** banner is gone from the top of the site
- [ ] Submitted one real test order and saw the row land in the sheet
- [ ] Clicked the WhatsApp button and confirmed the message pre-fills
- [ ] Deleted that test row from the sheet
- [ ] Spreadsheet sharing is **specific people only**, not "anyone with the link"

---

## 6. Updating the site later

Edit files, then:

```bash
git add . && git commit -m "what changed" && git push
```

Pages redeploys automatically in under a minute. Hard-refresh
(<kbd>Ctrl</kbd>+<kbd>Shift</kbd>+<kbd>R</kbd>) if you don't see the change —
GitHub caches aggressively.
