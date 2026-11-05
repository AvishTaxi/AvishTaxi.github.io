/* =========================================================
   CONFIG: edit these values. Everything on the page updates from here.
   ========================================================= */
const CONFIG = {
  driverName: "Avishka",
  whatsapp: "94765627939",            // EDIT: country code + number, digits only (no +, no spaces)
  phoneDisplay: "+94 76 562 7939",    // EDIT: how the number is shown on the page
  email: "",                          // EDIT: booking email address (email links stay hidden while empty)
  formspreeId: "",                    // OPTIONAL: Formspree form ID (e.g. "xayzabcd") so "Send by email" posts silently. Empty = opens the visitor's email app.
  googleReviewsUrl: "https://www.google.com/maps/search/?api=1&query=Avish+Taxi+Tangalle", // EDIT: your Google Business profile link
  writeReviewUrl: "",                 // OPTIONAL: your Google "write a review" link (g.page/r/…/review)
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
    ctx = { from: el.dataset.from || "", to: el.dataset.to || "", tour: el.dataset.tour || "", vehicle: el.dataset.vehicle || "" };
    $("#bk-kicker").textContent = bkDef.kicker;
    $("#bk-title").textContent = type === "route" && ctx.from ? ctx.from + " → " + (ctx.to || "") : (type === "tour" && ctx.tour ? ctx.tour : bkDef.title);
    const init = { from: ctx.from, to: ctx.to, tour: ctx.tour || TOURS[0], name: savedName,
      vehicle: ctx.vehicle ? VEHICLES.find(v => v.startsWith(ctx.vehicle)) : "", airport: /mattala/i.test(ctx.from) ? "Mattala (HRI)" : "",
      veh2: ctx.vehicle === "Van" ? "Van / shuttle (4–8)" : "" };
    bkFields.innerHTML = defs().map(([id, def]) => fieldHTML(id, def, init[id])).join("");
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
    ["home", "services", "pricing", "tours", "gallery", "fleet", "reviews", "contact"].forEach(id => { const el = document.getElementById(id); if (el) spy.observe(el); });

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
