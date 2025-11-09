// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Set current year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // ----- Multi-language support -----
  const translations = {
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
      "exp-title": "Experience",
      "projects-title": "Projects & Highlights",
      "contact-title": "Contact",
      "contact-text": "Interested in working or collaborating with me?",
      "footer-name": "Kelvin Kung"
    },
    es: {
      name: "Kelvin Kung",
      "nav-about": "Acerca",
      "nav-exp": "Experiencia",
      "nav-projects": "Proyectos",
      "nav-contact": "Contacto",
      "hero-title": "Hola, soy <span>Kelvin Kung</span>",
      "hero-sub": "Académico • Profesional • Investigador",
      "hero-btn-work": "Ver Trabajo",
      "hero-btn-contact": "Contactar",
      "about-title": "Sobre Mí",
      "about-text": "Soy [tu rol] enfocado en [tus intereses].",
      "exp-title": "Experiencia",
      "projects-title": "Proyectos & Destacados",
      "contact-title": "Contacto",
      "contact-text": "¿Interesado en trabajar o colaborar conmigo?",
      "footer-name": "Kelvin Kung"
    },
    zh: {
      name: "Kelvin Kung",
      "nav-about": "关于",
      "nav-exp": "经验",
      "nav-projects": "项目",
      "nav-contact": "联系",
      "hero-title": "你好，我是 <span>Kelvin Kung</span>",
      "hero-sub": "学术 • 职业 • 研究者",
      "hero-btn-work": "查看作品",
      "hero-btn-contact": "联系我",
      "about-title": "关于我",
      "about-text": "我是[你的角色]，专注于[你的兴趣]。",
      "exp-title": "经验",
      "projects-title": "项目与亮点",
      "contact-title": "联系",
      "contact-text": "有兴趣与我合作或工作吗？",
      "footer-name": "Kelvin Kung"
    },
    ja: {
      name: "Kelvin Kung",
      "nav-about": "概要",
      "nav-exp": "経験",
      "nav-projects": "プロジェクト",
      "nav-contact": "連絡先",
      "hero-title": "こんにちは、私は <span>Kelvin Kung</span>",
      "hero-sub": "学術 • プロフェッショナル • 研究者",
      "hero-btn-work": "作品を見る",
      "hero-btn-contact": "お問い合わせ",
      "about-title": "私について",
      "about-text": "私は[あなたの役割]で、[あなたの関心]に注力しています。",
      "exp-title": "経験",
      "projects-title": "プロジェクト & ハイライト",
      "contact-title": "連絡先",
      "contact-text": "一緒に働いたり協力したりしませんか？",
      "footer-name": "Kelvin Kung"
    }
  };

  const langSelect = document.getElementById("lang-select");

  function applyLanguage(lang) {
    document.querySelectorAll("[data-lang]").forEach(el => {
      const key = el.getAttribute("data-lang");
      if (translations[lang][key]) el.innerHTML = translations[lang][key];
    });
  }

  langSelect.addEventListener("change", e => applyLanguage(e.target.value));
  applyLanguage(langSelect.value);

  // ----- CSV Loader -----
  const csvPath = "data/portfolio_data.csv";

  fetch(csvPath)
    .then(response => {
      if (!response.ok) throw new Error("CSV file not found");
      return response.text();
    })
    .then(csvText => {
      const data = Papa.parse(csvText, { header: true, skipEmptyLines: true }).data;
      // console.log("CSV data loaded:", data);

      const sections = {
        Academic: document.querySelector("#academic-details ul"),
        Research: document.querySelector("#research-details ul"),
        Professional: document.querySelector("#professional-details ul")
      };

      if (!sections.Academic || !sections.Research || !sections.Professional) {
        console.error("One or more target sections not found in HTML!");
        return;
      }
      console.log(Papa)
      // Populate sections
      data.forEach(row => {
        if (!row.branch) return;
        const li = document.createElement("li");
        li.innerHTML = `<strong>${row.participation}</strong> – ${row.institution}, ${row.start} to ${row.finish} <br> ${row.details} ${row.links ? `<a href="${row.links}" target="_blank">Link</a>` : ""}`;
        if (sections[row.branch]) sections[row.branch].appendChild(li);
      });
    })
    .catch(err => console.error("Error loading CSV:", err));

  // ----- Carousel (sample) -----
  const carouselImages = [
    "images/hero1.jpg",
    "images/hero2.jpg",
    "images/hero3.jpg",
    "images/hero4.jpg"
  ];

  const heroBg = document.getElementById("hero-bg");
  let currentIndex = 0;

  function updateCarousel() {
    if (!heroBg) return;
    heroBg.style.backgroundImage = `url('${carouselImages[currentIndex]}')`;
    currentIndex = (currentIndex + 1) % carouselImages.length;
  }

  // updateCarousel();
  // setInterval(updateCarousel, 5000); // change every 5 sec
});
