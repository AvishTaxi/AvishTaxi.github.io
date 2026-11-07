/* =========================================================
   CONFIG: edit these values. Everything on the page updates from here.
   ========================================================= */
const CONFIG = {
  driverName: "Avishka",
  whatsapp: "94765627939",            // EDIT: country code + number, digits only (no +, no spaces)
  phoneDisplay: "+94 76 562 7939",    // EDIT: how the number is shown on the page
  email: "",                          // EDIT: booking email address (email links stay hidden while empty)
  formspreeId: "",                    // OPTIONAL: Formspree form ID (e.g. "xayzabcd") so "Send by email" posts silently. Empty = opens the visitor's email app.
  googleReviewsUrl: "https://g.page/r/CVZ3o3eDvxQkEBM",   // Google Business Profile (read reviews)
  writeReviewUrl: "https://g.page/r/CVZ3o3eDvxQkEBM/review", // Google "write a review" link
  facebook: "",                       // OPTIONAL: full URL, shows the icon when set
  instagram: "",                      // OPTIONAL: full URL, shows the icon when set
  driverPhoto: "",                    // OPTIONAL: e.g. "images/avishka.jpg" replaces the portrait illustration

  /* Real guest reviews only. Copy them from Google / TripAdvisor / WhatsApp with permission. Example format:
     { name: "First name L.", country: "United Kingdom", rating: 5, text: "What they wrote…", source: "Google" } */
  reviews: []
};

