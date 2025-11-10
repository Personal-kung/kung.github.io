// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
    // Helper function to format and compare dates (assuming dates are in 'YYYY-MM-DD' format)
    function parseDate(dateString) {
        const [month, day, year] = dateString.split('/');  // Split by '/'
        return new Date(year, month - 1, day); // month is 0-based
    }

    // Set current year in footer
    document.getElementById("year").textContent = new Date().getFullYear();

    // ===== HERO BACKGROUND CAROUSEL (dynamic) =====
    const heroBg = document.getElementById("hero-bg");

    // Array of image paths (make sure these are correct relative paths)
    const heroImages = [
        "images/image1.JPG",
        "images/image2.jpg",
        "images/image3.JPG",
        "images/image4.jpg",
        "images/image5.jpg",
        "images/image6.jpg",
        "images/image7.jpg",
        "images/image8.jpg",
        "images/image10.png",
        "images/image11.png",
        "images/image12.jpg",
        "images/image13.png"
    ];

    if (!heroBg) {
        console.error("⚠️ hero-bg element not found.");
        return;
    }

    let current = 0;

    // Function to change background image
    const changeBackgroundImage = () => {
        const imageUrl = `url(${heroImages[current]})`;

        heroBg.style.backgroundImage = imageUrl;
        heroBg.style.opacity = 1;  // Fade in effect
    };

    // Change the background every 4 seconds
    setInterval(() => {
        current = (current + 1) % heroImages.length;
        changeBackgroundImage();
    }, 8000);

    // ----- Multi-language support -----
    const translations = {
        en: {
            "name": "Kelvin Kung",
            "nav-about": "About",
            "nav-exp": "Experience",
            "nav-projects": "Projects",
            "nav-contact": "Contact",
            "hero-title": "Greetings, I'm <span>Kelvin Kung</span>",
            "hero-sub": "Academic • Professional • Researcher",
            "hero-btn-work": "View Work",
            "hero-btn-contact": "Get in Touch",
            "about-title": "About Me",
            "about-text": "I’m a [your role] focused on [your interests].",
            "exp-title": "Experience",
            "exp-academic": "Academic",
            "exp-research": "Researcher",
            "exp-professional": "Professional",
            "academic-details": "Academic",
            "research-details": "Researcher",
            "professional-details": "Professional",
            "projects-title": "Projects & Highlights",
            "contact-title": "Contact",
            "contact-text": "Interested in working or collaborating with me?",
            "footer-name": "Kelvin Kung",
            "collab-title": "Professionals I've Worked With"
        },
        es: {
            "name": "Kelvin Kung",
            "nav-about": "Acerca",
            "nav-exp": "Experiencia",
            "nav-projects": "Proyectos",
            "nav-contact": "Contacto",
            "hero-title": "Saludos, <span>Kelvin Kung</span>",
            "hero-sub": "Académico • Profesional • Investigador",
            "hero-btn-work": "Ver Trabajo",
            "hero-btn-contact": "Contactar",
            "about-title": "Sobre Mí",
            "about-text": "Soy [tu rol] enfocado en [tus intereses].",
            "exp-title": "Experiencia",
            "exp-academic": "Académico",
            "exp-research": "Investigador",
            "exp-professional": "Profesional",
            "academic-details": "Académico",
            "research-details": "Investigador",
            "professional-details": "Profesional",
            "projects-title": "Proyectos & Destacados",
            "contact-title": "Contacto",
            "contact-text": "¿Interesado en trabajar o colaborar conmigo?",
            "footer-name": "Kelvin Kung",
            "collab-title": "Profesionales con los que he colaborado"
        },
        zh: {
            "name": "龚颖贤",
            "nav-about": "关于",
            "nav-exp": "经验",
            "nav-projects": "项目",
            "nav-contact": "联系",
            "hero-title": "你好，我是 <span>龚颖贤</span>",
            "hero-sub": "学术 • 职业 • 研究者",
            "hero-btn-work": "查看作品",
            "hero-btn-contact": "联系我",
            "about-title": "关于我",
            "about-text": "我是[你的角色]，专注于[你的兴趣]。",
            "exp-title": "经验",
            "exp-academic": "学术",
            "exp-research": "研究者",
            "exp-professional": "职业",
            "academic-details": "学术",
            "research-details": "研究者",
            "professional-details": "职业",
            "projects-title": "项目与亮点",
            "contact-title": "联系",
            "contact-text": "有兴趣与我合作或工作吗？",
            "footer-name": "龚颖贤",
            "collab-title": "与我合作的专业人士"
        },
        ja: {
            "name": "クンケルビン",
            "nav-about": "概要",
            "nav-exp": "経験",
            "nav-projects": "プロジェクト",
            "nav-contact": "連絡先",
            "hero-title": "よろしく、私は <span>クンケルビン</span>",
            "hero-sub": "学術 • プロフェッショナル • 研究者",
            "hero-btn-work": "作品を見る",
            "hero-btn-contact": "お問い合わせ",
            "about-title": "私について",
            "about-text": "私は[あなたの役割]で、[あなたの関心]に注力しています。",
            "exp-title": "経験",
            "exp-academic": "学術",
            "exp-research": "研究者",
            "exp-professional": "プロフェッショナル",
            "academic-details": "学術",
            "research-details": "研究者",
            "professional-details": "プロフェッショナル",
            "projects-title": "プロジェクト & ハイライト",
            "contact-title": "連絡先",
            "contact-text": "一緒に働いたり協力したりしませんか？",
            "footer-name": "クンケルビン",
            "collab-title": "私が一緒に働いた専門家"
        }
    };

    //   Obtaining the data for the corresponding sections

    function loadCSVData(filePath, sectionName, callback) {
        Papa.parse(filePath, {
            download: true,
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                console.log(`✅ Loaded CSV for ${sectionName}`, results.data.length, "rows");
                callback(results.data); // pass parsed data to the rendering function
            },
            error: function (err) {
                console.error(`❌ Error loading ${sectionName} CSV:`, err);
            }
        });
    }

    function updateAboutSection(data) {
        document.querySelectorAll("[data-lang]").forEach(el => {
            const key = el.getAttribute("data-lang");
            const row = data.find(r => r.key === key);
            if (row) el.innerHTML = row[lang] || row.en || el.innerHTML;
            // Use innerHTML to allow HTML tags to be rendered
            // element.innerHTML = translatedText || element.innerHTML;
        });
    }

    function updateCollaborationsSection(data) {
        const container = document.querySelector(".collab-carousel");
        if (!container) return console.warn("No collab-carousel container found.");

        container.innerHTML = "";

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "collab-item";
            div.innerHTML = `
      <div class="collab-description">
        <h3>${item.first_name} ${item.last_name}</h3>
        <p><strong>${item.academic_grade}</strong> — ${item.institution}</p>
        <p>${item.branch}, ${item.country}</p>
      </div>
      <div class="collab-photo">
        <img src="${item.image_url}" alt="${item.first_name} ${item.last_name}">
      </div>
    `;
            container.appendChild(div);
        });
    }

    function updatePortfolioSection(data) {
        const groupedData = groupByCategory(data);
        const selectedLang = document.getElementById("lang-select").value;
        displayData(groupedData, selectedLang);
    }

    function initializeAllData() {
        const lang = document.getElementById("lang-select").value;
        loadCSVData("data/about.csv", "about", updateAboutSection);
        loadCSVData("data/collaborations.csv", "collaborations", updateCollaborationsSection);
        loadCSVData("data/portfolio_data.csv", "portfolio", updatePortfolioSection);
        //updating all other visual elements
        document.querySelectorAll("[data-lang]").forEach(el => {
            const key = el.getAttribute("data-lang");
            if (translations[lang][key]) el.innerHTML = translations[lang][key];
        });
    }

    function groupByCategory(data) {
        const grouped = {
            academic: [],
            research: [],
            professional: []
        };

        data.forEach(item => {
            const category = item.category.toLowerCase(); // 'academic', 'research', 'professional'
            if (grouped[category]) {
                grouped[category].push(item);
            }
        });

        // Sort each category's data from most recent to oldest
        for (let category in grouped) {
            grouped[category].sort((a, b) => parseDate(b.finish) - parseDate(a.finish));
        }

        return grouped;
    }

    function displayData(groupedData, selectedLang) {
        // Get section references
        const academicUL = document.querySelector("#academic-details ul");
        const researchUL = document.querySelector("#research-details ul");
        const professionalUL = document.querySelector("#professional-details ul");

        if (!academicUL || !researchUL || !professionalUL) {
            console.error("❌ One or more <ul> targets not found in HTML!");
            return;
        }

        // Clear the current content in the sections
        academicUL.innerHTML = '';
        researchUL.innerHTML = '';
        professionalUL.innerHTML = '';

        // Display the 5 most recent entries for each category
        displayCategoryEntries(academicUL, groupedData.academic, selectedLang);
        displayCategoryEntries(researchUL, groupedData.research, selectedLang);
        displayCategoryEntries(professionalUL, groupedData.professional, selectedLang);
    }

    // Function to display the top 5 entries for each category
    function displayCategoryEntries(section, categoryData, selectedLang) {
        // Only show the first 5 entries
        const top5 = categoryData.slice(0, 5);
        top5.forEach(item => {
            // Get the description based on the selected language
            let description;
            switch (selectedLang) {
                case 'zh':
                    description = item.details_zh;  // Chinese
                    break;
                case 'ja':
                    description = item.details_ja;  // Japanese
                    break;
                case 'es':
                    description = item.details_es;  // Spanish
                    break;
                default:
                    description = item.details_en; // Default to English
            }

            const entryHtml = `
                <li>
                    <strong>${item.finish}</strong> – ${item.institution} – ${item.branch} – ${item.participation}
                    <p>${description}</p>
                    ${item.links ? `<a href="${item.links}" target="_blank">More Info</a>` : ''}
                </li>
            `;
            section.innerHTML += entryHtml;
        });
    }
    // ===== Language settings =====
    // Detecting language
    function detectUserLanguage() {
        const userLang = navigator.language || navigator.userLanguage; // e.g., "en", "zh-CN", "ja", etc.

        // Convert language code to match your supported languages (e.g., "en" => "en", "zh" => "zh", etc.)
        let language = "en"; // Default to English
        if (userLang.includes("zh")) {
            language = "zh"; // Chinese
        } else if (userLang.includes("ja")) {
            language = "ja"; // Japanese
        } else if (userLang.includes("es")) {
            language = "es"; // Spanish
        }
        return language;
    }

    // Load the appropriate language data based on the user's language
    function setLanguage() {
        const language = detectUserLanguage();
        document.getElementById("lang-select").value = language;
        initializeAllData()
    }

    // when changing languages
    document.getElementById("lang-select").addEventListener("change", e => {
        initializeAllData();
        console.log(`✅ Changed languages ${e.target.value}`);
    });

    setLanguage()
});
