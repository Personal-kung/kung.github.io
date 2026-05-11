/* =====================================================================
   Kelvin Kung — Portfolio script.js
   Refactored: single fetch, DocumentFragment, IntersectionObserver lazy
   load, strict data validation, dynamic hero mosaic, language detection.
   ===================================================================== */

"use strict";

/* ─── App State ──────────────────────────────────────────────────────── */
const App = (() => {
  let _data = null;   // full JSON (including non-visible entries)
  let _visible = [];     // entries that passed validation
  let _filtered = [];     // current filter slice
  let _collabs = [];     // collaborators data
  let _lang = "en";

  const LANG_SELECT = document.getElementById("lang-select");

  /* ── Translations ─────────────────────────────────────────────────── */
  const I18N = {
    en: {
      "name": "Kelvin Kung",
      "nav-about": "About",
      "nav-exp": "Experience",
      "nav-projects": "Projects",
      "nav-contact": "Contact",
      "about-title": "Kelvin Kung",
      "about-intro": "Kelvin Kung is an Electrical and Electronics Engineer currently pursuing a Master's degree at Kyushu Institute of Technology (KYUTECH), researching Very Large Scale Integration (VLSI) testing methodologies.",
      "about-body": "Kelvin worked at the Technological University of Panama (UTP) from 2022 to 2025, leading high-voltage electrical systems design with an emphasis on real-world innovation. Throughout his career, he designed and installed complex electrical infrastructure — lightning protection, grounding systems, and reactive power compensation — and established national benchmarks for university electricity monitoring using SCADA and Power BI.",
      "about-body1": "He conducted and organized power quality analysis campaigns across public and private sectors nationwide, and has hands-on expertise in 13.8 kV distribution systems, ensuring safety, efficiency, and regulatory compliance.",
      "about-body2": "On the electronics side, his work spans electromechanical teleoperation, hyperspectral analysis for precision agriculture, and co-authoring Panama's first patented nanoelectrical semiconductor circuit. He has contributed to IEEE conferences and Neurocomputing (Elsevier) publications and designed a stadium scoreboard for UTP's baseball field.",
      "about-body3": "In 2023 and 2024, Kelvin served as international judge for RoboCup Jr. competitions in Europe and the Americas. He has built low-cost robotics kits deployed in public schools and led assistive technology projects, including a smart wheelchair system for paraplegic individuals.",
      "about-conclusion": "B.S. in Electrical and Electronics Engineering — Technological University of Panama (2022).",
      "exp-title": "Experience",
      "exp-academic": "Academic",
      "exp-research": "Research",
      "exp-professional": "Professional",
      "exp-academic-summary": "Degrees, teaching, and academic achievements in Electrical and Electronics Engineering — fostering innovation through education and mentorship.",
      "exp-research-summary": "Publications, collaborations, and ongoing investigations in integrated circuits and semiconductors — dedicated to advancing knowledge and practical discovery.",
      "exp-professional-summary": "Real-world industry roles, consulting, and applied engineering work — bridging scientific rigor with technological impact.",
      "highlights-title": "Highlights",
      "portfolios-title": "Product Portfolios",
      "portfolios-subtitle": "Explore grouped deliverables from my professional and research trajectory.",
      "collab-title": "Professionals I've Worked With",
      "contact-title": "Contact",
      "contact-text": "Interested in working or collaborating with me?",
      "footer-name": "Kelvin Kung",
      "filter-all": "All",
      "filter-prof": "Professional",
      "filter-rese": "Research",
      "filter-acad": "Academic",
      "filter-time": "Timeline",
      "filter-time-title": "Timeline View",
      "filter-acco": "Accordion",
      "filter-acco-title": "Accordion View",
      "filter-inte": "Interactive",
      "filter-inte-title": "Interactive View",
      "stats-projects": "Projects",
      "stats-collaborators": "Collaborators",
      "stats-institutions": "Institutions",
      "brand-title": "Global Partners & Institutions",
      "hero-role": "Electrical and Electronics Engineer · VLSI Researcher · International Collaborator",
      "hero-cta": "View My Work",
      "hero-contact": "Get in Touch",
    },
    es: {
      "name": "Kelvin Kung",
      "nav-about": "Acerca",
      "nav-exp": "Experiencia",
      "nav-projects": "Proyectos",
      "nav-contact": "Contacto",
      "about-title": "Kelvin Kung",
      "about-intro": "Kelvin Kung es Ingeniero Eléctrico y Electrónico, actualmente cursando un Máster en el Instituto Tecnológico de Kyushu (KYUTECH), investigando metodologías de prueba de Integración a Muy Gran Escala (VLSI).",
      "about-body": "Kelvin trabajó en la Universidad Tecnológica de Panamá (UTP) de 2022 a 2025, liderando el diseño de sistemas eléctricos de alta tensión con énfasis en la innovación aplicada. Diseñó e instaló infraestructura eléctrica compleja — protección contra rayos, sistemas de puesta a tierra y compensación de potencia reactiva — y estableció puntos de referencia nacionales para el monitoreo eléctrico universitario mediante SCADA y Power BI.",
      "about-body1": "Realizó y coordinó campañas de análisis de calidad de energía en los sectores público y privado a nivel nacional, con experiencia directa en sistemas de distribución de 13,8 kV.",
      "about-body2": "En el ámbito electrónico, su trabajo abarca teleoperación electromecánica, análisis hiperespectral para agricultura de precisión y la coautoría de la primera patente panameña de circuitos semiconductores nanoeléctricos. Ha contribuido a conferencias IEEE y publicaciones en Neurocomputing (Elsevier).",
      "about-body3": "En 2023 y 2024, Kelvin fue juez internacional en competencias RoboCup Jr. en Europa y América. Ha construido kits de robótica de bajo costo para escuelas públicas y liderado proyectos de tecnología asistiva, incluyendo una silla de ruedas inteligente para personas parapléjicas.",
      "about-conclusion": "Licenciatura en Ingeniería Eléctrica y Electrónica — Universidad Tecnológica de Panamá (2022).",
      "exp-title": "Experiencia",
      "exp-academic": "Académico",
      "exp-research": "Investigación",
      "exp-professional": "Profesional",
      "exp-academic-summary": "Títulos, enseñanza y logros académicos en Ingeniería Eléctrica y Electrónica — promoviendo la innovación mediante la educación y la mentoría.",
      "exp-research-summary": "Publicaciones, colaboraciones e investigaciones en circuitos integrados y semiconductores — dedicados al avance del conocimiento y el descubrimiento práctico.",
      "exp-professional-summary": "Roles en la industria, consultoría y trabajo de ingeniería aplicada — uniendo el rigor científico con el impacto tecnológico.",
      "highlights-title": "Destacados",
      "portfolios-title": "Portafolios de Productos",
      "portfolios-subtitle": "Explore los productos agrupados de mi trayectoria profesional e investigadora.",
      "collab-title": "Profesionales con los que he colaborado",
      "contact-title": "Contacto",
      "contact-text": "¿Interesado en trabajar o colaborar conmigo?",
      "footer-name": "Kelvin Kung",
      "filter-all": "Todos",
      "filter-prof": "Profesional",
      "filter-rese": "Investigación",
      "filter-acad": "Académico",
      "filter-time": "Cronológico",
      "filter-time-title": "Vista Cronológica",
      "filter-acco": "Acordeón",
      "filter-acco-title": "Vista Acordeón",
      "filter-inte": "Interactivo",
      "filter-inte-title": "Vista Interactiva",
      "stats-projects": "Proyectos",
      "stats-collaborators": "Colaboradores",
      "stats-institutions": "Instituciones",
      "brand-title": "Alianzas Globales e Instituciones",
      "hero-role": "Ingeniero Eléctrico y Electrónico · Investigador VLSI · Colaborador Internacional",
      "hero-cta": "Ver Mi Trabajo",
      "hero-contact": "Contactar",
    },
    zh: {
      "name": "龚颖贤",
      "nav-about": "关于",
      "nav-exp": "经验",
      "nav-projects": "项目",
      "nav-contact": "联系",
      "about-title": "龚颖贤",
      "about-intro": "龚颖贤是一名电气与电子工程师，目前就读于九州工业大学（KYUTECH），攻读硕士学位，研究超大规模集成电路（VLSI）测试方法。",
      "about-body": "颖贤于2022年至2025年在巴拿马科技大学（UTP）工作，主导高压电气系统设计，注重实际应用创新。他设计并安装了复杂的电气基础设施，涵盖防雷系统、接地系统和无功补偿系统，并利用SCADA和Power BI为全国高校电力监控树立了标杆。",
      "about-body1": "他在全国公共与私营部门开展并协调了电能质量分析活动，并在13.8kV配电系统方面拥有丰富的实践经验。",
      "about-body2": "在电子领域，其工作涉及机电遥操作、农业精准高光谱分析以及巴拿马首个纳米电气半导体电路专利的联合开发。他为IEEE会议及《神经计算》（爱思唯尔）期刊贡献了多篇论文。",
      "about-body3": "2023年和2024年，颖贤担任欧洲和美洲RoboCup Jr.大赛国际裁判。他还为公立学校制作了低成本机器人套件，并主导开展了辅助技术项目，包括为截瘫患者开发智能轮椅系统。",
      "about-conclusion": "电气与电子工程理学学士 — 巴拿马科技大学（2022年）。",
      "exp-title": "经验",
      "exp-academic": "学术",
      "exp-research": "研究",
      "exp-professional": "职业",
      "exp-academic-summary": "电气与电子工程领域的学位、教学和学术成就——通过教育和指导促进创新。",
      "exp-research-summary": "集成电路与半导体领域的论文、合作研究及持续探索——致力于推动知识进步与实践发现。",
      "exp-professional-summary": "实际行业角色、咨询及应用工程工作——将科学严谨性与技术影响力相结合。",
      "highlights-title": "亮点",
      "portfolios-title": "产品组合",
      "portfolios-subtitle": "探索我职业与研究轨迹中的分组交付成果。",
      "collab-title": "合作过的专业人士",
      "contact-title": "联系",
      "contact-text": "有兴趣与我合作吗？",
      "footer-name": "龚颖贤",
      "filter-all": "全部",
      "filter-prof": "职业",
      "filter-rese": "研究",
      "filter-acad": "学术",
      "filter-time": "时间线",
      "filter-time-title": "时间线视图",
      "filter-acco": "折叠",
      "filter-acco-title": "折叠视图",
      "filter-inte": "交互",
      "filter-inte-title": "交互视图",
      "stats-projects": "项目",
      "stats-collaborators": "合作者",
      "stats-institutions": "机构",
      "brand-title": "全球合作伙伴与机构",
      "hero-role": "电气和电子工程师 · VLSI研究员 · 国际合作者",
      "hero-cta": "查看我的工作",
      "hero-contact": "联系我",
    },
    ja: {
      "name": "クン・ケルビン",
      "nav-about": "概要",
      "nav-exp": "経験",
      "nav-projects": "プロジェクト",
      "nav-contact": "連絡先",
      "about-title": "クン・ケルビン",
      "about-intro": "クン・ケルビンは電気電子工学エンジニアであり、現在九州工業大学（KYUTECH）で超大規模集成回路（VLSI）テスト手法を研究する修士課程に在籍しています。",
      "about-body": "ケルビンは2022年から2025年までパナマ工科大学（UTP）に勤務し、高電圧電気システムの設計を主導しました。避雷システム、接地システム、無効電力補償システムを含む複雑な電気インフラを設計・設置し、SCADAとPower BIを活用して全国的な大学電力監視の基準を確立しました。",
      "about-body1": "全国の公共・民間部門において電力品質分析キャンペーンを実施・指揮し、13.8kV配電システムに関する実践的専門知識を持っています。",
      "about-body2": "電子工学の分野では、電気機械遠隔操作、精密農業のための高スペクトル分析、パナマ初のナノ電気半導体回路特許の共同開発に携わってきました。IEEEカンファレンスや Neurocomputing（Elsevier）誌への論文投稿実績もあります。",
      "about-body3": "2023年と2024年、ケルビンはヨーロッパと南北アメリカで開催されたRoboCup Jr.競技会の国際審査員を務めました。公立学校へ低コストのロボットキットを提供し、対麻痺者向けスマート車椅子システムなどの支援技術プロジェクトを主導してきました。",
      "about-conclusion": "電気電子工学理学士 — パナマ工科大学（2022年）。",
      "exp-title": "経験",
      "exp-academic": "学術",
      "exp-research": "研究",
      "exp-professional": "プロフェッショナル",
      "exp-academic-summary": "電気電子工学における学位・教育・学術的業績 — 教育とメンターシップを通じたイノベーションの推進。",
      "exp-research-summary": "集積回路と半導体に関する出版物、共同研究、継続中の研究 — 知識の進歩と実践的発見に尽力。",
      "exp-professional-summary": "実際の産業界での役割、コンサルティング、応用工学 — 科学的厳密さと技術的影響力の融合。",
      "highlights-title": "ハイライト",
      "portfolios-title": "製品ポートフォリオ",
      "portfolios-subtitle": "私の職業・研究の軌跡からグループ化された成果物をご覧ください。",
      "collab-title": "共同研究した専門家",
      "contact-title": "連絡先",
      "contact-text": "一緒に働いたり協力したりしませんか？",
      "footer-name": "クン・ケルビン",
      "filter-all": "すべて",
      "filter-prof": "専門分野",
      "filter-rese": "研究",
      "filter-acad": "学術",
      "filter-time": "タイムライン",
      "filter-time-title": "タイムライン表示",
      "filter-acco": "アコーディオン",
      "filter-acco-title": "アコーディオン表示",
      "filter-inte": "インタラクティブ",
      "filter-inte-title": "インタラクティブ表示",
      "stats-projects": "プロジェクト",
      "stats-collaborators": "協力者",
      "stats-institutions": "機構",
      "brand-title": "連携機関・ブランド",
      "hero-role": "電気・電子エンジニア · VLSI研究者 · 国際コラボレーター",
      "hero-cta": "作品を見る",
      "hero-contact": "お問い合わせ",
    },
  };

  /* ── Utilities ────────────────────────────────────────────────────── */
  const t = key => (I18N[_lang]?.[key] ?? I18N.en[key] ?? key);
  const tF = f => f && typeof f === "object" && !Array.isArray(f)
    ? (f[_lang] ?? Object.values(f)[0] ?? "")
    : (f ?? "");
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
        .map(([l, u]) => `<a href="${u}" target="_blank" rel="noopener" class="btn btn-sm">More info — ${l}</a>`)
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
            <a href="#contact" class="btn btn-ghost hero-btn" data-lang="hero-contact"></a>
          </div>
        </div>`;
      section.appendChild(overlay);
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

  /* ── Portfolio Cards ─────────────────────────────────────────────── */
  const PORTFOLIO_META = {
    "Robotics": { desc: { en: "Cutting-edge electromechanical systems and automated robots driving the future of industry.", es: "Sistemas electromecánicos de vanguardia y máquinas automatizadas que impulsan el futuro de la industria.", zh: "推动行业未来的尖端机电系统和自动化机器。", ja: "産業の未来を牽引する最先端の電気機械システムと自動化機械。" } },
    "Dashboards": { desc: { en: "Robust SCADA monitoring, Power BI analytics, and data visualization bridging hardware with human insight.", es: "Monitoreo SCADA robusto, análisis con Power BI y visualización de datos que une hardware con conocimiento humano.", zh: "强大的SCADA监控、Power BI分析和数据可视化。", ja: "堅牢なSCADA監視、Power BI分析、データ可視化。" } },
    "Programming": { desc: { en: "Scalable software solutions — from enterprise-level cloud integrations to precision embedded logic.", es: "Soluciones de software escalables — desde integraciones empresariales en la nube hasta lógica embebida de precisión.", zh: "从企业级云集成到精密嵌入式逻辑的可扩展软件解决方案。", ja: "企業規模のクラウド統合から精密な組み込みロジックまでのスケーラブルなソフトウェアソリューション。" } },
    "Electronics": { desc: { en: "High-precision PCBs, embedded systems, and advanced energy technologies solving real engineering challenges.", es: "PCBs de alta precisión, sistemas embebidos y tecnologías energéticas avanzadas que resuelven desafíos reales.", zh: "解决真实工程挑战的高精度PCB、嵌入式系统和先进能源技术。", ja: "現実の工学的課題を解決する高精度PCB、組み込みシステム、先進エネルギー技術。" } },
    "Smart Systems": { desc: { en: "Intelligent analytics, real-time sensing, and algorithm development bridging research with practical utility.", es: "Análisis inteligente, sensado en tiempo real y desarrollo de algoritmos que unen la investigación con la aplicación práctica.", zh: "连接研究与实用价值的智能分析、实时感知及算法开发。", ja: "研究と実用性を結びつけるインテリジェントな分析、リアルタイムセンシング、アルゴリズム開発。" } },
    "Research & Engineering": { desc: { en: "Specialized R&D pushing boundaries in semiconductor fabrication, VLSI testing, and scientific publication.", es: "I+D especializada que amplía los límites en fabricación de semiconductores, pruebas VLSI y publicaciones científicas.", zh: "半导体制造、VLSI测试和科学发表领域前沿的专项研发。", ja: "半導体製造、VLSIテスト、科学出版の境界を押し広げる専門的なR&D。" } },
  };

  // Curated cover images per product (from validated images)
  const PORTFOLIO_COVERS = {
    "Robotics": "images/thumbnails/labsi_insight.webp",
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
      if ((cat === "Research" || cat === "Professional") && d.Product) {
        seen[d.Product] = (seen[d.Product] || 0) + 1;
      }
    });
    const products = Object.keys(seen);
    if (!products.length) return;

    const frag = document.createDocumentFragment();
    products.forEach(p => {
      const meta = PORTFOLIO_META[p] || PORTFOLIO_META["Research & Engineering"];
      const cover = PORTFOLIO_COVERS[p] || "images/thumbnails/research_1.webp";
      const card = document.createElement("div");
      card.className = "portfolio-card";
      card.innerHTML = `
        <div class="p-img-wrapper">
          <img data-src="${cover}" src="" alt="${p}" loading="lazy">
        </div>
        <div class="p-content">
          <h3>${p}</h3>
          <p>${tF(meta.desc)}</p>
          <span class="p-count">${seen[p]} ${seen[p] === 1 ? "project" : "projects"}</span>
        </div>`;
      card.addEventListener("click", () =>
        window.open(`portfolio_summary.html?product=${encodeURIComponent(p)}`, "_blank"));
      frag.appendChild(card);
    });
    pt.innerHTML = "";
    pt.appendChild(frag);
    activateLazy();
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
    const em = $("#footer-email");
    const gh = $("#footer-github");
    if (!em || !gh) return;
    if (_lang === "zh" || _lang === "ja") {
      em.href = "mailto:kung-gomez-kelvin2604@mail.kyutech.jp";
      gh.href = "https://github.com/Kung-Kelvin";
    } else {
      em.href = "mailto:kelvin.kung@utp.ac.pa";
      gh.href = "https://github.com/kelvinutp";
    }
  }

  /* ── Translations ────────────────────────────────────────────────── */
  function applyTranslations() {
    $$("[data-lang]").forEach(el => {
      const v = t(el.dataset.lang);
      if (v) el.innerHTML = v;
    });
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
  function detectLang() {
    const nav = navigator.language || "";
    if (nav.startsWith("zh")) return "zh";
    if (nav.startsWith("ja")) return "ja";
    if (nav.startsWith("es")) return "es";
    return "en";
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

    // Apply language first
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