(function () {
  "use strict";
  document.body.classList.remove("no-js");

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const waUrl = (msg) => "https://wa.me/" + CONFIG.whatsapp + (msg ? "?text=" + encodeURIComponent(msg) : "");

  /* ---- Contact links ---- */
  $$("[data-wa]").forEach(a => { a.href = waUrl(a.getAttribute("data-wa")); });
  $$("[data-tel]").forEach(a => { a.href = "tel:+" + CONFIG.whatsapp; });
  $$("[data-mail]").forEach(a => {
    if (CONFIG.email) { a.href = "mailto:" + CONFIG.email; a.hidden = false; return; }
    const li = a.closest("li"); if (li) li.hidden = true;
  });
  if (!CONFIG.email && !CONFIG.formspreeId) {
    const eb = document.querySelector('#booking-form [data-mode="email"]');
    if (eb) eb.hidden = true;
  }
  $$("[data-phone-text]").forEach(el => { el.textContent = CONFIG.phoneDisplay; });
  if (CONFIG.email) $$("[data-mail-text]").forEach(el => { el.textContent = CONFIG.email; });
  $$("[data-social]").forEach(a => {
    const url = CONFIG[a.getAttribute("data-social")];
    if (url) { a.href = url; a.hidden = false; }
  });
  const gr = $("#google-reviews"), wr = $("#write-review"), yr = $("#year");
  if (gr) gr.href = CONFIG.googleReviewsUrl;
  if (wr) wr.href = CONFIG.writeReviewUrl || CONFIG.googleReviewsUrl;
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- Optional photos ---- */
  if (CONFIG.driverPhoto) {
    const img = new Image();
    img.src = CONFIG.driverPhoto; img.alt = CONFIG.driverName + ", your Tangalle driver"; img.loading = "lazy";
    const ph = $("#portrait .ph"); if (ph) ph.replaceWith(img);
  }

  /* ---- Gallery lightbox (tap to enlarge, swipe / arrow keys to browse) ---- */
  const lb = $("#lightbox"), lbImg = $("#lb-img"), lbCap = $("#lb-cap");
  const shots = $$(".g-open");
  let cur = 0;
  const showShot = (i) => {
    cur = (i + shots.length) % shots.length;
    const b = shots[cur];
    lbImg.style.opacity = 0;
    lbImg.onload = () => { lbImg.style.opacity = 1; };
    lbImg.src = b.dataset.full; lbImg.alt = b.querySelector("img").alt; lbCap.textContent = b.dataset.cap;
  };
  if (lb && shots.length && typeof lb.showModal === "function") {
    shots.forEach((b, i) => b.addEventListener("click", () => { showShot(i); lb.showModal(); }));
    $(".lb-close", lb).addEventListener("click", () => lb.close());
    $(".lb-prev", lb).addEventListener("click", () => showShot(cur - 1));
    $(".lb-next", lb).addEventListener("click", () => showShot(cur + 1));
    lb.addEventListener("click", e => { if (e.target === lb || e.target.tagName === "FIGURE") lb.close(); });
    lb.addEventListener("keydown", e => { if (e.key === "ArrowLeft") showShot(cur - 1); if (e.key === "ArrowRight") showShot(cur + 1); });
    let x0 = null;
    lb.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    lb.addEventListener("touchend", e => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) showShot(cur + (dx < 0 ? 1 : -1)); x0 = null; });
  }

  /* ---- Place suggestions for every location field (built-in places + Photon / OpenStreetMap search) ---- */
  const SL_PLACES = {
    "Tangalle": [6.0243, 80.7941], "Goyambokka": [6.0136, 80.7778], "Medaketiya": [6.0300, 80.8050], "Marakolliya": [6.0400, 80.8150],
    "Rekawa": [6.0453, 80.8458], "Kalametiya": [6.0800, 80.9400], "Hiriketiya": [5.9636, 80.7097], "Dikwella": [5.9667, 80.6950],
    "Talalla": [5.9500, 80.6150], "Beliatta": [6.0480, 80.7340], "Hummanaya Blowhole (Kudawella)": [5.9739, 80.7290], "Mulkirigala": [6.1200, 80.7380],
    "Matara": [5.9485, 80.5353], "Polhena": [5.9380, 80.5150], "Mirissa": [5.9483, 80.4716], "Weligama": [5.9744, 80.4295],
    "Midigama": [5.9640, 80.3890], "Ahangama": [5.9733, 80.3669], "Koggala": [5.9930, 80.3260], "Habaraduwa": [5.9950, 80.2990],
    "Unawatuna": [6.0100, 80.2490], "Galle Fort": [6.0262, 80.2170], "Hikkaduwa": [6.1395, 80.1063], "Ambalangoda": [6.2350, 80.0540],
    "Kosgoda": [6.3320, 80.0270], "Bentota": [6.4210, 79.9980], "Beruwala": [6.4790, 79.9830], "Kalutara": [6.5854, 79.9607],
    "Mount Lavinia": [6.8390, 79.8640], "Colombo": [6.9271, 79.8612], "Colombo Airport (CMB)": [7.1808, 79.8841], "Negombo": [7.2083, 79.8358],
    "Mattala Airport (HRI)": [6.2845, 81.1241], "Ambalantota": [6.1180, 81.0260], "Hambantota": [6.1241, 81.1185], "Kirinda": [6.2190, 81.3290],
    "Tissamaharama": [6.2790, 81.2870], "Yala National Park": [6.2720, 81.4030], "Kataragama": [6.4135, 81.3326],
    "Udawalawe National Park": [6.4386, 80.8890], "Embilipitiya": [6.3439, 80.8490], "Wellawaya": [6.7370, 81.1030], "Ella": [6.8667, 81.0466],
    "Haputale": [6.7650, 80.9580], "Bandarawela": [6.8290, 80.9870], "Horton Plains": [6.8020, 80.8070], "Nuwara Eliya": [6.9497, 80.7891],
    "Hatton": [6.8920, 80.5960], "Adam's Peak (Dalhousie)": [6.8120, 80.4990], "Kitulgala": [6.9890, 80.4180], "Kandy": [7.2906, 80.6337],
    "Pinnawala": [7.3000, 80.3870], "Dambulla": [7.8567, 80.6492], "Sigiriya": [7.9570, 80.7603], "Habarana": [8.0350, 80.7500],
    "Polonnaruwa": [7.9403, 81.0188], "Anuradhapura": [8.3114, 80.4037], "Trincomalee": [8.5874, 81.2152], "Pasikudah": [7.9270, 81.5620],
    "Arugam Bay": [6.8400, 81.8360], "Jaffna": [9.6615, 80.0255]
  };
  // 0 = name starts with the text, 1 = a word in the name starts with it, 2 = elsewhere
  const placeScore = (name, k) => { const n = name.toLowerCase(); return n.startsWith(k) ? 0 : n.split(/[\s(,'-]+/).some(w => w.startsWith(k)) ? 1 : 2; };
  const placeLocal = (q) => {
    const k = q.trim().toLowerCase();
    if (!k) return [];
    return Object.keys(SL_PLACES).filter(n => placeScore(n, k) < 2)
      .sort((a, b) => placeScore(a, k) - placeScore(b, k) || a.length - b.length).slice(0, 6)
      .map(n => ({ name: n, sub: "Sri Lanka", lat: SL_PLACES[n][0], lng: SL_PLACES[n][1] }));
  };
  const placeSearch = async (q, limit) => {
    const c = new AbortController(), t = setTimeout(() => c.abort(), 6000);
    try {
      const r = await fetch("https://photon.komoot.io/api/?lang=en&limit=" + (limit || 6) + "&bbox=79.4,5.8,82.0,9.9&q=" + encodeURIComponent(q), { signal: c.signal });
      if (!r.ok) throw new Error("photon");
      const j = await r.json();
      return (j.features || []).filter(f => (f.properties.countrycode || "LK") === "LK").map(f => {
        const p = f.properties;
        const sub = [p.street, p.district || p.city || p.town || p.village, p.county || p.state].filter(Boolean).filter((v, i, a) => a.indexOf(v) === i && v !== p.name).join(", ");
        return { name: p.name || q, sub: sub || "Sri Lanka", lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] };
      });
    } finally { clearTimeout(t); }
  };
  const escAC = (v) => String(v == null ? "" : v).replace(/[&<>"]/g, ch => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[ch]));
  let acN = 0;
  // Turn any text input into a place field with a suggestion list. onPick(place) is optional.
  const attachPlaceAC = (input, onPick) => {
    if (input.dataset.ac) return;
    input.dataset.ac = "1";
    input.setAttribute("autocomplete", "off");
    let list = input.getAttribute("aria-controls") && document.getElementById(input.getAttribute("aria-controls"));
    if (!list) {
      const host = document.createElement("div"); host.className = "ac-host";
      input.parentNode.insertBefore(host, input); host.appendChild(input);
      list = document.createElement("ul"); list.className = "pl-ac"; list.id = "ac-list-" + (++acN); list.hidden = true; list.setAttribute("role", "listbox");
      host.appendChild(list);
      input.setAttribute("role", "combobox"); input.setAttribute("aria-autocomplete", "list"); input.setAttribute("aria-expanded", "false"); input.setAttribute("aria-controls", list.id);
    }
    let items = [], active = -1, timer = null, seq = 0;
    const close = () => { list.hidden = true; input.setAttribute("aria-expanded", "false"); input.removeAttribute("aria-activedescendant"); active = -1; };
    const render = (arr, note) => {
      items = arr;
      list.innerHTML = arr.map((it, i) => '<li role="option" id="' + list.id + '-' + i + '" data-i="' + i + '"><svg class="icon"><use href="#i-pin"/></svg><span>' +
        escAC(it.name) + (it.sub ? '<small>' + escAC(it.sub) + '</small>' : '') + '</span></li>').join("") + (note ? '<li class="hint" role="presentation">' + note + '</li>' : "");
      list.hidden = !arr.length && !note; input.setAttribute("aria-expanded", String(!list.hidden));
    };
    const pick = (i) => {
      const it = items[i]; if (!it) return;
      close();
      if (onPick) onPick(it);
      else {
        input.value = it.sub && it.sub !== "Sri Lanka" ? it.name + ", " + it.sub.split(", ")[0] : it.name;
        input.setAttribute("aria-invalid", "false");
        input.dispatchEvent(new Event("change", { bubbles: true }));
      }
    };
    const suggest = () => {
      const q = input.value.trim(); clearTimeout(timer);
      if (!q) { render(["Colombo Airport (CMB)", "Tangalle", "Mirissa", "Galle Fort", "Yala National Park", "Ella"].map(n => ({ name: n, sub: "Popular", lat: SL_PLACES[n][0], lng: SL_PLACES[n][1] })), ""); return; }
      const local = placeLocal(q);
      render(local, q.length >= 2 ? "Searching places…" : "");
      if (q.length < 2) return;
      const my = ++seq;
      timer = setTimeout(async () => {
        let remote = [];
        try { remote = await placeSearch(q, 6); } catch (e) {}
        if (my !== seq || document.activeElement !== input) return;   // field changed or was left meanwhile
        const seen = new Set(local.map(l => l.name.toLowerCase()));
        const k = q.toLowerCase();
        const all = local.concat(remote.filter(r => !seen.has(r.name.toLowerCase())))
          .map((it, i) => ({ it, i, sc: placeScore(it.name, k) })).sort((a, b) => a.sc - b.sc || a.i - b.i).map(x => x.it).slice(0, 8);
        render(all, all.length ? "" : "No matches yet. Keep typing, or try a nearby town.");
      }, 250);
    };
    input.addEventListener("input", suggest);
    input.addEventListener("focus", () => { if (!input.value.trim()) suggest(); });
    input.addEventListener("keydown", e => {
      if (list.hidden || !items.length) return;
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault(); active = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
        list.querySelectorAll("li[role=option]").forEach((li, i) => li.setAttribute("aria-selected", String(i === active)));
        input.setAttribute("aria-activedescendant", list.id + "-" + active);
        const cur = list.querySelector('[aria-selected="true"]'); if (cur) cur.scrollIntoView({ block: "nearest" });
      } else if (e.key === "Enter" && active >= 0) { e.preventDefault(); pick(active); }
      else if (e.key === "Escape") { e.stopPropagation(); close(); }
    });
    list.addEventListener("mousedown", e => { const li = e.target.closest("li[data-i]"); if (li) { e.preventDefault(); pick(+li.dataset.i); } });
    input.addEventListener("blur", () => { seq++; clearTimeout(timer); setTimeout(close, 150); });
  };
  ["#qq-from", "#qq-to", "#f-pickup", "#f-dest"].forEach(sel => { const el = $(sel); if (el) attachPlaceAC(el); });

  /* ---- Booking request forms: every WhatsApp button opens a short form, builds the message, then opens WhatsApp ---- */
  const PLACES = ["Ella", "Nuwara Eliya", "Kandy", "Sigiriya", "Dambulla", "Galle", "Mirissa", "Yala", "Udawalawe", "Arugam Bay"];
  const TOURS = ["Yala safari", "Udawalawe elephant safari", "Galle Fort & coast", "Mirissa whale watching", "Hiriketiya & hidden bays (beach hopping)", "Mulkirigala rock temple & Hummanaya blowhole", "Something else"];
  const VEHICLES = ["No preference", "Sedan (1–3)", "SUV (1–4)", "Van (4–8)"];
  const F = {
    name: { label: "Your name", type: "text", req: 1, auto: "name", ph: "e.g. Sarah", full: 0 },
    pax: { label: "Passengers", type: "stepper", min: 1, max: 14, val: 2 },
    date: { label: "Date", type: "date", req: 1 },
    time: { label: "Pickup time", type: "time" },
    vehicle: { label: "Vehicle", type: "select", opts: VEHICLES, full: 1 },
    bags: { label: "Large bags", type: "stepper", min: 0, max: 12, val: 2 },
    notes: { label: "Anything else?", type: "textarea", ph: "Child seats, surfboards, stops on the way…", full: 1 }
  };
  const FORMS = {
    taxi: { kicker: "Private taxi", title: "Book a taxi", lead: "I'd like to book a private taxi.",
      fields: [["pickup", { label: "Pickup location", type: "text", req: 1, ph: "Hotel, villa or address", full: 1 }],
               ["dest", { label: "Destination", type: "text", req: 1, ph: "e.g. Galle Fort", full: 1 }], "date", "time", "pax", "bags", "vehicle", "name", "notes"] },
    route: { kicker: "Fixed-price route", title: "Book this route", lead: "I'd like to book a taxi.",
      fields: [["from", { label: "From", type: "text", req: 1 }], ["to", { label: "To", type: "text", req: 1 }],
               ["exact", { label: "Exact pickup point", type: "text", ph: "Hotel name or address (optional)", full: 1 }],
               "date", "time", ["flight", { label: "Flight number", type: "text", ph: "e.g. UL 504", when: d => /airport/i.test(d.from || "") }],
               "pax", "bags", ["veh2", { label: "Vehicle", type: "seg", opts: ["Car (1–3)", "Van / shuttle (4–8)"], full: 1 }], "name", "notes"] },
    airport: { kicker: "Airport transfer", title: "Airport transfer", lead: "I'd like to book an airport transfer.",
      fields: [["dir", { label: "Trip", type: "seg", opts: ["Pickup from the airport", "Drop-off at the airport"], full: 1 }],
               ["airport", { label: "Airport", type: "seg", opts: ["Colombo (CMB)", "Mattala (HRI)"], full: 1 }],
               ["place", { label: "Hotel / address", type: "text", req: 1, ph: "Where in Tangalle or the south coast?", full: 1 }],
               "date", ["time", { label: "Landing / pickup time", type: "time" }], ["flight", { label: "Flight number", type: "text", ph: "e.g. UL 504" }],
               "pax", "bags", "vehicle", "name", "notes"] },
    tour: { kicker: "Day tour", title: "Book a day tour", lead: "I'd like to book a day tour.",
      fields: [["tour", { label: "Tour", type: "select", opts: TOURS, full: 1 }],
               ["pickup", { label: "Pickup hotel / location", type: "text", req: 1, ph: "e.g. hotel in Tangalle", full: 1 }],
               "date", ["start", { label: "Start", type: "select", opts: ["Early morning (best for safaris)", "Morning", "Flexible"] }],
               ["pax", { label: "People", type: "stepper", min: 1, max: 14, val: 2 }], "name", "notes"] },
    roundtour: { kicker: "Multi-day round tour", title: "Plan my round tour", lead: "I'd like a quote for a multi-day round tour.",
      fields: [["date", { label: "Start date", type: "date", req: 1 }], ["days", { label: "Number of days", type: "stepper", min: 2, max: 30, val: 5 }],
               ["origin", { label: "Starting from", type: "text", req: 1, ph: "e.g. Colombo Airport or Tangalle", full: 1 }],
               ["places", { label: "Places you'd like to visit", type: "chips", opts: PLACES, full: 1 }],
               ["pax", { label: "Travellers", type: "stepper", min: 1, max: 14, val: 2 }],
               ["hotels", { label: "Hotels", type: "select", opts: ["Please suggest hotels", "Already booked", "Not sure yet"] }],
               ["style", { label: "Travel style", type: "seg", opts: ["Budget", "Mid-range", "Luxury"], full: 1, nodef: 1 }], "name", "notes"] },
    hotel: { kicker: "Hotel & villa pick-up", title: "Hotel / villa pick-up", lead: "I'd like a pick-up from my hotel.",
      fields: [["pickup", { label: "Hotel / villa name", type: "text", req: 1, full: 1 }], ["dest", { label: "Going to", type: "text", req: 1, ph: "Restaurant, beach, town…", full: 1 }],
               "date", ["time", { label: "Pickup time", type: "time", req: 1 }], "pax",
               ["ret", { label: "Return trip", type: "seg", opts: ["One way", "Return trip"], full: 1 }], "name", "notes"] },
    hourly: { kicker: "Car & driver hire", title: "Hire a car & driver", lead: "I'd like to hire a car and driver.",
      fields: [["dur", { label: "Duration", type: "seg", opts: ["Half day (≈ 4 hrs)", "Full day (≈ 8 hrs)"], full: 1 }],
               "date", ["time", { label: "Start time", type: "time" }],
               ["pickup", { label: "Start from", type: "text", req: 1, ph: "Hotel or address", full: 1 }],
               ["plan", { label: "Places you'd like to go", type: "textarea", ph: "e.g. Hiriketiya, Dikwella temple, lunch stop", full: 1 }], "pax", "vehicle", "name"] },
    hello: { kicker: "Question", title: "Ask Avishka", lead: "I found your website and have a question.",
      fields: [["q", { label: "Your question", type: "textarea", req: 1, ph: "Ask about a trip, a price or anything else", full: 1 }],
               ["when", { label: "Travel dates (if known)", type: "text", ph: "e.g. 12–20 Dec", full: 1 }], "name"] }
  };

  const bk = $("#bk"), bkForm = $("#bk-form"), bkFields = $("#bk-fields"), bkMsg = $("#bk-msg"), bkErr = $("#bk-err");
  let bkDef = null, ctx = {};
  const esc2 = (v) => String(v == null ? "" : v).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  let savedName = "";
  try { savedName = localStorage.getItem("avish-name") || ""; } catch (e) {}

  const defs = () => bkDef.fields.map(f => Array.isArray(f) ? [f[0], Object.assign({}, F[f[0]] || {}, f[1])] : [f, F[f]]);
  const fieldHTML = (id, d, val) => {
    const fid = "bk-" + id, req = d.req ? ' <span class="req" aria-hidden="true">*</span>' : "";
    const cls = "field" + (d.full || d.type === "textarea" || d.type === "chips" ? " full" : "");
    const vis = d.when ? ' data-when="' + id + '"' : "";
    if (d.type === "seg" || d.type === "chips") {
      const multi = d.type === "chips";
      const cur = multi || (d.nodef && !val) ? [] : [val || d.opts[0]];
      return '<fieldset class="' + cls + '"' + vis + ' style="border:0;padding:0;margin:0"><legend class="lbl">' + d.label + "</legend><div class=\"seg\">" +
        d.opts.map(o => '<label><input type="' + (multi ? "checkbox" : "radio") + '" name="' + id + '" value="' + esc2(o) + '"' + (cur.includes(o) ? " checked" : "") + "><span>" + esc2(o) + "</span></label>").join("") + "</div></fieldset>";
    }
    if (d.type === "stepper") {
      const v = val != null ? val : d.val;
      return '<div class="' + cls + ' st"' + vis + '><span class="lbl" id="' + fid + '-l">' + d.label + '</span><div class="stepper" role="group" aria-labelledby="' + fid + '-l">' +
        '<button type="button" data-step="-1" aria-label="Fewer">−</button><output id="' + fid + '" data-min="' + d.min + '" data-max="' + d.max + '" name="' + id + '">' + v + '</output>' +
        '<button type="button" data-step="1" aria-label="More">+</button></div></div>';
    }
    let input;
    const common = ' id="' + fid + '" name="' + id + '"' + (d.req ? " required" : "") + (d.ph ? ' placeholder="' + esc2(d.ph) + '"' : "") + (d.auto ? ' autocomplete="' + d.auto + '"' : "");
    if (d.type === "select") input = "<select" + common + ">" + d.opts.map(o => "<option" + (o === val ? " selected" : "") + ">" + esc2(o) + "</option>").join("") + "</select>";
    else if (d.type === "textarea") input = "<textarea" + common + ">" + esc2(val || "") + "</textarea>";
    else input = '<input type="' + d.type + '"' + common + (val ? ' value="' + esc2(val) + '"' : "") + (d.type === "date" ? ' min="' + iso + '"' : "") + ">";
    return '<div class="' + cls + '"' + vis + '><label for="' + fid + '">' + d.label + req + "</label>" + input + "</div>";
  };

  const read = () => {
    const d = {};
    defs().forEach(([id, def]) => {
      if (def.type === "stepper") d[id] = $("#bk-" + id).textContent;
      else if (def.type === "chips") d[id] = $$('input[name="' + id + '"]:checked', bkForm).map(i => i.value);
      else if (def.type === "seg") { const c = $('input[name="' + id + '"]:checked', bkForm); d[id] = c ? c.value : ""; }
      else { const el = $("#bk-" + id); d[id] = el ? el.value.trim() : ""; }
    });
    return d;
  };

  const LBL = { pickup: "Pickup", dest: "Destination", from: "From", to: "To", exact: "Pickup point", place: "Hotel / address", tour: "Tour",
    start: "Start", days: "Days", hotels: "Hotels", style: "Travel style", ret: "Trip", dur: "Duration", plan: "Plans", when: "Travel dates",
    date: "Date", time: "Time", flight: "Flight", pax: "Passengers", bags: "Large bags", vehicle: "Vehicle", veh2: "Vehicle", dir: "Trip", airport: "Airport", places: "Places" };

  const compose = () => {
    const d = read(), lines = ["Hi " + CONFIG.driverName + ", " + bkDef.lead, ""];
    defs().forEach(([id, def]) => {
      if (["name", "notes", "q"].includes(id)) return;
      if (def.when && !def.when(d)) return;
      let v = d[id];
      if (Array.isArray(v)) v = v.join(", ");
      if (!v || v === "No preference") return;
      if (id === "date") v = niceDate(v);
      lines.push("• " + (id === "pax" || id === "date" ? def.label : (LBL[id] || def.label)) + ": " + v);
    });
    if (d.q) lines.push(d.q);
    if (d.notes) lines.push("", "Notes: " + d.notes);
    lines.push("", "Name: " + (d.name || "[your name]"));
    return lines.join("\n");
  };
  const update = () => {
    const d = read();
    $$("[data-when]", bkFields).forEach(el => { const def = defs().find(x => x[0] === el.dataset.when)[1]; el.hidden = !def.when(d); });
    bkMsg.textContent = compose();
  };

  const openBooking = (el) => {
    const type = FORMS[el.dataset.book] ? el.dataset.book : "taxi";
    bkDef = FORMS[type];
    ctx = { from: el.dataset.from || "", to: el.dataset.to || "", tour: el.dataset.tour || "", vehicle: el.dataset.vehicle || "", notes: el.dataset.notes || "" };
    $("#bk-kicker").textContent = bkDef.kicker;
    $("#bk-title").textContent = type === "route" && ctx.from ? ctx.from + " → " + (ctx.to || "") : (type === "tour" && ctx.tour ? ctx.tour : bkDef.title);
    const init = { from: ctx.from, to: ctx.to, pickup: ctx.from, dest: ctx.to, notes: ctx.notes, tour: ctx.tour || TOURS[0], name: savedName,
      vehicle: ctx.vehicle ? VEHICLES.find(v => v.startsWith(ctx.vehicle)) : "", airport: /mattala/i.test(ctx.from) ? "Mattala (HRI)" : "",
      veh2: ctx.vehicle === "Van" ? "Van / shuttle (4–8)" : "" };
    bkFields.innerHTML = defs().map(([id, def]) => fieldHTML(id, def, init[id])).join("");
    ["pickup", "dest", "from", "to", "place", "exact", "origin"].forEach(k => { const el = $("#bk-" + k); if (el) attachPlaceAC(el); });
    bkErr.textContent = "";
    update();
    bk.showModal();
    const first = $$("input:not([type=radio]):not([type=checkbox]):not([value]), textarea, select", bkFields).find(i => i.required && !i.value);
    if (first && window.innerWidth > 600) first.focus();
  };

  if (bk && typeof bk.showModal === "function") {
    document.addEventListener("click", e => {
      const el = e.target.closest("[data-book]");
      if (!el || e.ctrlKey || e.metaKey) return;
      e.preventDefault();
      if (!menu.hidden) setMenu(false);
      openBooking(el);
    });
    bkFields.addEventListener("input", e => {
      if (e.target.value && e.target.value.trim()) e.target.removeAttribute("aria-invalid");
      if (!$$('[aria-invalid="true"]', bkFields).length) bkErr.textContent = "";
      update();
    });
    bkFields.addEventListener("change", update);
    bkFields.addEventListener("click", e => {
      const b = e.target.closest("[data-step]"); if (!b) return;
      const o = b.parentElement.querySelector("output");
      o.textContent = Math.min(+o.dataset.max, Math.max(+o.dataset.min, +o.textContent + +b.dataset.step));
      update();
    });
    $$("[data-bk-close]", bk).forEach(b => b.addEventListener("click", () => bk.close()));
    bk.addEventListener("click", e => { if (e.target === bk) bk.close(); });
    bkForm.addEventListener("submit", e => {
      e.preventDefault();
      let bad = null;
      $$("[required]", bkFields).forEach(i => { const no = !i.value.trim(); i.setAttribute("aria-invalid", no ? "true" : "false"); if (no && !bad) bad = i; });
      if (bad) { bkErr.textContent = "Please fill in the fields marked *."; bad.focus(); return; }
      const d = read();
      try { if (d.name) localStorage.setItem("avish-name", d.name); savedName = d.name || savedName; } catch (err) {}
      const url = waUrl(compose());
      const w = window.open(url, "_blank", "noopener");
      if (!w) window.location.href = url;
      bk.close();
    });
  }

  /* ---- Trip planner: 3 steps, real road routing (OSRM / Valhalla), place suggestions (Photon / Nominatim), Leaflet map ---- */
  const plForm = $("#pl-form");
  if (plForm) {
    // Avishka's set prices [car, van/shuttle] for direct trips, matched in either direction.
    const PRICES = [
      [/tangalle|goyambokka/i, /colombo airport|\bcmb\b|katunayake|bandaranaike/i, 25000, 33000],
      [/tangalle|goyambokka/i, /mattala|\bhri\b/i, 15000, 18000],
      [/tangalle|goyambokka/i, /galle/i, 16000, 19000],
      [/tangalle|goyambokka/i, /mirissa/i, 9000, 13000],
      [/tangalle|goyambokka/i, /weligama/i, 10000, 14000],
      [/tangalle|goyambokka/i, /yala|tissa/i, 20000, 23000],
      [/tangalle|goyambokka/i, /udawalaw/i, 15000, 18000],
      [/tangalle|goyambokka/i, /\bella\b/i, 23000, 27000]
    ];
    const LK_BOX = "79.4,5.8,82.0,9.9";                       // Sri Lanka bounding box (lon,lat,lon,lat)
    const stopsBox = $("#pl-stops"), msg = $("#pl-msg");
    const say = (t, err) => { msg.textContent = t; msg.className = "pl-msg" + (err ? " err" : ""); };
    const fmtKm = (m) => (m / 1000 >= 100 ? Math.round(m / 1000) : (Math.round(m / 100) / 10)) + " km";
    const fmtTime = (s) => { const mins = Math.max(5, Math.round(s / 60 / 5) * 5); const h = Math.floor(mins / 60), mm = mins % 60; return [h ? h + " h" : "", mm ? mm + " min" : ""].filter(Boolean).join(" "); };
    const lkr = (n) => "LKR " + n.toLocaleString("en-US");
    const withTimeout = (url, ms, opts) => { const c = new AbortController(); const t = setTimeout(() => c.abort(), ms); return fetch(url, Object.assign({ signal: c.signal }, opts || {})).finally(() => clearTimeout(t)); };
    const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    $("#pl-date").min = $("#pl-date").value = today.toISOString().slice(0, 10);

    /* ---------- place suggestions ---------- */
    let lastNom = 0;
    const nominatim = async (q) => {
      const wait = 1100 - (Date.now() - lastNom); if (wait > 0) await new Promise(r => setTimeout(r, wait)); lastNom = Date.now();
      const r = await withTimeout("https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=lk&accept-language=en&q=" + encodeURIComponent(q), 8000, { headers: { Accept: "application/json" } });
      if (!r.ok) throw new Error("nominatim");
      const j = await r.json();
      return j.length ? { name: q.trim(), sub: "", lat: +j[0].lat, lng: +j[0].lon } : null;
    };
    const resolve = async (input) => {
      if (input.dataset.lat && input.dataset.label === input.value) return { name: input.value, lat: +input.dataset.lat, lng: +input.dataset.lng };
      const q = input.value.trim();
      const exact = Object.keys(SL_PLACES).find(n => n.toLowerCase() === q.toLowerCase()) || Object.keys(SL_PLACES).find(n => n.toLowerCase().startsWith(q.toLowerCase()));
      if (exact) return { name: exact, lat: SL_PLACES[exact][0], lng: SL_PLACES[exact][1] };
      try { const p = await placeSearch(q, 1); if (p.length) return { name: q, lat: p[0].lat, lng: p[0].lng }; } catch (e) {}
      try { return await nominatim(q); } catch (e) { return null; }
    };
    const setPlace = (input, place, quiet) => {
      input.value = place.name; input.dataset.label = place.name; input.dataset.lat = place.lat; input.dataset.lng = place.lng;
      input.setAttribute("aria-invalid", "false");
      previewMarkers();
      if (!quiet) autoRoute();
    };
    const attachAC = (input) => {
      input.addEventListener("input", () => { delete input.dataset.lat; delete input.dataset.label; });
      attachPlaceAC(input, place => setPlace(input, place));
      // typed a place and moved on without picking a suggestion: look it up, then update the route
      input.addEventListener("change", () => {
        setTimeout(async () => {
          if (input.dataset.lat || !input.value.trim()) return;
          const pt = await resolve(input);
          if (pt && !input.dataset.lat) setPlace(input, pt);
        }, 200);
      });
    };
    $$(".pl-place", plForm).forEach(attachAC);

    /* ---------- road routing: try several free routing services, never straight lines ---------- */
    const decode6 = (str) => { let i = 0, lat = 0, lng = 0; const out = [];
      while (i < str.length) { for (const k of [0, 1]) { let b, shift = 0, res = 0; do { b = str.charCodeAt(i++) - 63; res |= (b & 31) << shift; shift += 5; } while (b >= 32); const d = res & 1 ? ~(res >> 1) : res >> 1; if (k === 0) lat += d; else lng += d; } out.push([lat / 1e6, lng / 1e6]); }
      return out; };
    const osrm = (base, label) => async (pts) => {
      const r = await withTimeout(base + pts.map(p => p.lng.toFixed(6) + "," + p.lat.toFixed(6)).join(";") + "?overview=full&geometries=geojson", 9000);
      if (!r.ok) throw new Error(label);
      const j = await r.json();
      if (j.code !== "Ok" || !j.routes || !j.routes.length) throw new Error(label);
      const rt = j.routes[0], f = 1.15;                       // allow for slower Sri Lankan roads
      return { src: label, distance: rt.distance, duration: rt.duration * f, legs: rt.legs.map(l => ({ distance: l.distance, duration: l.duration * f })), line: rt.geometry.coordinates.map(c => [c[1], c[0]]) };
    };
    const valhalla = async (pts) => {
      const body = { locations: pts.map(p => ({ lat: p.lat, lon: p.lng })), costing: "auto", units: "kilometers" };
      const r = await withTimeout("https://valhalla1.openstreetmap.de/route?json=" + encodeURIComponent(JSON.stringify(body)), 10000);
      if (!r.ok) throw new Error("valhalla");
      const j = await r.json(), t = j.trip;
      if (!t || t.status !== 0) throw new Error("valhalla");
      return { src: "Valhalla", distance: t.summary.length * 1000, duration: t.summary.time * 1.05,
        legs: t.legs.map(l => ({ distance: l.summary.length * 1000, duration: l.summary.time * 1.05 })), line: t.legs.flatMap(l => decode6(l.shape)) };
    };
    const ROUTERS = [osrm("https://routing.openstreetmap.de/routed-car/route/v1/driving/", "OSRM (FOSSGIS)"), osrm("https://router.project-osrm.org/route/v1/driving/", "OSRM"), valhalla];
    const route = async (pts) => { for (const fn of ROUTERS) { try { return await fn(pts); } catch (e) {} } return null; };

    /* ---------- map ---------- */
    let map = null, layer = null;
    const loadLeaflet = () => window.L ? Promise.resolve() : new Promise((ok, no) => {
      const css = document.createElement("link"); css.rel = "stylesheet"; css.href = "/assets/vendor/leaflet/leaflet.css"; document.head.appendChild(css);
      const sc = document.createElement("script"); sc.src = "/assets/vendor/leaflet/leaflet.js"; sc.onload = ok; sc.onerror = no; document.head.appendChild(sc);
    });
    let mapReady = null;                                       // created once, even if several callers ask at the same time
    const ensureMap = () => mapReady || (mapReady = loadLeaflet().then(() => {
      map = L.map("pl-map", { scrollWheelZoom: false, zoomControl: true, zoomAnimation: false, fadeAnimation: false, markerZoomAnimation: false }).setView([7.75, 80.75], 7);
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { maxZoom: 19, attribution: "&copy; <a href=\"https://www.openstreetmap.org/copyright\">OpenStreetMap</a> contributors" }).addTo(map);
      layer = L.layerGroup().addTo(map);
      return map;
    }).catch(e => { mapReady = null; throw e; }));
    if ("IntersectionObserver" in window) {
      const mo = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { mo.disconnect(); ensureMap().catch(() => {}); } }, { rootMargin: "300px" });
      mo.observe($("#pl-map"));
    }
    const dotIcon = (color) => ({ radius: 9, color: "#fff", weight: 3, fillOpacity: 1, fillColor: color });
    const markerColor = (i, n) => i === 0 ? "#15803D" : i === n - 1 ? "#C2410C" : "#D99A2B";
    const previewMarkers = async () => {
      try {
        await ensureMap();
        const ins = [$("#pl-from"), ...$$(".pl-row[data-kind=via] input", stopsBox), $("#pl-to")].filter(i => i.dataset.lat);
        if (!ins.length) return;
        layer.clearLayers();
        ins.forEach(i => L.circleMarker([+i.dataset.lat, +i.dataset.lng], dotIcon(i.id === "pl-from" ? "#15803D" : i.id === "pl-to" ? "#C2410C" : "#D99A2B")).addTo(layer).bindTooltip(i.value));
        map.invalidateSize(); if (ins.length === 1) map.setView([+ins[0].dataset.lat, +ins[0].dataset.lng], 12, { animate: false }); else map.fitBounds(ins.map(i => [+i.dataset.lat, +i.dataset.lng]), { padding: [40, 40], animate: false });
      } catch (e) {}
    };
    const drawRoute = async (pts, r) => {
      try {
        await ensureMap();
        layer.clearLayers();
        const line = L.polyline(r.line, { color: "#0F766E", weight: 5, opacity: .9 }).addTo(layer);
        pts.forEach((p, i) => L.circleMarker([p.lat, p.lng], dotIcon(markerColor(i, pts.length))).addTo(layer).bindTooltip(p.name));
        map.invalidateSize(); map.fitBounds(line.getBounds(), { padding: [30, 30], animate: false });
      } catch (e) {}
    };

    /* ---------- stops, swap, location, quick trips ---------- */
    let viaN = 0;
    const renumber = () => $$(".pl-row[data-kind=via]", stopsBox).forEach((r, i) => { r.querySelector(".pl-dot").textContent = i + 1; });
    const addStop = (val) => {
      if ($$(".pl-row[data-kind=via]", stopsBox).length >= 5) { say("Up to 5 stops can be added. For longer tours, send your plan on WhatsApp."); return null; }
      const id = "pl-via-" + (++viaN), row = document.createElement("div");
      row.className = "pl-row"; row.dataset.kind = "via";
      row.innerHTML = '<span class="pl-dot via" aria-hidden="true"></span><div class="pl-field pl-ac-wrap"><label for="' + id + '">Stop</label>' +
        '<input id="' + id + '" class="pl-place" placeholder="e.g. Galle Fort" role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="' + id + '-list">' +
        '<ul class="pl-ac" id="' + id + '-list" role="listbox" hidden></ul></div><button class="pl-x" type="button" aria-label="Remove this stop">×</button>';
      stopsBox.insertBefore(row, stopsBox.querySelector("[data-kind=end]"));
      attachAC(row.querySelector("input"));
      row.querySelector(".pl-x").addEventListener("click", () => { stopsBox.removeChild(row); renumber(); previewMarkers(); autoRoute(); });
      renumber();
      if (val) row.querySelector("input").value = val;
      return row.querySelector("input");
    };
    $("#pl-add").addEventListener("click", () => { const i = addStop(); if (i) i.focus(); });
    $("#pl-swap").addEventListener("click", () => {
      const a = $("#pl-from"), b = $("#pl-to"), keys = ["lat", "lng", "label"];
      const da = keys.map(k => a.dataset[k]), db = keys.map(k => b.dataset[k]);
      [a.value, b.value] = [b.value, a.value];
      keys.forEach((k, i) => { if (db[i] !== undefined) a.dataset[k] = db[i]; else delete a.dataset[k]; if (da[i] !== undefined) b.dataset[k] = da[i]; else delete b.dataset[k]; });
      previewMarkers(); autoRoute();
    });
    $("#pl-geo").addEventListener("click", () => {
      if (!navigator.geolocation) { say("Your browser can't share its location. Please type the pickup place.", true); return; }
      say("Finding your location…");
      navigator.geolocation.getCurrentPosition(pos => {
        setPlace($("#pl-from"), { name: "My location", lat: pos.coords.latitude, lng: pos.coords.longitude });
        say("Pickup set to your current location.");
      }, () => say("Location permission was refused. Please type the pickup place.", true), { enableHighAccuracy: true, timeout: 10000 });
    });
    $$(".pl-quick button", plForm).forEach(btn => btn.addEventListener("click", () => {
      const [a, b] = btn.dataset.pl.split("|");
      $$(".pl-row[data-kind=via]", stopsBox).forEach(r => stopsBox.removeChild(r));
      setPlace($("#pl-from"), { name: a, lat: SL_PLACES[a][0], lng: SL_PLACES[a][1] });
      setPlace($("#pl-to"), { name: b, lat: SL_PLACES[b][0], lng: SL_PLACES[b][1] });
      $("#pl-return").checked = false;
      if (plForm.requestSubmit) plForm.requestSubmit(); else $("#pl-go").click();
    }));

    /* ---------- steps ---------- */
    let plan = null;
    const goStep = (n) => {
      $$(".pl-step", plForm).forEach(s => { s.hidden = s.dataset.step !== String(n); });
      $$(".pl-steps li").forEach(li => { li.classList.toggle("on", li.dataset.s === String(n)); li.classList.toggle("done", +li.dataset.s < n); });
      say("");
      if (n === 3) renderSummary();
      const head = $(".pl-steps"); if (head && head.getBoundingClientRect().top < 0) head.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    $$("[data-go]", plForm).forEach(b => b.addEventListener("click", () => goStep(+b.dataset.go)));
    plForm.addEventListener("click", e => {
      const b = e.target.closest("[data-pstep]"); if (!b) return;
      const o = document.getElementById(b.dataset.t);
      o.textContent = Math.min(+o.dataset.max, Math.max(+o.dataset.min, +o.textContent + +b.dataset.pstep));
      if (b.dataset.t === "pl-pax" && +o.textContent >= 4 && $("input[name=veh]:checked").value === "Car") $("input[name=veh][value='Van / shuttle']").checked = true;
    });
    const priceFor = (pts) => {
      if (pts.length !== 2 && !(pts.length === 3 && $("#pl-return").checked)) return null;
      const a = pts[0].name, b = pts[1].name;
      return PRICES.find(([x, y]) => (x.test(a) && y.test(b)) || (x.test(b) && y.test(a))) || null;
    };

    /* ---------- route computation (runs automatically as soon as pickup and drop-off are known) ---------- */
    let planKey = "", inflight = null, autoT = null;
    const placeInputs = () => [$("#pl-from"), ...$$(".pl-row[data-kind=via] input", stopsBox).filter(i => i.value.trim()), $("#pl-to")];
    const keyOf = (pts) => pts.map(p => p.lat.toFixed(5) + "," + p.lng.toFixed(5)).join(";");
    const clearRoute = () => {
      plan = null; planKey = ""; $("#pl-km").textContent = "0 km"; $("#pl-dur").textContent = "0 min"; $("#pl-src").textContent = ""; $("#pl-legs").innerHTML = ""; $("#pl-gmaps").hidden = true;
      if (layer) layer.clearLayers(); previewMarkers();
    };
    const showRoute = (pts, r) => {
      $("#pl-km").textContent = fmtKm(r.distance);
      $("#pl-dur").textContent = fmtTime(r.duration);
      $("#pl-src").textContent = "Road route · " + r.src;
      $("#pl-legs").innerHTML = pts.length > 2 ? r.legs.map((l, i) => '<li><b>' + esc2(pts[i].name) + ' → ' + esc2(pts[i + 1].name) + '</b><span>' + fmtKm(l.distance) + ' · ' + fmtTime(l.duration) + '</span></li>').join("") : "";
      const enc = (q) => encodeURIComponent(q.lat.toFixed(6) + "," + q.lng.toFixed(6));
      const g = $("#pl-gmaps"); g.hidden = false;
      g.href = "https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=" + enc(pts[0]) + "&destination=" + enc(pts[pts.length - 1]) + (pts.length > 2 ? "&waypoints=" + pts.slice(1, -1).map(enc).join("%7C") : "");
      const pr = plan.price, ret = $("#pl-return").checked;
      const show = (k, v) => { const el = $("[data-price=" + k + "]"); el.className = v ? "" : "q"; el.textContent = v ? lkr(v) + (ret ? " each way" : "") : "Quote on WhatsApp"; };
      show("car", pr && pr[2]); show("suv", null); show("van", pr && pr[3]);
      $("#pl-mini").innerHTML = '<span>' + esc2(pts[0].name) + ' → ' + esc2(ret ? pts[0].name + " (return)" : pts[pts.length - 1].name) + ': ' + fmtKm(r.distance) + ' by road · ' + fmtTime(r.duration) + '</span><a href="#pl-map">See route map ↓</a>';
    };
    // strict = true when the visitor presses the button: typed places are looked up; otherwise only places already chosen are used.
    const computeRoute = async (strict) => {
      const ins = placeInputs();
      if (!strict && ins.some(i => !i.dataset.lat)) return "incomplete";
      const pts = [];
      for (const i of ins) {
        let pt = i.dataset.lat ? { name: i.value, lat: +i.dataset.lat, lng: +i.dataset.lng } : await resolve(i);
        if (!pt) { i.setAttribute("aria-invalid", "true"); say("We couldn't find “" + i.value + "” in Sri Lanka. Pick a suggestion from the list or try a nearby town.", true); i.focus(); return "notfound"; }
        if (!i.dataset.lat) setPlace(i, pt, true);
        pts.push(pt);
      }
      if ($("#pl-return").checked) pts.push(Object.assign({}, pts[0]));
      const key = keyOf(pts);
      if (plan && planKey === key) return "ok";
      if (inflight && inflight.key === key) return inflight.promise;
      const job = (async () => {
        $("#pl-src").textContent = "Calculating road route…"; $("#pl-km").textContent = "…"; $("#pl-dur").textContent = "…";
        const r = await route(pts);
        if (inflight && inflight.key !== key) return "stale";        // a newer trip was entered meanwhile
        if (!r) { clearRoute(); say("The road-route service is busy right now. Please try again in a moment, or send your trip on WhatsApp and Avishka will reply with the distance and price.", true); return "fail"; }
        plan = { pts, r, price: priceFor(pts) }; planKey = key;
        say(""); showRoute(pts, r); await drawRoute(pts, r);
        return "ok";
      })();
      inflight = { key, promise: job };
      try { return await job; } finally { if (inflight && inflight.key === key) inflight = null; }
    };
    const autoRoute = () => { clearTimeout(autoT); autoT = setTimeout(() => { computeRoute(false).catch(() => {}); }, 300); };
    $("#pl-return").addEventListener("change", autoRoute);

    plForm.addEventListener("submit", async e => {
      e.preventDefault();
      const ins = placeInputs();
      let bad = null;
      [$("#pl-date"), $("#pl-time"), ...ins].forEach(i => { const no = !i.value.trim(); i.setAttribute("aria-invalid", no ? "true" : "false"); if (no && !bad) bad = i; });
      if (bad) { say(bad.type === "date" || bad.type === "time" ? "Please choose the pickup date and time." : "Please enter the pickup and drop-off locations.", true); bad.focus(); return; }
      const go = $("#pl-go"); go.disabled = true;
      if (!plan) say("Finding the best road route…");
      try {
        clearTimeout(autoT);
        if (await computeRoute(true) === "ok") goStep(2);
      } catch (err) {
        say("Sorry, something went wrong. Please check your connection, or send your trip on WhatsApp.", true);
      } finally { go.disabled = false; }
    });

    const tripLines = () => {
      const { pts, r } = plan, ret = $("#pl-return").checked;
      const names = pts.map(p => p.name === "My location" ? "My location (" + p.lat.toFixed(5) + ", " + p.lng.toFixed(5) + ")" : p.name);
      const veh = $("input[name=veh]:checked").value, pr = plan.price;
      const price = pr ? (veh === "Car" ? pr[2] : veh === "Van / shuttle" ? pr[3] : null) : null;
      return [
        ["Pickup", names[0]],
        ...(ret ? names.slice(1, -1) : names.slice(1, -1)).map((n, i) => ["Stop " + (i + 1), n]).filter(x => !(ret && x[1] === names[0])),
        ["Drop-off", ret ? names[0] + " (return trip)" : names[names.length - 1]],
        ["Date", niceDate($("#pl-date").value) + " at " + $("#pl-time").value],
        ["Vehicle", veh],
        ["Passengers", $("#pl-pax").textContent + " · " + $("#pl-bags").textContent + " large bags"],
        ["Route", fmtKm(r.distance) + " by road, about " + fmtTime(r.duration) + " driving"],
        ...(price ? [["Price", lkr(price) + (ret ? " each way" : "") + " (website price)"]] : [])
      ];
    };
    const renderSummary = () => {
      if (!plan) { goStep(1); return; }
      $("#pl-sum").innerHTML = tripLines().map(([k, v]) => '<div><dt>' + esc2(k) + '</dt><dd>' + esc2(v) + '</dd></div>').join("");
      try { if (!$("#pl-name").value) $("#pl-name").value = localStorage.getItem("avish-name") || ""; } catch (e) {}
    };
    $("#pl-send").addEventListener("click", () => {
      const name = $("#pl-name");
      if (!name.value.trim()) { name.setAttribute("aria-invalid", "true"); say("Please enter your name.", true); name.focus(); return; }
      name.setAttribute("aria-invalid", "false");
      try { localStorage.setItem("avish-name", name.value.trim()); } catch (e) {}
      const lines = ["Hi " + CONFIG.driverName + ", I'd like to book a taxi.", ""].concat(tripLines().map(([k, v]) => "• " + k + ": " + v));
      if ($("#pl-flight").value.trim()) lines.push("• Flight: " + $("#pl-flight").value.trim());
      if ($("#pl-notes").value.trim()) lines.push("", "Notes: " + $("#pl-notes").value.trim());
      lines.push("", "Name: " + name.value.trim());
      const url = waUrl(lines.join("\n"));
      const w = window.open(url, "_blank", "noopener");
      if (!w) window.location.href = url;
      say("WhatsApp is opening with your booking. Just press send.");
    });
  }

  /* ---- Reviews ---- */
  const grid = $("#reviews-grid");
  if (grid && CONFIG.reviews.length) {
    const esc = (s) => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    const star = '<svg class="icon"><use href="#i-star"/></svg>';
    grid.innerHTML = CONFIG.reviews.map((r, i) => {
      const n = Math.max(0, Math.min(5, r.rating || 5));
      const initials = esc((r.name || "?").split(/\s+/).map(w => w[0]).join("").slice(0, 2).toUpperCase());
      return '<article class="card review reveal d' + (i % 3) + '">' +
        '<div class="stars" role="img" aria-label="' + n + ' out of 5 stars">' + star.repeat(n) + '</div>' +
        '<blockquote>' + esc(r.text) + '</blockquote>' +
        '<footer><span class="avatar" aria-hidden="true">' + initials + '</span><div><cite>' + esc(r.name) + '</cite>' +
        '<small>' + esc(r.country || "") + (r.source ? " · via " + esc(r.source) : "") + '</small></div></footer></article>';
    }).join("");
  } else if (grid) {
    grid.remove();
  }

  /* ---- Theme toggle ---- */
  const root = document.documentElement;
  let saved = null;
  try { saved = localStorage.getItem("avish-theme"); } catch (e) {}
  const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  root.setAttribute("data-theme", saved || (prefersDark ? "dark" : "light"));
  $(".theme-toggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("avish-theme", next); } catch (e) {}
  });

  /* ---- Nav: scrolled state, active link, floating button ---- */
  const nav = $("#nav"), fab = $("#fab"), mbar = $("#mbar");
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40 || menu.classList.contains("open"));
    fab.classList.toggle("show", y > window.innerHeight * 0.6);
    mbar.classList.toggle("show", y > window.innerHeight * 0.5 && !menu.classList.contains("open"));
  };

  /* ---- Mobile menu ---- */
  const menu = $("#mobile-menu"), menuBtn = $(".menu-btn");
  const setMenu = (open) => {
    menu.hidden = !open;
    menu.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    menuBtn.querySelector("use").setAttribute("href", open ? "#i-x" : "#i-menu");
    onScroll();
  };
  menuBtn.addEventListener("click", () => setMenu(menu.hidden));
  $$("a", menu).forEach(a => a.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !menu.hidden) { setMenu(false); menuBtn.focus(); } });
  window.addEventListener("resize", () => { if (window.innerWidth > 1020 && !menu.hidden) setMenu(false); });

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const links = $$(".nav-links a");
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(l => l.classList.toggle("active", l.getAttribute("href") === "#" + en.target.id));
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    ["home", "services", "pricing", "planner", "tours", "gallery", "fleet", "reviews", "contact"].forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });

    /* ---- Reveal on scroll ---- */
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    $$(".reveal").forEach(el => io.observe(el));
  } else {
    $$(".reveal").forEach(el => el.classList.add("in"));
  }

  /* ---- Date inputs: no past dates ---- */
  const today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  const iso = today.toISOString().slice(0, 10);
  $$('input[type="date"]').forEach(i => i.min = iso);

  const niceDate = (v) => {
    if (!v) return "";
    const d = new Date(v + "T00:00:00");
    return isNaN(d) ? v : d.toLocaleDateString("en-GB", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  /* ---- Quick quote ---- */
  if ($("#quick-quote")) $("#quick-quote").addEventListener("submit", e => {
    e.preventDefault();
    const f = e.target;
    const from = f.from.value.trim() || "[location]";
    const to = f.to.value.trim() || "[destination]";
    const date = niceDate(f.date.value) || "[date]";
    window.open(waUrl("Hi " + CONFIG.driverName + ", I'd like to book a taxi from " + from + " to " + to + " on " + date + ". Could you send me a price?"), "_blank", "noopener");
  });

  /* ---- Booking form ---- */
  const form = $("#booking-form"), status = $("#form-status");
  if (form) {
  let mode = "wa";
  $$('button[type="submit"]', form).forEach(b => b.addEventListener("click", () => { mode = b.dataset.mode; }));

  const show = (msg, ok) => { status.textContent = msg; status.className = "form-status show " + (ok ? "ok" : "err"); };

  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (form._gotcha.value) return; // spam bot
    let firstBad = null;
    $$("[required]", form).forEach(el => {
      const bad = !el.value.trim();
      el.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad && !firstBad) firstBad = el;
    });
    if (firstBad) { show("Please fill in the required fields marked *.", false); firstBad.focus(); return; }

    const d = Object.fromEntries(new FormData(form).entries());
    const lines = [
      "Hi " + CONFIG.driverName + ", I'd like to book a taxi from " + d.pickup + " to " + d.destination + " on " + niceDate(d.date) + (d.time ? " at " + d.time : "") + ".",
      "",
      "Name: " + d.name,
      "Contact: " + d.contact,
      "Passengers: " + d.passengers,
      "Vehicle: " + d.vehicle
    ];
    if (d.message.trim()) lines.push("Notes: " + d.message.trim());
    const text = lines.join("\n");

    if (mode === "wa") {
      window.open(waUrl(text), "_blank", "noopener");
      show("WhatsApp is opening with your booking details. Just press send.", true);
      return;
    }

    if (CONFIG.formspreeId) {
      try {
        show("Sending…", true);
        const res = await fetch("https://formspree.io/f/" + CONFIG.formspreeId, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify(Object.assign({}, d, { _subject: "Booking request: " + d.pickup + " → " + d.destination }))
        });
        if (!res.ok) throw new Error(res.status);
        form.reset();
        show("Thank you! Your request has been sent. We'll reply with a confirmed price shortly.", true);
        return;
      } catch (err) {
        show("Sorry, that didn't go through. Please try WhatsApp instead. It's the fastest way to reach us.", false);
        return;
      }
    }
    window.location.href = "mailto:" + CONFIG.email + "?subject=" + encodeURIComponent("Booking request: " + d.pickup + " → " + d.destination) + "&body=" + encodeURIComponent(text);
    show("Your email app is opening with the booking details.", true);
  });
  }
})();
