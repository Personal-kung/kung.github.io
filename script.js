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
      const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
      const data = parsed.data;
      console.log("✅ CSV data parsed:", data);

      // Get section references
      const academicUL = document.querySelector("#academic-details ul");
      const researchUL = document.querySelector("#research-details ul");
      const professionalUL = document.querySelector("#professional-details ul");

      if (!academicUL || !researchUL || !professionalUL) {
        console.error("❌ One or more <ul> targets not found in HTML!");
        return;
      }

      // Helper to make <li> safely
      const createListItem = (item) => {
        const li = document.createElement("li");
        li.innerHTML = `
      ${item.finish || "?"}
        <strong>${item.participation || "Untitled"}</strong> 
        – ${item.institution || "Unknown Institution"}, 
        <br>${item.details_en || ""}
        ${item.links ? `<br><a href="${item.links}" target="_blank">More info</a>` : ""}
      `;
        return li;
      };

      // Loop through each row
      data.forEach(item => {
        if (!item.branch) return; // skip if branch empty
        console.log("Branch found:", `"${item.category}"`);
        switch (item.category.trim().toLowerCase()) {
          case "academic":
            academicUL.appendChild(createListItem(item));
            break;
          case "research":
            researchUL.appendChild(createListItem(item));
            break;
          case "professional":
            professionalUL.appendChild(createListItem(item));
            break;
          default:
            console.warn(`⚠️ Unknown branch: ${item.category}`);
        }
      });
    })
    .catch(err => console.error("❌ Error loading CSV:", err));

  // ===== HERO BACKGROUND CAROUSEL (dynamic) =====
  document.addEventListener("DOMContentLoaded", () => {
    const heroBg = document.getElementById("hero-bg");

    if (!heroBg) {
      console.warn("⚠️ hero-bg element not found.");
      return;
    }

    // ---- Define your image paths here ----
    const heroImages = [
      "images/image1.jpg",
      "images/image2.jpg",
    ];

    // Create carousel container
    const carousel = document.createElement("div");
    carousel.classList.add("carousel");

    // Dynamically create <img> tags
    heroImages.forEach((src, index) => {
      const img = document.createElement("img");
      img.src = src;
      img.alt = `Background ${index + 1}`;
      img.className = "carousel-image";
      if (index === 0) img.classList.add("active");
      carousel.appendChild(img);
    });

    // Insert carousel into hero background div
    heroBg.appendChild(carousel);

    // ---- Carousel logic ----
    const images = carousel.querySelectorAll(".carousel-image");
    let current = 0;

    // Preload images
    images.forEach(img => {
      const preload = new Image();
      preload.src = img.src;
    });

    // Function to switch images
    function showNextImage() {
      images[current].classList.remove("active");
      current = (current + 1) % images.length;
      images[current].classList.add("active");
    }

    // Auto-change every 6 seconds
    setInterval(showNextImage, 6000);
  });
});
