// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
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
            "collab-title": "Professionals I've Worked With",
            "exp-academic-summary": "Degrees, teaching, and academic achievements in Electric and Electronics Engineering. Focused on fostering innovation through education and mentorship.",
            "exp-research-summary": "Publications, collaborations, and ongoing investigations in Integrated Circuits and Semiconductors. Dedicated to advancing knowledge and practical discovery.",
            "exp-professional-summary": "Real-world industry roles, consulting, and applied work bridging scientific rigor with technological innovation."
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
            "about-title": "Acerca de mi",
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
            "collab-title": "Profesionales con los que he colaborado",
            "exp-academic-summary": "Títulos, experiencia docente y logros académicos en Ingeniería Eléctrica y Electrónica. Enfocado en fomentar la innovación a través de la educación y la mentoría.",
            "exp-research-summary": "Publicaciones, colaboraciones e investigaciones en curso en circuitos integrados y semiconductores. Dedicados al avance del conocimiento y al descubrimiento práctico.",
            "exp-professional-summary": "Funciones reales en la industria, consultoría y trabajo aplicado que unen el rigor científico con la innovación tecnológica."
        },
        zh: {
            "name": "龚颖贤",
            "nav-about": "关于",
            "nav-exp": "经验",
            "nav-projects": "项目",
            "nav-contact": "联系",
            "hero-title": "你好,我是 <span>龚颖贤</span>",
            "hero-sub": "学术 • 职业 • 研究者",
            "hero-btn-work": "查看作品",
            "hero-btn-contact": "联系我",
            "about-title": "关于我",
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
            "collab-title": "与我合作的专业人士",
            "exp-academic-summary": "在电气与电子工程领域拥有学位、教学经验和学术成就。致力于通过教育和指导促进创新。",
            "exp-research-summary": "在集成电路和半导体领域发表论文、开展合作研究并进行持续探索。致力于推进知识进步和实用发现。",
            "exp-professional-summary": "现实世界中的行业角色、咨询和应用工作,将科学严谨性与技术创新相结合。"
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
            "collab-title": "私が一緒に働いた専門家",
            "exp-academic-summary": "電気電子工学分野の学位、教育、学術的業績。教育とメンターシップを通じてイノベーションを促進することに重点を置いています。",
            "exp-research-summary": "集積回路と半導体に関する出版物、共同研究、そして継続的な研究。知識の進歩と実用的な発見に尽力しています。",
            "exp-professional-summary": "実社会における産業界の役割、コンサルティング、そして科学的厳密さと技術革新を結びつける応用業務。"
        }
    };
    const headers = {
        "project_title": {
            en: "Project information",
            es: "Información del proyecto",
            zh: "项目信息",
            ja: "プロジェクト情報"
        },
        "problem": {
            en: "Describing the Problem",
            es: "Describiendo el problema",
            zh: "问题描述",
            ja: "問題の説明"
        },
        "reason": {
            en: "Why I joined?",
            es: "¿Por qué me integre?",
            zh: "为什么加入？",
            ja: "なぜ参加したのか？"
        },
        "approach": {
            en: "My Approach",
            es: "Mi Enfoque",
            zh: "方法",
            ja: "私のアプローチ"
        },
        "outcome": {
            en: "Outcomes",
            es: "Resultados",
            zh: "结果",
            ja: "結果"
        },
        "collaborators": {
            en: "Project Collaborators",
            es: "Colaboradores del proyecto",
            zh: "项目合作者",
            ja: "プロジェクト協力者"
        },

    };
    function loadProjectFromURL() {
        // Get projectId from the URL (e.g., ?projectId=1)
        const urlParams = new URLSearchParams(window.location.search);
        const projectId = parseInt(urlParams.get('projectId')); // Get projectId query parameter
        const language = document.getElementById("lang-select").value;

        // Fetch the JSON data from the server or local file
        fetch('./data/projects.json')  // Ensure this is the correct path to your JSON file
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                // Find the project data that matches the projectId
                const project = data.find(p => p.id === projectId);
                if (project) {
                    let table = "<table style='width: 100%; border-collapse: collapse; margin-top: 2rem;'>";
                    table += "<thead><tr style='background-color: var(--secondary-color);'>";
                    const tab_header = ["Name", "Role", "Email"]
                    tab_header.forEach(header => {
                        table += `<th style="padding: 1rem; text-align: center;">${header}</th>`;
                    });
                    table += "</tr></thead>";
                    table += "<tbody>";
                    project["collaborator"].data.map((item) => {
                        table += "<tr style='padding: 1rem; text-align:left'>";
                        table += `<td>${item["name"]}</a></td>`;
                        table += `<td>${item["roles"][language]}</td>`;
                        table += `<td><a href=mailto:${item["email"]} style="color: var(--accent-color); text-decoration: none;">${item["email"]}</a></td>`;
                        table += "</tr>";
                    })
                    table += "</tbody></table>";
                    const projectContentContainer = document.getElementById('projectContent');
                    projectContentContainer.innerHTML = `
              <section class="detailsTitle" id="Title">
              <h1>${project["title"][language]}</h1>
              <h2>
                <span>${project["quote"][language]}</span>
              </h2>
              </section>
              <div class="information">
                <section class="abstract">
                ${project["tags"][language]}<br>
                ${project["timeline"][language]}<br>
                <i>${project["summary"][language]}</i>
                </section>
                <section class="details">
                    
                    <h1>${headers["project_title"][language]}</h1>
                    
                    <h3>${headers["problem"][language]}</h3>
                    <p>${project["problem"][language]}</p>
                    
                    <h3>${headers["reason"][language]}</h3>
                    <p>${project["joined"][language]}</p>
                    
                    <h3>${headers["outcome"][language]}</h3>
                    <p>${project["outcome"][language]}</p>
                    
                    <h3>${headers["approach"][language]}</h3>
                    <p>${project["approach"][language]}</p>
                    
                    <h3>${headers["collaborators"][language]}</h3>
                </section>
              </div>
            `;
            projectContentContainer.innerHTML+=table
                } else {
                    document.getElementById('projectContent').innerHTML = '<p>Project not found!</p>';
                }
            })
            .catch(error => {
                console.error('Error fetching the JSON file:', error);
                document.getElementById('projectContent').innerHTML = '<p>Error loading project data.</p>';
            });
    }
    // <model-viewer src="${project["3D models"]}" auto-rotate rotation-per-second="70deg" camera-controls shadow-intensity="1" exposure="1.1"></model-viewer>
    function initializeAllData() {
        const lang = document.getElementById("lang-select").value;

        loadProjectFromURL()

        //updating all other visual elements
        document.querySelectorAll("[data-lang]").forEach(el => {
            const key = el.getAttribute("data-lang");
            if (translations[lang][key]) el.innerHTML = translations[lang][key];
        });
    }

    // ===== Language settings =====
    // Detecting language
    function detectUserLanguage() {
        const userLang = navigator.language || navigator.userLanguage; // e.g., "en", "zh-CN", "ja", etc.

        // Convert language code to match your supported languages (e.g., "en" => "en", "zh" => "zh", etc.)
        let language = "en"; // Default to English
        if (userLang.includes("zh")) {
            language = "zh"; // zh
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