// ================= GLOBAL VARIABLES =================
let portfolioData = []; // CSV-driven data
let currentLang = 'en';

// ================= STATIC TEXT FOR MULTILANGUAGE =================
const staticText = {
  en: {
    name: "Kelvin Kung",
    "nav-about": "About",
    "nav-exp": "Experience",
    "nav-projects": "Projects",
    "nav-contact": "Contact",
    "hero-title": "Hello, I'm <span>Kelvin Kung</span>",
    "hero-sub": "Academic • Professional • Researcher",
    "hero-btn-work": "View Work",
    "hero-btn-contact": "Get in Touch",
    "about-title": "About Me",
    "about-text": "I’m a [your role] focused on [your interests].",
    "exp-academic": "Academic",
    "exp-research": "Research",
    "exp-professional": "Professional",
    "projects-title": "Projects & Highlights",
    "contact-title": "Contact",
    "contact-text": "Interested in working or collaborating with me?",
    "footer-name": "Kelvin Kung"
  },
  zh: {
    name: "名字",
    "nav-about": "关于",
    "nav-exp": "经历",
    "nav-projects": "项目",
    "nav-contact": "联系",
    "hero-title": "你好，我是<span>名字</span>",
    "hero-sub": "学术 • 专业 • 研究者",
    "hero-btn-work": "查看作品",
    "hero-btn-contact": "联系我",
    "about-title": "关于我",
    "about-text": "我是一名专注于[你的兴趣]的[你的职业]。",
    "exp-academic": "学术",
    "exp-research": "研究",
    "exp-professional": "职业",
    "projects-title": "项目与亮点",
    "contact-title": "联系",
    "contact-text": "有兴趣与我合作或交流吗？",
    "footer-name": "名字"
  },
  ja: {
    name: "名前",
    "nav-about": "概要",
    "nav-exp": "経験",
    "nav-projects": "プロジェクト",
    "nav-contact": "連絡先",
    "hero-title": "こんにちは、<span>名前</span>です",
    "hero-sub": "学術 • プロフェッショナル • 研究者",
    "hero-btn-work": "作品を見る",
    "hero-btn-contact": "連絡する",
    "about-title": "私について",
    "about-text": "私は[関心分野]に焦点を当てた[職業]です。",
    "exp-academic": "学術",
    "exp-research": "研究",
    "exp-professional": "職業",
    "projects-title": "プロジェクトとハイライト",
    "contact-title": "連絡先",
    "contact-text": "一緒に働きたい、または協力したいですか？",
    "footer-name": "名前"
  },
  es: {
    name: "Kelvin Kung",
    "nav-about": "Acerca de",
    "nav-exp": "Experiencia",
    "nav-projects": "Proyectos",
    "nav-contact": "Contacto",
    "hero-title": "Hola, soy <span>Kelvin Kung</span>",
    "hero-sub": "Académico • Profesional • Investigador",
    "hero-btn-work": "Ver trabajo",
    "hero-btn-contact": "Contáctame",
    "about-title": "Sobre mí",
    "about-text": "Soy un [tu profesión] enfocado en [tus intereses].",
    "exp-academic": "Académica",
    "exp-research": "Investigación",
    "exp-professional": "Profesional",
    "projects-title": "Proyectos y Destacados",
    "contact-title": "Contacto",
    "contact-text": "¿Interesado en colaborar o trabajar conmigo?",
    "footer-name": "Kelvin Kung"
  }
};

// ================= CSV LOADER =================
async function loadCSV(path) {
  const response = await fetch(path);
  const text = await response.text();
  const rows = text.trim().split('\n');
  const headers = rows[0].split(',');

  const data = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i].split(/,(?=(?:[^"]*"[^"]*")*[^"]*$)/); // handle commas in quotes
    const item = {};
    headers.forEach((h, j) => {
      item[h.trim()] = row[j]?.replace(/^"|"$/g, '').trim() || "";
    });
    data.push(item);
  }
  return data;
}

// ================= APPLY STATIC TEXT =================
function applyTextMarkers(lang) {
  const langPack = staticText[lang] || staticText['en'];
  document.querySelectorAll('[data-lang]').forEach(el => {
    const key = el.getAttribute('data-lang');
    if (langPack[key]) el.innerHTML = langPack[key];
  });
}

// ================= RENDER EXPERIENCE DETAILS =================
function renderExperienceDetails(data, lang = 'en') {
  const sections = ['academic', 'research', 'professional'];

  sections.forEach(sec => {
    const container = document.getElementById(`${sec}-details`) || document.getElementById(`${sec}-details`);
    const detailSection = document.getElementById(`${sec}-details`);
    if (!detailSection) return;

    const filtered = data
      .filter(item => item.section === sec)
      .sort((a, b) => Number(a.order || 0) - Number(b.order || 0));

    let html = '<ul>';
    filtered.forEach(item => {
      const details = item[`details_${lang}`] || item.details_en || "";
      const links = item.links
        ? item.links.split(',').map(link => `<a href="${link.trim()}" target="_blank">🔗</a>`).join(' ')
        : "";
      html += `
        <li>
          <strong>${item.participation}</strong> – ${item.institution}
          <br><em>${item.branch}</em>
          <br><span>${item.start} – ${item.finish}</span>
          <p>${details}</p>
          <div class="links">${links}</div>
        </li>
      `;
    });
    html += '</ul>';
    detailSection.innerHTML = html;
  });
}

// ================= RENDER PROJECTS =================
function renderProjects(data, lang = 'en') {
  const container = document.querySelector('.project-grid');
  if (!container) return;

  const projects = data.filter(d => d.section === 'projects').sort((a,b)=>Number(a.order||0)-Number(b.order||0));
  let html = '';
  projects.forEach(p => {
    const details = p[`details_${lang}`] || p.details_en || '';
    html += `
      <div class="project-card">
        <h4>${p.participation}</h4>
        <p>${details}</p>
        <div class="links">${p.links ? p.links.split(',').map(l=>`<a href="${l.trim()}" target="_blank">🔗</a>`).join(' ') : ''}</div>
      </div>
    `;
  });
  container.innerHTML = html;
}

// ================= HERO BACKGROUND CAROUSEL =================
function initHeroCarousel(images = []) {
  if (!images.length) return;
  const heroBg = document.getElementById("hero-bg");
  let current = 0;
  function changeBackground() {
    heroBg.style.backgroundImage = `url(${images[current]})`;
    current = (current + 1) % images.length;
  }
  changeBackground();
  setInterval(changeBackground, 6000);
}

// ================= LANGUAGE SWITCHER =================
function initLanguageSwitcher() {
  const langSelect = document.getElementById('lang-select');
  if (!langSelect) return;

  langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    applyTextMarkers(currentLang);
    renderExperienceDetails(portfolioData, currentLang);
    renderProjects(portfolioData, currentLang);
  });
}

// ================= INITIALIZATION =================
async function init() {
  portfolioData = await loadCSV('data/portfolio_data.csv');

  applyTextMarkers(currentLang);
  renderExperienceDetails(portfolioData, currentLang);
  renderProjects(portfolioData, currentLang);
  initLanguageSwitcher();
  initHeroCarousel([
    "images/bg1.jpg",
    "images/bg2.jpg",
    "images/bg3.jpg",
    "images/bg4.jpg"
  ]);

  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}

// ================= START =================
init();
