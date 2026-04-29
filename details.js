/* =====================================================================
   Kelvin Kung — details.js
   Consolidated logic for premium project details view.
   Features: dynamic hero, justified gallery, I18n, seamless Home sync.
   ===================================================================== */

"use strict";

const ProjectApp = (() => {
  let _project = null, _lang = "en";  
  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const LANG_SELECT = $("#lang-select");
  const CONTENT_EL = $("#projectContent");

  const t = key => (PORTFOLIO_I18N[_lang]?.[key] ?? PORTFOLIO_I18N.en[key] ?? key);
  const tF = f => f && typeof f === "object" && !Array.isArray(f) 
                 ? (f[_lang] ?? Object.values(f)[0] ?? "") : (f ?? "");

  const formatDate = d => {
    if (!d) return "";
    const raw = (typeof d === "string" && d.toLowerCase() === "today") ? new Date() : new Date(d);
    if (isNaN(raw)) return d;
    return new Intl.DateTimeFormat(_lang === "ja" ? "ja-JP" : _lang === "zh" ? "zh-CN" : _lang === "es" ? "es" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }).format(raw);
  };

  /* ── Justified Gallery Logic ──────────────────────────────────────── */
  const applyJustifiedLayout = () => {
    const container = $("#justifiedGallery");
    if (!container) return;
    const imgs = [...container.querySelectorAll("img")];
    if (!imgs.length) return;

    const gap = 12;
    const width = container.clientWidth;
    const targetH = window.innerWidth < 768 ? 160 : 280;

    Promise.all(imgs.map(img =>
      img.complete ? Promise.resolve(img) : new Promise(res => img.onload = () => res(img))
    )).then(images => {
      let rows = [], row = [], aspect = 0;
      images.forEach(img => {
        const r = img.naturalWidth / img.naturalHeight;
        row.push({ img, r });
        aspect += r;
        if (aspect * targetH + gap * (row.length - 1) >= width) {
          rows.push({ row, aspect });
          row = []; aspect = 0;
        }
      });
      if (row.length) rows.push({ row, aspect });

      const frag = document.createDocumentFragment();
      rows.forEach(({ row, aspect }) => {
        const h = (width - gap * (row.length - 1)) / aspect;
        const div = document.createElement("div");
        div.className = "justified-row";
        row.forEach(({ img, r }) => {
          const el = document.createElement("img");
          el.src = img.src;
          el.alt = "Project gallery image";
          el.loading = "lazy";
          el.style.cssText = `height:${h}px;width:${h * r}px`;
          div.appendChild(el);
        });
        frag.appendChild(div);
      });
      container.innerHTML = "";
      container.appendChild(frag);
    });
  };

  /* ── Rendering ────────────────────────────────────────────────────── */
  function renderHero() {
    const grid = $("#tileGrid");
    const overlay = $("#hero-overlay");
    if (!grid || !overlay || !_project) return;

    // Background Grid (Blurred)
    const imgs = (_project.images && _project.images.length) ? _project.images : [_project.profile_image].filter(Boolean);
    const pool = [...imgs, ...imgs, ...imgs].slice(0, 18); // fallback loop
    grid.innerHTML = pool.map(src => `<div class="tile"><img src="${src}" alt=""></div>`).join("");

    // Overlay content
    overlay.innerHTML = `
      <div class="hero-text">
        <p class="hero-eyebrow">${tF(_project.category)}</p>
        <h1 class="hero-title">${tF(_project.title)}</h1>
        <div class="hero-divider"></div>
        <a href="index.html#projects" class="btn btn-ghost btn-sm">${t('back-home')}</a>
      </div>`;
  }

  function renderTables() {
    const content = [];

    // Links Table
    if (_project.links && Object.keys(_project.links).length) {
      content.push(`
        <div class="content-section">
          <h3>${t('links')}</h3>
          <table class="links-table">
            <thead><tr><th>${t('col-reference')}</th><th>${t('col-url')}</th></tr></thead>
            <tbody>${Object.entries(_project.links).map(([label, url]) =>
        `<tr><td><strong>${label}</strong></td><td><a href="${url}" target="_blank" rel="noopener">${url}</a></td></tr>`).join("")}
            </tbody>
          </table>
        </div>`);
    }

    // Collaborators Table
    if (_project.collaborators && _project.collaborators.length) {
      content.push(`
        <div class="content-section">
          <h3>${t('collab-title')}</h3>
          <table class="links-table">
            <thead><tr><th>${t('col-name')}</th><th>${t('col-role')}</th><th>${t('col-contact')}</th></tr></thead>
            <tbody>${_project.collaborators.map(c =>
        `<tr>
                <td><strong>${tF(c.name)}</strong></td>
                <td>${tF(c.roles) || tF(c.institution) || ""}</td>
                <td>${c.email ? `<a href="mailto:${c.email}">${c.email}</a>` : "-"}</td>
               </tr>`).join("")}
            </tbody>
          </table>
        </div>`);
    }

    return content.join("");
  }

  function renderProject() {
    if (!_project) return;

    const content = _project.content || {};
    const sections = [];
    // Quote Block
    if (content.quote) {
      sections.push(` <div class="content-section"><blockquote>"${tF(content.quote)}"</blockquote></div>`);
    }
    // Summary & Meta
    sections.push(`
      <div class="abstract-meta">
        <div class="meta-item"><strong>${t("label-institution")}:</strong> ${tF(_project.institution)}</div>
        <div class="meta-item"><strong>${t("label-branch")}:</strong> ${tF(_project.branch)}</div>
        <div class="meta-item"><strong>${t("label-timeline")}:</strong> ${formatDate(_project.start)} — ${formatDate(_project.finish)}</div>  
        <i>${tF(_project.summary)}</i>
      </div>`);

    // Trio Content (Problem, Approach, Outcome)
    ["problem", "approach", "outcome", "details"].forEach(key => {
      if (content[key]) {
        sections.push(`
          <div class="content-section section-${key}">
            <h3>${t(key)}</h3>
            <p>${tF(content[key])}</p>
          </div>`);
      }
    });

    // Gallery & Tables
    CONTENT_EL.innerHTML = `
      ${sections.join("")}
      <section id="justifiedGallery">${(_project.images || []).map(src => `<img src="${src}" src="" loading="lazy">`).join("")}</section>
      ${renderTables()}
    `;

    renderHero();
    setTimeout(applyJustifiedLayout, 50);
  }

  /* ── Language ────────────────────────────────────────────────────── */
  function applyTranslations() {
    $$("[data-lang]").forEach(el => { el.innerHTML = t(el.dataset.lang); });
    
    // Pull email and github from i18n data
    const em = $("#footer-email"), gh = $("#footer-github");
    if (em) em.href = `mailto:${t("email")}`;
    if (gh) gh.href = t("github");
  }

  /* ── Init ────────────────────────────────────────────────────────── */
  async function init() {
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('projectId'));
    if (!projectId) {
      CONTENT_EL.innerHTML = "<h2>Project ID missing.</h2>";
      return;
    }

    const data = await fetch("data/information.json").then(r => r.json());
    _project = data.find(p => p.id === projectId);

    if (!_project) {
      CONTENT_EL.innerHTML = "<h2>Project not found.</h2>";
      return;
    }

    _lang = LANG_SELECT.value;
    applyTranslations();
    renderProject();
  }

  document.addEventListener("DOMContentLoaded", () => {
    // Inheritance from index.html via localStorage
    _lang = localStorage.getItem("portfolio_lang") || 
            (["zh", "ja", "es"].find(l => navigator.language.toLowerCase().startsWith(l)) || "en");
    
    LANG_SELECT.value = _lang;
    applyTranslations();

    LANG_SELECT.addEventListener("change", () => {
      _lang = LANG_SELECT.value;
      localStorage.setItem("portfolio_lang", _lang);
      applyTranslations();
      renderProject();
    });

    init().catch(err => console.error("[ProjectApp] Init failed:", err));
  });

})();