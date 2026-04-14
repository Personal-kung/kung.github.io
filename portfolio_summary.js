/* =====================================================================
   Kelvin Kung — portfolio_summary.js
   Consolidated logic for product-specific portfolios.
   Features: dynamic project cards, consistent I18n, seamless Home sync.
   ===================================================================== */

"use strict";

const SummaryApp = (() => {
  let _data = [];
  let _lang = "en";

  const $   = s => document.querySelector(s);
  const $$  = s => document.querySelectorAll(s);
  const LANG_SELECT = $("#lang-select");

  const I18N = {
    en: {
      "subtitle": "Select a project below to learn more about my contributions to this field.",
      "empty": "No projects found.",
      "name": "Kelvin Kung",
      "nav-about": "About", "nav-exp": "Experience", "nav-projects": "Projects", "nav-contact": "Contact",
      "contact-title": "Contact", "contact-text": "Interested in working or collaborating with me?",
      "footer-name": "Kelvin Kung"
    },
    es: {
      "subtitle": "Selecciona un proyecto de abajo para conocer más sobre mis contribuciones en este campo.",
      "empty": "No se encontraron proyectos.",
      "name": "Kelvin Kung",
      "nav-about": "Acerca", "nav-exp": "Experiencia", "nav-projects": "Proyectos", "nav-contact": "Contacto",
      "contact-title": "Contacto", "contact-text": "¿Interesado en trabajar o colaborar conmigo?",
      "footer-name": "Kelvin Kung"
    },
    zh: {
      "subtitle": "在下面选择一个项目以了解我在此领域内的贡献。",
      "empty": "未找到项目。",
      "name": "龚颖贤",
      "nav-about": "关于", "nav-exp": "经验", "nav-projects": "项目", "nav-contact": "联系",
      "contact-title": "联系", "contact-text": "有兴趣与我合作吗？",
      "footer-name": "龚颖贤"
    },
    ja: {
      "subtitle": "以下のプロジェクトを選択して、この分野における私の貢献について学んでください。",
      "empty": "プロジェクトが見つかりません。",
      "name": "クン・ケルビン",
      "nav-about": "概要", "nav-exp": "経験", "nav-projects": "プロジェクト", "nav-contact": "連絡先",
      "contact-title": "連絡先", "contact-text": "一緒に働いたり協力したりしませんか？",
      "footer-name": "クン・ケルビン"
    }
  };

  const t   = key => (I18N[_lang]?.[key] ?? I18N.en[key] ?? key);
  const tF  = f => f && typeof f === "object" && !Array.isArray(f)
                    ? (f[_lang] ?? Object.values(f)[0] ?? "")
                    : (f ?? "");

  const formatDate = d => {
    if (!d) return "";
    const raw = (typeof d === "string" && d.toLowerCase() === "today") ? new Date() : new Date(d);
    if (isNaN(raw)) return d;
    return new Intl.DateTimeFormat(_lang === "ja" ? "ja-JP" : _lang === "zh" ? "zh-CN" : _lang === "es" ? "es" : "en-US",
      { year: "numeric", month: "short", day: "numeric" }).format(raw);
  };

  const renderLinks = links =>
    links && typeof links === "object" && Object.keys(links).length
      ? `<div class="btn-group">${Object.entries(links)
          .map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener" class="btn btn-sm">More info in ${l}</a>`)
          .join("")}</div>`
      : "";

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

  function activateLazy() {
    $$("img[data-src]").forEach(img => lazyObserver.observe(img));
  }

  function renderProjects() {
    const urlParams = new URLSearchParams(window.location.search);
    const productType = urlParams.get('product') || 'Projects';
    const container = $("#summary-container");
    if (!container) return;

    $("#product-title").textContent = productType + " Portfolio";
    $("#product-subtitle").textContent = t('subtitle');

    const filtered = _data.filter(d => {
        const cat = (d.category?.en || d.category || '').toLowerCase();
        if(!cat.includes('research') && !cat.includes('professional')) return false;
        return d.Product === productType && d.visible !== false;
    }).sort((a, b) => {
        const da = (a.finish?.toLowerCase() === "today" ? new Date() : new Date(a.finish));
        const db = (b.finish?.toLowerCase() === "today" ? new Date() : new Date(b.finish));
        return db - da;
    });

    if (!filtered.length) {
      container.innerHTML = `<p style="color:#888; text-align: center; width: 100%; grid-column: 1/-1;">${t('empty')}</p>`;
      return;
    }

    const frag = document.createDocumentFragment();
    filtered.forEach(i => {
      const catClass = i.category?.en ? i.category.en : i.category;
      const card = document.createElement("div");
      card.className = `interactive-card clickable-card category-${catClass}`;
      card.dataset.href = `details.html?projectId=${i.id}`;
      card.innerHTML = `
        <div class="interactive-profile-image">
           <img data-src="${i.profile_image}" src="" alt="${tF(i.title)}" loading="lazy">
        </div>
        <div class="card-content">
          <span class="card-badge category-${catClass}">${tF(i.category)}</span>
          <h4>${tF(i.title)}</h4>
          <p><strong>${tF(i.participation)}</strong></p>
          <p class="institution">${tF(i.institution)}</p>
          <p class="dates">${formatDate(i.finish)}</p>
          ${renderLinks(i.links)}
        </div>`;
      frag.appendChild(card);
    });
    
    container.innerHTML = "";
    container.appendChild(frag);
    activateLazy();
  }

  function applyTranslations() {
    $$("[data-lang]").forEach(el => {
      const v = t(el.dataset.lang);
      if (v) el.innerHTML = v;
    });
    // Footer emails sync
    const em = $("#footer-email");
    const gh = $("#footer-github");
    if (em && gh) {
       if (_lang === "zh" || _lang === "ja") {
         em.href = "mailto:kelvinmext1@gmail.com";
         gh.href = "https://github.com/Personal-kung";
       } else {
         em.href = "mailto:kelvin.kung@utp.ac.pa";
         gh.href = "https://github.com/kelvinutp";
       }
    }
  }

  async function init() {
    const j = await fetch("data/information.json").then(r => r.json());
    _data = j;
    _lang = LANG_SELECT.value;
    applyTranslations();
    renderProjects();
  }

  document.addEventListener("DOMContentLoaded", () => {
    const navLang = navigator.language || "";
    LANG_SELECT.value = ["zh","ja","es"].find(l => navLang.startsWith(l)) || "en";
    
    LANG_SELECT.addEventListener("change", () => {
      _lang = LANG_SELECT.value;
      applyTranslations();
      renderProjects();
    });

    document.addEventListener("click", e => {
      if (e.target.closest("a, .btn, select")) return;
      const card = e.target.closest(".clickable-card");
      if (card?.dataset.href) window.open(card.dataset.href, "_blank");
    });

    init().catch(err => console.error("[SummaryApp] Init failed:", err));
  });

})();
