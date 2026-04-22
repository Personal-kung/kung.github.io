/* =====================================================================
   Kelvin Kung — details.js
   Consolidated logic for premium project details view.
   Features: dynamic hero, justified gallery, I18n, seamless Home sync.
   ===================================================================== */

"use strict";

const ProjectApp = (() => {
  let _project = null;
  let _lang = "en";

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const LANG_SELECT = $("#lang-select");
  const CONTENT_EL = $("#projectContent");

  /* ── Translations (Ported from script.js) ─────────────────────────── */
  const I18N = {
    en: {
      "name": "Kelvin Kung",
      "nav-about": "About", "nav-exp": "Experience", "nav-projects": "Projects", "nav-contact": "Contact",
      "contact-title": "Contact", "contact-text": "Interested in working or collaborating with me?",
      "footer-name": "Kelvin Kung",
      "collab-title": "Project Collaborators",
      "problem": "Technical Challenge",
      "approach": "Methodology & Role",
      "outcome": "Key Outcomes & Results",
      "details": "Project Details",
      "links": "Resources & Links",
      "back-home": "Back to Home"
    },
    es: {
      "name": "Kelvin Kung",
      "nav-about": "Acerca", "nav-exp": "Experiencia", "nav-projects": "Proyectos", "nav-contact": "Contacto",
      "contact-title": "Contacto", "contact-text": "¿Interesado en trabajar o colaborar conmigo?",
      "footer-name": "Kelvin Kung",
      "collab-title": "Colaboradores del Proyecto",
      "problem": "Desafío Técnico",
      "approach": "Metodología y Rol",
      "outcome": "Resultados y Logros",
      "details": "Detalles del Proyecto",
      "links": "Recursos y Enlaces",
      "back-home": "Volver al inicio"
    },
    zh: {
      "name": "龚颖贤",
      "nav-about": "关于", "nav-exp": "经验", "nav-projects": "项目", "nav-contact": "联系",
      "contact-title": "联系", "contact-text": "有兴趣与我合作吗？",
      "footer-name": "龚颖贤",
      "collab-title": "项目合作者",
      "problem": "技术挑战",
      "approach": "方法与角色",
      "outcome": "主要成果",
      "details": "项目详情",
      "links": "资源与链接",
      "back-home": "返回主页"
    },
    ja: {
      "name": "クン・ケルビン",
      "nav-about": "概要", "nav-exp": "経験", "nav-projects": "プロジェクト", "nav-contact": "連絡先",
      "contact-title": "連絡先", "contact-text": "一緒に働いたり協力したりしませんか？",
      "footer-name": "クン・ケルビン",
      "collab-title": "プロジェクト協力者",
      "problem": "技術的課題",
      "approach": "手法と役割",
      "outcome": "主な成果",
      "details": "プロジェクト詳細",
      "links": "リソースとリンク",
      "back-home": "ホームに戻る"
    }
  };

  const t = key => (I18N[_lang]?.[key] ?? I18N.en[key] ?? key);
  const tF = f => f && typeof f === "object" && !Array.isArray(f)
    ? (f[_lang] ?? Object.values(f)[0] ?? "")
    : (f ?? "");

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
            <thead><tr><th>Reference</th><th>Target URL</th></tr></thead>
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
            <thead><tr><th>Name</th><th>Role / Institution</th><th>Contact</th></tr></thead>
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
        <div><strong>Institution:</strong> ${tF(_project.institution)}</div>
        ${_project.branch ? `<div><strong>Branch:</strong> ${tF(_project.branch)}</div>` : ""}
        <div><strong>Timeline:</strong> ${formatDate(_project.start)} — ${formatDate(_project.finish)}</div>
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
    $$("[data-lang]").forEach(el => {
      const v = t(el.dataset.lang);
      if (v) el.innerHTML = v;
    });
    const em = $("#footer-email");
    const gh = $("#footer-github");
    if (em && gh) {
      if (_lang === "zh" || _lang === "ja") {
        em.href = "mailto:kung-gomez-kelvin2604@mail.kyutech.jp";
        gh.href = "https://github.com/Kung-Kelvin";
      } else {
        em.href = "mailto:kelvin.kung@utp.ac.pa";
        gh.href = "https://github.com/kelvinutp";
      }
    }
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
    const navLang = navigator.language || "";
    const detected = ["zh", "ja", "es"].find(l => navLang.startsWith(l)) || "en";
    LANG_SELECT.value = detected;
    _lang = detected;

    LANG_SELECT.addEventListener("change", () => {
      _lang = LANG_SELECT.value;
      applyTranslations();
      renderProject();
    });

    window.addEventListener("resize", () => {
      clearTimeout(window.resizeTimer);
      window.resizeTimer = setTimeout(applyJustifiedLayout, 150);
    });

    init().catch(err => console.error("[ProjectApp] Init failed:", err));
  });

})();