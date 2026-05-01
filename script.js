/* =====================================================================
   Kelvin Kung — Portfolio script.js
   Refactored: single fetch, DocumentFragment, IntersectionObserver lazy
   load, strict data validation, dynamic hero mosaic, language detection.
   ===================================================================== */
"use strict";
import { generateDossier } from './dossier.js';
/* ─── App State ──────────────────────────────────────────────────────── */
const App = (() => {
  let _data = null, _visible = [], _filtered = [], _collabs = [], _lang = "en";
  const LANG_SELECT = document.getElementById("lang-select");

  const t = key => (PORTFOLIO_I18N[_lang]?.[key] ?? PORTFOLIO_I18N.en[key] ?? key);
  const tF = f => f && typeof f === "object" && !Array.isArray(f)
    ? (f[_lang] ?? Object.values(f)[0] ?? "") : (f ?? "");
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);

  const formatDate = d => {
    if (!d) return "";
    const raw = (typeof d === "string" && d.toLowerCase() === "today") ? new Date() : new Date(d);
    if (isNaN(raw)) return d;
    return new Intl.DateTimeFormat(_lang === "ja" ? "ja-JP" : _lang === "zh" ? "zh-CN" : _lang === "es" ? "es" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }).format(raw);
  };

  const sortByDate = arr => [...arr].sort((a, b) => {
    const da = (a.finish || "").toLowerCase() === "today" ? new Date() : new Date(a.finish);
    const db = (b.finish || "").toLowerCase() === "today" ? new Date() : new Date(b.finish);
    return db - da;
  });

  const renderLinks = links =>
    links && typeof links === "object" && Object.keys(links).length
      ? `<div class="btn-group">${Object.entries(links)
        .map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener" class="btn btn-sm">${t("hero-cta")} — ${l}</a>`)
        .join("")}</div>`
      : "";

  /* ── Data Validator ───────────────────────────────────────────────── */
  function isEntryValid(e) {
    if (!e.visible) return false;  // pre-computed flag from Python
    if (!e.id) return false;
    const content = e.content;
    if (!content || typeof content !== "object") return false;
    const hasTrio = content.problem && content.approach && content.outcome;
    const hasDetails = content.details;
    if (!hasTrio && !hasDetails) return false;
    return true;
  }

  /* ── Lazy Image Observer ─────────────────────────────────────────── */
  const lazyObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        lazyObserver.unobserve(img);
      }
    });
  }, { rootMargin: "200px" });

  function makeLazyImg(src, alt, cls = "") {
    return `<img data-src="${src}" src="" alt="${alt}" class="${cls}" loading="lazy" />`;
  }

  function activateLazy() {
    $$("img[data-src]").forEach(img => lazyObserver.observe(img));
  }

  /* ── Animated Counter ────────────────────────────────────────────── */
  function animateCount(el, end, duration = 1800) {
    let start = null;
    const step = ts => {
      start ??= ts;
      const p = Math.min((ts - start) / duration, 1);
      el.textContent = Math.floor(p * end);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  function setupStats(pCount, cCount, iCount) {
    const section = $("#stats-section");
    if (!section) return;
    const ob = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        animateCount($("#count-projects"), pCount);
        animateCount($("#count-collabs"), cCount);
        animateCount($("#count-institutions"), iCount);
        ob.unobserve(section);
      }
    }, { threshold: 0.4 });
    ob.observe(section);
  }

  /* ── Hero Mosaic ─────────────────────────────────────────────────── */
  function renderHero() {
    const grid = $("#tileGrid");
    if (!grid || !_visible.length) return;

    // Pick prestige images: prefer entries with highlight, then sort by finish date desc
    const pool = sortByDate(_visible.filter(e => e.profile_image));
    const heroImgs = pool.map(e => e.profile_image).filter(Boolean).slice(0, 30);

    // Duplicate for seamless loop
    const allImgs = [...heroImgs, ...heroImgs];
    const frag = document.createDocumentFragment();
    allImgs.forEach(src => {
      const div = document.createElement("div");
      div.className = "tile";
      const img = document.createElement("img");
      img.dataset.src = src;
      img.src = "";
      img.alt = "Portfolio image";
      img.loading = "lazy";
      div.appendChild(img);
      frag.appendChild(div);
    });
    grid.appendChild(frag);
    activateLazy();
  }

  /* ── Hero Overlay Text ───────────────────────────────────────────── */
  function renderHeroOverlay() {
    const section = $(".banner");
    if (!section) return;
    let overlay = $("#hero-overlay");
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "hero-overlay";
      overlay.innerHTML = `
        <div class="hero-text">
          <p class="hero-eyebrow" data-lang="hero-role"></p>
          <div class="hero-divider"></div>
          <div class="hero-actions">
            <a href="#highlights" class="btn hero-btn" data-lang="hero-cta"></a>
            <!-- Added Dossier Button -->
            <button id="dossier-btn" class="btn btn-outline hero-btn" data-lang="hero-dossier">Dossier</button>
            <a href="#contact" class="btn btn-ghost hero-btn" data-lang="hero-contact"></a>
          </div>
        </div>`;
      section.appendChild(overlay);

      document.getElementById('dossier-btn').addEventListener('click', () => {
        // Directly get the value from the select element
        const langSelect = document.getElementById('lang-select');
        const currentLang = langSelect ? langSelect.value : 'en';        
        generateDossier(currentLang);
      });
    }
    applyTranslations();
  }

  /* ── Highlights ──────────────────────────────────────────────────── */

  function renderHighlights() {
    const hc = $("#highlights-container");
    if (!hc) return;    
    const highlights = sortByDate(_visible.filter(e => e.highlight))
      .sort((a, b) => a.highlight - b.highlight);

    const frag = document.createDocumentFragment();    
    highlights.forEach(i => {      
      const card = document.createElement("div");
      card.className = "highlight-card clickable-card";
      card.dataset.href = `details.html?projectId=${i.id}`;
      card.innerHTML = `
        <div class="highlight-image">
          <img data-src="${i.profile_image || ''}" src="" alt="${tF(i.title)}" loading="lazy">
        </div>
        <div class="highlight-content">
          <span class="highlight-badge category-${(i.category?.en || i.category || '')}">${tF(i.category)}</span>
          <h3>${tF(i.title)}</h3>
          <p>${tF(i.summary) || ""}</p>
          <p class="highlight-meta">${tF(i.institution)} · ${formatDate(i.finish)}</p>
        </div>`;
      frag.appendChild(card);
    });
    hc.innerHTML = "";
    hc.appendChild(frag);
    activateLazy();
  }

  // Curated cover images per product (from validated images)
  const PORTFOLIO_COVERS = {
    "Robotics": "images/thumbnails/silla_inteligente1.webp",
    "Dashboards": "images/thumbnails/dashboard.webp",
    "Programming": "images/thumbnails/aplicacion_transporte.webp",
    "Electronics": "images/thumbnails/PCB1.webp",
    "Smart Systems": "images/thumbnails/analog.webp",
    "Research & Engineering": "images/thumbnails/semiconductor.webp",
  };

  function renderPortfolios() {
    const pt = $("#portfolios-track");
    if (!pt) return;
    const seen = {};
    _visible.forEach(d => {
      const cat = d.category?.en || d.category || "";
      if ((cat === "Research" || cat === "Professional") && d.Product) seen[d.Product] = (seen[d.Product] || 0) + 1;
    });

    pt.innerHTML = Object.keys(seen).map(p => {
      const meta = CATEGORY_META[p] || CATEGORY_META["Research & Engineering"];
      return `
        <div class="portfolio-card" onclick="window.open('portfolio_summary.html?product=${encodeURIComponent(p)}', '_blank')">
          <div class="p-content">
            <h3>${t(p)}</h3>
            <p>${tF(meta.desc)}</p>
            <span class="p-count">${seen[p]} ${seen[p] === 1 ? 'project' : 'projects'}</span>
          </div>
        </div>`;
    }).join("");
  }

  /* ── View Renderers ──────────────────────────────────────────────── */
  function renderTimeline() {
    const c = $("#timeline-container");
    if (!c) return;
    const rows = [];
    sortByDate(_filtered).forEach((i, idx) => {
      const side = idx % 2 ? "right" : "left";
      const catEn = i.category?.en || i.category || "";
      rows.push(`
        <div class="timeline-item ${side}">
          <div class="timeline-content clickable-card category-${catEn}" data-href="details.html?projectId=${i.id}">
            ${i.profile_image ? `<div class="timeline-profile-image"><img data-src="${i.profile_image}" src="" alt="${tF(i.title)}" loading="lazy"></div>` : ""}
            <h3>${tF(i.title)}</h3>
            <p class="institution">${tF(i.institution)}</p>
            <p>${tF(i.participation) || ""}</p>
            <p class="date">${formatDate(i.finish)}</p>
            ${renderLinks(i.links)}
          </div>
        </div>`);
    });
    c.innerHTML = rows.join("");
    activateLazy();
  }

  function renderAccordion() {
    const c = $("#accordion-container");
    if (!c) return;
    if (!_filtered.length) { c.innerHTML = "<p>No projects found.</p>"; return; }
    const groups = {};
    _filtered.forEach(i => {
      const key = tF(i.institution) || "Other";
      (groups[key] ||= []).push(i);
    });
    const frag = document.createDocumentFragment();
    Object.entries(groups).forEach(([inst, items]) => {
      const block = document.createElement("div");
      block.className = "accordion-category";
      block.innerHTML = `
        <h3>${inst} <span class="acc-count">${items.length}</span></h3>
        <div class="accordion-items">
          ${items.map(i => `
            <div class="accordion-project clickable-card" data-href="details.html?projectId=${i.id}">
              ${i.profile_image ? `<div class="accordion-profile-image"><img data-src="${i.profile_image}" src="" alt="${tF(i.title)}" loading="lazy"></div>` : ""}
              <h4>${tF(i.title)}</h4>
              <p><strong>${tF(i.participation) || ""}</strong></p>
              <p><em>${formatDate(i.finish)}</em></p>
              ${renderLinks(i.links)}
            </div>`).join("")}
        </div>`;
      block.querySelector("h3").addEventListener("click", () =>
        block.querySelector(".accordion-items").classList.toggle("show"));
      frag.appendChild(block);
    });
    c.innerHTML = "";
    c.appendChild(frag);
    activateLazy();
  }

  function renderInteractive() {
    const c = $("#interactive-container");
    if (!c) return;
    if (!_filtered.length) { c.innerHTML = '<p style="color:#888">No projects found.</p>'; return; }
    const rows = [];
    sortByDate(_filtered).forEach(i => {
      const catEn = i.category?.en || i.category || "";
      rows.push(`
        <div class="interactive-card clickable-card category-${catEn}" data-href="details.html?projectId=${i.id}">
          ${i.profile_image ? `<div class="interactive-profile-image"><img data-src="${i.profile_image}" src="" alt="${tF(i.title)}" loading="lazy"></div>` : ""}
          <div class="card-content">
            <span class="card-badge category-${catEn}">${tF(i.category)}</span>
            <h4>${tF(i.title)}</h4>
            <p class="institution">${tF(i.institution)}</p>
            <p class="dates">${formatDate(i.finish)}</p>
            ${renderLinks(i.links)}
          </div>
        </div>`);
    });
    c.innerHTML = rows.join("");
    activateLazy();
  }

  function getActiveView() {
    if ($(".timeline.active")) return "timeline";
    if ($(".accordion.active")) return "accordion";
    return "interactive";
  }

  function renderActiveView() {
    const v = getActiveView();
    v === "timeline" ? renderTimeline()
      : v === "accordion" ? renderAccordion()
        : renderInteractive();
  }

  /* ── Collaborators ───────────────────────────────────────────────── */
  function renderCollaborators(collabs) {
    const container = $(".collab-carousel");
    if (!container) return;
    const uniqueInstitutions = new Set();
    const frag = document.createDocumentFragment();

    collabs.forEach(item => {
      const inst = tF(item.university);
      if (inst) uniqueInstitutions.add(inst);
      const hasWeb = item.webpage?.trim();
      const div = document.createElement("div");
      div.className = "collab-item" + (hasWeb ? " has-link" : "");
      if (hasWeb) {
        div.style.cursor = "pointer";
        div.addEventListener("click", () => window.open(item.webpage, "_blank"));
      }
      div.innerHTML = `
        <div class="collab-description">
          <h3>${tF(item.name)}</h3>
          <p><strong>${tF(item.title)}</strong></p>
          <p>${[tF(item.branch), tF(item.country)].filter(Boolean).join(", ")}</p>
        </div>
        <div class="collab-photo">
          ${item.image_url ? `<img data-src="${item.image_url}" src="" alt="${tF(item.name)}" loading="lazy">` : ""}
        </div>`;
      frag.appendChild(div);
    });
    container.innerHTML = "";
    container.appendChild(frag);
    activateLazy();
    return uniqueInstitutions;
  }

  /* ── Footer ──────────────────────────────────────────────────────── */
  function updateFooter() {
    const em = $("#footer-email"), gh = $("#footer-github");
    if (em) {
      const emailAddr = t("email");
      em.href = `mailto:${emailAddr}`;
      // Optional: update visible text if you show the email on screen
      if (em.dataset.showEmail === "true") em.textContent = emailAddr;
    }
    if (gh) {
      gh.href = t("github");
    }
  }

  /* ── Translations ────────────────────────────────────────────────── */
  function applyTranslations() {
    $$("[data-lang]").forEach(el => { el.innerHTML = t(el.dataset.lang); });
    updateFooter();
  }

  /* ── Filter / View public API ────────────────────────────────────── */
  function filterData(cat) {
    _filtered = cat === "all"
      ? [..._visible]
      : _visible.filter(i =>
        (i.category?.en || i.category || "") === cat);
    renderActiveView();
  }

  function switchViewMode(mode) {
    ["timeline", "accordion", "interactive"].forEach(v => {
      const el = $("." + v);
      if (el) el.classList.remove("active");
    });
    const target = $("." + mode);
    if (target) target.classList.add("active");
    renderActiveView();
  }

  /* ── Init ────────────────────────────────────────────────────────── */
  /* ── Revised Language Detection ── */
  function detectLang() {
    const rawNav = navigator.language || navigator.userLanguage || "en";
    const nav = rawNav.toLowerCase().split('-')[0];
    const supported = ["zh", "ja", "es"];
    const finalLang = supported.includes(nav) ? nav : "en";

    console.log(`[System] Browser Language: ${rawNav} | Detected: ${nav} | Applied: ${finalLang}`);
    return finalLang;
  }

  async function init() {
    _lang = LANG_SELECT.value;
    document.getElementById("year").textContent = new Date().getFullYear();

    // Single fetch — shared across all renderers
    const [entries, collabs] = await Promise.all([
      fetch("data/information.json").then(r => r.json()),
      fetch("data/collaborators.json").then(r => r.json()),
    ]);

    _data = entries;
    _collabs = collabs;
    _visible = entries.filter(isEntryValid);
    _filtered = [..._visible];

    console.info(`[Portfolio] Loaded ${_data.length} entries. Valid: ${_visible.length} | Hidden: ${_data.length - _visible.length}`);

    // Apply language `first`
    applyTranslations();
    updateFooter();

    // Render all sections from the same in-memory data
    renderHero();
    renderHeroOverlay();
    renderHighlights();
    renderPortfolios();
    filterData("all");
    switchViewMode("timeline");

    // Collaborators & stats
    const institutions = renderCollaborators(collabs);
    setupStats(_data.length, collabs.length, institutions.size);
  }

  /* ── Events ──────────────────────────────────────────────────────── */
  document.addEventListener("DOMContentLoaded", () => {
    LANG_SELECT.value = detectLang();

    LANG_SELECT.addEventListener("change", () => {
      _lang = LANG_SELECT.value;
      localStorage.setItem("portfolio_lang", _lang);
      applyTranslations();
      updateFooter();
      renderHighlights();
      renderPortfolios();
      renderActiveView();
      renderCollaborators(_collabs);
    });

    document.addEventListener("click", e => {
      if (e.target.closest("a, .btn, select")) return;
      const card = e.target.closest(".clickable-card");
      if (card?.dataset.href) window.open(card.dataset.href, "_blank");
    });

    // Expose to HTML onclick attributes
    window.filterData = filterData;
    window.switchViewMode = switchViewMode;

    init().catch(err => console.error("[Portfolio] Init failed:", err));
  });

  return { filterData, switchViewMode };
})();