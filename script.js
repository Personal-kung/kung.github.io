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
            "collab-title": "Professionals I've Worked With",
            "exp-academic-summary":"Degrees, teaching, and academic achievements in Electric and Electronics Engineering. Focused on fostering innovation through education and mentorship.",
            "exp-research-summary":"Publications, collaborations, and ongoing investigations in Integrated Circuits and Semiconductors. Dedicated to advancing knowledge and practical discovery.",
            "exp-professional-summary":"Real-world industry roles, consulting, and applied work bridging scientific rigor with technological innovation."
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
            "collab-title": "Profesionales con los que he colaborado",
            "exp-academic-summary": "Títulos, experiencia docente y logros académicos en Ingeniería Eléctrica y Electrónica. Enfocado en fomentar la innovación a través de la educación y la mentoría.",
            "exp-research-summary":"Publicaciones, colaboraciones e investigaciones en curso en circuitos integrados y semiconductores. Dedicados al avance del conocimiento y al descubrimiento práctico.",
            "exp-professional-summary":"Funciones reales en la industria, consultoría y trabajo aplicado que unen el rigor científico con la innovación tecnológica."
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
            "collab-title": "与我合作的专业人士",
            "exp-academic-summary": "在电气与电子工程领域拥有学位、教学经验和学术成就。致力于通过教育和指导促进创新。",
            "exp-research-summary":"在集成电路和半导体领域发表论文、开展合作研究并进行持续探索。致力于推进知识进步和实用发现。",
            "exp-professional-summary":"现实世界中的行业角色、咨询和应用工作，将科学严谨性与技术创新相结合。"
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
            "collab-title": "私が一緒に働いた専門家",
            "exp-academic-summary":"電気電子工学分野の学位、教育、学術的業績。教育とメンターシップを通じてイノベーションを促進することに重点を置いています。",
            "exp-research-summary":"集積回路と半導体に関する出版物、共同研究、そして継続的な研究。知識の進歩と実用的な発見に尽力しています。",
            "exp-professional-summary":"実社会における産業界の役割、コンサルティング、そして科学的厳密さと技術革新を結びつける応用業務。"
        }
    };


    //--- Multi-language about section --------------
    const about = [
        {
            title: "about-title",
            en: "About Me",
            zh: "关于我",
            ja: "私について",
            es: "Acerca de mí"
        },
        {
            title: "about-intro",
            en: "Hello! I'm <strong>Kelvin Kung</strong>, a passionate and dedicated Electrical and Electronics Engineer. I've been working in the field since May 2022, focusing on both electrical and electronic systems design, with an emphasis on innovation and real-world applications.",
            zh: "您好！我是<strong>龚颖贤</strong>，一位充满热情、兢兢业业的电气与电子工程师。自2022年5月以来，我一直从事电气和电子系统设计工作，尤其注重创新和实际应用",
            ja: "こんにちは！情熱と熱意を持って取り組む電気電子工学エンジニアの<strong>クンケルビン</strong>です。2022年5月からこの分野で働いており、電気システムと電子システムの両方のシステム設計に携わっており、イノベーションと実社会への応用に重点を置いています",
            es: "¡Hola! Soy <strong>Kelvin Kung</strong>, un ingeniero eléctrico y electrónico apasionado y dedicado. Trabajo en el sector desde mayo de 2022, especializándome en el diseño de sistemas eléctricos y electrónicos, con énfasis en la innovación y las aplicaciones prácticas."
        },
        {
            title: "about-body",
            en: "Throughout my career, I've had the opportunity to design and install complex electrical systems, including lightning rods, grounding systems, and reactive capacitors compensation systems. I've worked on organizing and setting benchmarks for nationwide electricity controls in universities, utilizing SCADA systems and Power BI to enhance decision-making processes.",
            zh: "在我的职业生涯中，我曾有机会设计和安装复杂的电气系统，包括避雷针、接地系统和无功电容补偿系统。我曾参与组织和制定全国性大学电力控制的基准，并利用SCADA系统和Power BI来优化决策流程",
            ja: "これまでのキャリアを通して、避雷針、接地システム、リアクトルコンデンサ補償システムなど、複雑な電気システムの設計と設置に携わってきました。また、大学において、SCADAシステムとPower BIを活用して意思決定プロセスを強化し、全国規模の電力制御のベンチマーク設定と組織化に取り組んできました。",
            es: "A lo largo de mi trayectoria profesional, he tenido la oportunidad de diseñar e instalar sistemas eléctricos complejos, incluyendo pararrayos, sistemas de puesta a tierra y sistemas de compensación de capacitores reactivos. He trabajado en la organización y el establecimiento de estándares para el control de la electricidad a nivel nacional en universidades, utilizando sistemas SCADA y Power BI para optimizar la toma de decisiones."
        },
        {
            title: "about-body1",
            en: "I have conducted and organized power quality analysis tests across both public and private sectors nationwide. Additionally, I have experience designing and overseeing high-voltage systems (13.8kV and derivatives) ensuring safety and efficiency in electrical distribution.",
            zh: "我曾在全国范围内组织和开展公共和私营部门的电能质量分析测试。此外，我拥有设计和监管高压系统（13.8kV及其衍生电压）的经验，确保配电的安全性和效率",
            ja: "全国の公共部門と民間部門の両方で電力品質分析テストを実施・組織化してきました。さらに、配電の安全性と効率性を確保する高電圧システム（13.8kVおよび派生電圧）の設計と監視の経験もあります。",
            es: "He realizado y organizado pruebas de análisis de calidad de energía en los sectores público y privado a nivel nacional. Además, tengo experiencia en el diseño y la supervisión de sistemas de alta tensión (13.8 kV y derivados), garantizando la seguridad y la eficiencia en la distribución eléctrica."
        },
        {
            title: "about-body2",
            en: "On the electronic side, I have worked on several innovative projects, including electromechanical teleoperation, spectral analysis for watermelons, and the development of the first Panamanian patent for nanoelectrical circuits. I've also designed a scoring board for the university's baseball field and contributed to multiple international publications and conferences, including IEEE and Neurocomputing (Elsevier).",
            zh: "在电子领域，我参与了多个创新项目，包括机电远程操控、西瓜光谱分析以及巴拿马首个纳米电路专利的开发。我还为大学棒球场设计了记分牌，并为包括IEEE和Neurocomputing（Elsevier）在内的多家国际期刊和会议做出了贡献。",
            ja: "電子工学分野では、電気機械遠隔操作、スイカのスペクトル分析、パナマ初のナノ電気回路特許の開発など、いくつかの革新的なプロジェクトに携わってきました。また、大学の野球場のスコアボードを設計し、IEEEやNeurocomputing（Elsevier）など、複数の国際的な出版物や会議に貢献してきました。",
            es: "En el ámbito de la electrónica, he trabajado en varios proyectos innovadores, incluyendo la teleoperación electromecánica, el análisis espectral de sandías y el desarrollo de la primera patente panameña para circuitos nanoeléctricos. También he diseñado un marcador para el campo de béisbol de la universidad y he contribuido a diversas publicaciones y conferencias internacionales, incluyendo IEEE y Neurocomputing (Elsevier)."
        },
        {
            title: "about-body3",
            en: "I am honored to have been invited as a judge for international competitions in Europe and America. Furthermore, I have been involved in designing and building low-cost robotic kits for public schools to help students develop robotics skills. I have also contributed to specialized electronics projects aimed at assisting disabled people, such as developing a smart wheelchair for paraplegic individuals.",
            zh: "我很荣幸受邀担任欧美国际竞赛的评委。此外，我还参与了为公立学校设计和制造低成本机器人套件的​​工作，以帮助学生培养机器人技能。我还参与了一些旨在帮助残疾人士的专用电子项目，例如为截瘫患者开发智能轮椅。",
            ja: "ヨーロッパやアメリカで開催された国際大会の審査員に招かれたことを光栄に思います。さらに、公立学校向けに、生徒のロボット工学スキル向上を支援するための低価格ロボットキットの設計・製作にも携わってきました。また、下半身麻痺の方のためのスマート車椅子の開発など、障害者支援を目的とした専門的なエレクトロニクスプロジェクトにも貢献してきました。",
            es: "Me honra haber sido invitado como juez en competiciones internacionales en Europa y América. Además, he participado en el diseño y la construcción de kits de robótica de bajo costo para escuelas públicas, con el fin de ayudar a los estudiantes a desarrollar habilidades en robótica. Asimismo, he colaborado en proyectos de electrónica especializada destinados a ayudar a personas con discapacidad, como el desarrollo de una silla de ruedas inteligente para personas parapléjicas."
        },
        {
            title: "about-conclusion",
            en: "I'm always looking for new opportunities to apply my knowledge and skills in innovative ways. If you'd like to know more about my work or collaborate, feel free to explore my projects or get in touch!",
            zh: "我一直在寻找新的机会，以创新的方式运用我的知识和技能。如果您想了解更多关于我的工作或寻求合作，欢迎浏览我的项目或与我联系！",
            ja: "私は常に、自分の知識とスキルを革新的な方法で応用できる新しい機会を探しています。私の仕事についてもっと知りたい方、コラボレーションをご希望の方は、お気軽に私のプロジェクトをご覧いただくか、ご連絡ください。",
            es: "Siempre estoy buscando nuevas oportunidades para aplicar mis conocimientos y habilidades de forma innovadora. Si desea obtener más información sobre mi trabajo o colaborar conmigo, no dude en explorar mis proyectos o ponerse en contacto."
        }
    ];


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

    function updateAboutSection() {
        const language = document.getElementById("lang-select").value;

        const langElements = document.querySelectorAll("[data-lang]");
        
        langElements.forEach(element => {
          const key = element.getAttribute('data-lang');
          about.forEach(item =>{
              if (key===item["title"]){
                const translatedText = item[language] ? item[language] : element.textContent;
                element.innerHTML = translatedText || element.innerHTML;
            }
          })
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
        updateAboutSection();
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
        const top5 = categoryData.slice(0, 10);
        top5.forEach(item => {
            // Get the description based on the selected language
            let description;
            switch (selectedLang) {
                case 'zh':
                    description = item.details_zh;  // zh
                    break;
                case 'ja':
                    description = item.details_ja;  // ja
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
