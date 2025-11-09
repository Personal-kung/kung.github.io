// ============================
// ===== HERO CAROUSEL =======
// ============================
const heroImages = [
  "images/hero1.jpg",
  "images/hero2.jpg",
  "images/hero3.jpg",
  "images/hero4.jpg"
];

let currentHero = 0;
const heroBg = document.getElementById("hero-bg");

function updateHeroBg() {
  heroBg.style.backgroundImage = `url('${heroImages[currentHero]}')`;
  currentHero = (currentHero + 1) % heroImages.length;
}

// Initialize
updateHeroBg();
setInterval(updateHeroBg, 5000);

// ============================
// ===== MULTILANGUAGE =======
// ============================
const languageData = {
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
    "about-text": "I’m an Electrical and Electronics Engineer focused on innovation and human-centered solutions.",
    "exp-title": "Experience",
    "exp-academic": "Academic",
    "exp-professional": "Professional",
    "exp-research": "Research",
    "projects-title": "Projects & Highlights",
    "contact-title": "Contact",
    "contact-text": "Interested in working or collaborating with me?",
    "footer-name": "Kelvin Kung"
  },
  es: {
    name: "Kelvin Kung",
    "nav-about": "Acerca de",
    "nav-exp": "Experiencia",
    "nav-projects": "Proyectos",
    "nav-contact": "Contacto",
    "hero-title": "Hola, soy <span>Kelvin Kung</span>",
    "hero-sub": "Académico • Profesional • Investigador",
    "hero-btn-work": "Ver Trabajo",
    "hero-btn-contact": "Contáctame",
    "about-title": "Sobre Mí",
    "about-text": "Soy Ingeniero Electrónico y Eléctrico enfocado en la innovación y soluciones centradas en el ser humano.",
    "exp-title": "Experiencia",
    "exp-academic": "Académico",
    "exp-professional": "Profesional",
    "exp-research": "Investigación",
    "projects-title": "Proyectos y Destacados",
    "contact-title": "Contacto",
    "contact-text": "¿Interesado en trabajar o colaborar conmigo?",
    "footer-name": "Kelvin Kung"
  },
  zh: {
    name: "凯尔文·孔",
    "nav-about": "关于我",
    "nav-exp": "经历",
    "nav-projects": "项目",
    "nav-contact": "联系",
    "hero-title": "你好，我是 <span>凯尔文·孔</span>",
    "hero-sub": "学术 • 专业 • 研究员",
    "hero-btn-work": "查看作品",
    "hero-btn-contact": "联系我",
    "about-title": "关于我",
    "about-text": "我是一名电气与电子工程师，专注于创新和以人为本的解决方案。",
    "exp-title": "经历",
    "exp-academic": "学术",
    "exp-professional": "专业",
    "exp-research": "研究",
    "projects-title": "项目与亮点",
    "contact-title": "联系",
    "contact-text": "有兴趣与我合作吗？",
    "footer-name": "凯尔文·孔"
  },
  ja: {
    name: "ケルビン・クン",
    "nav-about": "私について",
    "nav-exp": "経験",
    "nav-projects": "プロジェクト",
    "nav-contact": "連絡先",
    "hero-title": "こんにちは、私は <span>ケルビン・クン</span>",
    "hero-sub": "学術 • プロフェッショナル • 研究者",
    "hero-btn-work": "作品を見る",
    "hero-btn-contact": "お問い合わせ",
    "about-title": "私について",
    "about-text": "私は電気電子工学エンジニアで、革新と人間中心のソリューションに注力しています。",
    "exp-title": "経験",
    "exp-academic": "学術",
    "exp-professional": "プロフェッショナル",
    "exp-research": "研究",
    "projects-title": "プロジェクトとハイライト",
    "contact-title": "連絡先",
    "contact-text": "私と一緒に仕事やコラボレーションに興味がありますか？",
    "footer-name": "ケルビン・クン"
  }
};

const langSelect = document.getElementById("lang-select");
langSelect.addEventListener("change", e => setLanguage(e.target.value));

function setLanguage(lang) {
  const elements = document.querySelectorAll("[data-lang]");
  elements.forEach(el => {
    const key = el.getAttribute("data-lang");
    if(languageData[lang] && languageData[lang][key]) {
      el.innerHTML = languageData[lang][key];
    }
  });
}

// Initialize language
setLanguage("en");

// ============================
// ===== LOAD CSV DATA =======
// ============================
function loadCSV() {
  fetch('data/portfolio_data.csv')
    .then(response => response.text())
    .then(csvText => {
      const data = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
      console.log("CSV data:", data); // check if it loaded correctly
      populateExperience(data);
    })
    .catch(err => console.error("Error loading CSV:", err));
}

// Populate experience summary columns and details
function populateExperience(data) {
  const academicList = document.querySelector("#academic-details ul");
  const researchList = document.querySelector("#research-details ul");
  const professionalList = document.querySelector("#professional-details ul");

  // Clear existing lists
  academicList.innerHTML = "";
  researchList.innerHTML = "";
  professionalList.innerHTML = "";

  data.forEach(item => {
    const li = document.createElement("li");
    li.innerHTML = `<strong>${item.participation}</strong> – ${item.institution}, ${item.start} to ${item.finish}${item.branch ? ", " + item.branch : ""}${item.details ? " | " + item.details : ""}${item.links ? ` | <a href="${item.links}" target="_blank">Link</a>` : ""}`;

    if(item.category.toLowerCase() === "academic") academicList.appendChild(li);
    else if(item.category.toLowerCase() === "research") researchList.appendChild(li);
    else if(item.category.toLowerCase() === "professional") professionalList.appendChild(li);
  });
}

// Initialize
loadCSV();

// ============================
// ===== CURRENT YEAR ========
// ============================
document.getElementById("year").textContent = new Date().getFullYear();
