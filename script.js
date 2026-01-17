let data = [];  // Will hold the JSON data
let filteredData = [];  // A copy of the data for filtering purposes

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
        "images/image10.jpg",
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
            "exp-professional-summary": "Real-world industry roles, consulting, and applied work bridging scientific rigor with technological innovation.",
            "filter-all": "All",
            "filter-prof": "Professional",
            "filter-rese": "Research",
            "filter-acad": "Academic",
            "filter-time": "Timeline",
            "filter-time-title": "Timeline View",
            "filter-acco": "Accordion",
            "filter-acco-title": "Accordion View",
            "filter-inte": "Interactive",
            "filter-inte-title": "Interactive View"
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
            "exp-professional-summary": "Funciones reales en la industria, consultoría y trabajo aplicado que unen el rigor científico con la innovación tecnológica.",
            "filter-all": "Todos",
            "filter-prof": "Profesional",
            "filter-rese": "Investigación",
            "filter-acad": "Académico",
            "filter-time": "Cronológico",
            "filter-time-title": "Vista Cronológica",
            "filter-acco": "Acordeón",
            "filter-acco-title": "Vista Acordeón",
            "filter-inte": "Interactivo",
            "filter-inte-title": "Vista Interactiva"
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
            "exp-professional-summary": "现实世界中的行业角色、咨询和应用工作,将科学严谨性与技术创新相结合。",
            "filter-all": "全部",
            "filter-prof": "专业",
            "filter-rese": "研究",
            "filter-acad": "学术",
            "filter-time": "时间线",
            "filter-time-title": "时间线视图",
            "filter-acco": "折叠式",
            "filter-acco-title": "折叠式视图",
            "filter-inte": "交互式",
            "filter-inte-title": "交互式视图"
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
            "exp-professional-summary": "実社会における産業界の役割、コンサルティング、そして科学的厳密さと技術革新を結びつける応用業務。",
            "filter-all": "すべて",
            "filter-prof": "専門分野",
            "filter-rese": "研究",
            "filter-acad": "学術分野",
            "filter-time": "タイムライン",
            "filter-time-title": "タイムライン表示",
            "filter-acco": "アコーディオン",
            "filter-acco-title": "アコーディオン表示",
            "filter-inte": "インタラクティブ",
            "filter-inte-title": "インタラクティブ表示"
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
            en: "Kelvin Kung is an Electrical and Electronics Engineer. Currently researching Very Large System Integration (VLSI) testing in Kyushu Institute of Technology",
            zh: "您好！我是<strong>龚颖贤</strong>,一位充满热情、兢兢业业的电气与电子工程师。自2022年5月以来,我一直从事电气和电子系统设计工作,尤其注重创新和实际应用",
            ja: "クンケルビンは電気電子工学エンジニアです。現在「九州工業大学」で超大規模システム統合（VLSI）試験の研究に取り組んでいます。",
            es: "Kelvin Kung es Ingeniero Eléctrico y Electrónico. Actualmente investiga las pruebas de Integración de Sistemas Muy Grandes (VLSI <i>Very Large System Integration</i>) en el Instituto Tecnológico de Kyushu."
        },
        {
            title: "about-body",
            en: "Kelvin worked in Technological University of Panama (2022-2025) focusing on high voltage electrical systems design, with an emphasis on innovation and real-world applications. Throughout his career, he designed and installed complex electrical systems, including lightning rods, grounding systems, and reactive capacitors compensation systems. He set benchmarks for nationwide electricity controls in universities, utilizing SCADA systems and Power BI to enhance decision-making processes.",
            zh: "在我的职业生涯中,我曾有机会设计和安装复杂的电气系统,包括避雷针、接地系统和无功电容补偿系统。我曾参与组织和制定全国性大学电力控制的基准,并利用SCADA系统和Power BI来优化决策流程",
            ja: "これまでのキャリアを通して、避雷針、接地システム、リアクトルコンデンサ補償システムなど、複雑な電気システムの設計と設置に携わってきました。また、大学において、SCADAシステムとPower BIを活用して意思決定プロセスを強化し、全国規模の電力制御のベンチマーク設定と組織化に取り組んできました。",
            es: "Kelvin trabajó en la Universidad Tecnológica de Panamá (2022-2025), enfocándose en el diseño de sistemas eléctricos de media y alta tensión, con énfasis en la innovación y las aplicaciones prácticas. A lo largo de su carrera, diseñó e instaló sistemas eléctricos complejos, incluyendo pararrayos, sistemas de puesta a tierra y sistemas de compensación de condensadores reactivos. Estableció puntos de referencia para los controles eléctricos a nivel nacional en universidades, utilizando sistemas SCADA y Power BI para optimizar los procesos de toma de decisiones."
        },
        {
            title: "about-body1",
            en: "Kelvin conducted and organized power quality analysis tests across both public and private sectors nationwide. Additionally, I have experience designing and overseeing high-voltage systems (13.8kV and derivatives) ensuring safety and efficiency in electrical distribution.",
            zh: "我曾在全国范围内组织和开展公共和私营部门的电能质量分析测试。此外,我拥有设计和监管高压系统（13.8kV及其衍生电压）的经验,确保配电的安全性和效率",
            ja: "全国の公共部門と民間部門の両方で電力品質分析テストを実施・組織化してきました。さらに、配電の安全性と効率性を確保する高電圧システム（13.8kVおよび派生電圧）の設計と監視の経験もあります。",
            es: "Kelvin realizó y organizó pruebas de análisis de calidad de energía en los sectores público y privado de todo el país. Además, tiene experiencia en el diseño y la supervisión de sistemas de alta tensión (13.8 kV y derivados), garantizando la seguridad y la eficiencia en la distribución eléctrica."
        },
        {
            title: "about-body2",
            en: "On the electronic side, he has worked on several innovative projects, including electromechanical teleoperation, spectral analysis for watermelons, and the development of the first Panamanian patent for nanoelectrical circuits. Kelvin has also designed a scoring board for the university's baseball field and contributed to multiple international publications and conferences, including IEEE and Neurocomputing (Elsevier).",
            zh: "在电子领域,我参与了多个创新项目,包括机电远程操控、西瓜光谱分析以及巴拿马首个纳米电路专利的开发。我还为大学棒球场设计了记分牌,并为包括IEEE和Neurocomputing（Elsevier）在内的多家国际期刊和会议做出了贡献。",
            ja: "電子工学分野では、電気機械遠隔操作、スイカのスペクトル分析、パナマ初のナノ電気回路特許の開発など、いくつかの革新的なプロジェクトに携わってきました。また、大学の野球場のスコアボードを設計し、IEEEやNeurocomputing（Elsevier）など、複数の国際的な出版物や会議に貢献してきました。",
            es: "En el ámbito electrónico, ha trabajado en varios proyectos innovadores, incluyendo teleoperación electromecánica, análisis espectral para sandías y el desarrollo de la primera patente panameña para circuitos nanoeléctricos. Kelvin también diseñó un marcador para el campo de béisbol de la universidad y colaboró ​​en múltiples publicaciones y conferencias internacionales, incluyendo IEEE y Neurocomputing (Elsevier)."
        },
        {
            title: "about-body3",
            en: "In 2023 and 2024 Kelvin served as judge for Robocup Jr. international competitions in Europe and America. Furthermore, he has designed and build low-cost robotic kits for public schools to help students develop robotics skills. He also contributed to specialized electronics projects aimed at assisting disabled people, such as developing a smart wheelchair for paraplegic individuals.",
            zh: "我很荣幸受邀担任欧美国际竞赛的评委。此外,我还参与了为公立学校设计和制造低成本机器人套件的​​工作,以帮助学生培养机器人技能。我还参与了一些旨在帮助残疾人士的专用电子项目,例如为截瘫患者开发智能轮椅。",
            ja: "ヨーロッパやアメリカで開催された国際大会の審査員に招かれたことを光栄に思います。さらに、公立学校向けに、生徒のロボット工学スキル向上を支援するための低価格ロボットキットの設計・製作にも携わってきました。また、下半身麻痺の方のためのスマート車椅子の開発など、障害者支援を目的とした専門的なエレクトロニクスプロジェクトにも貢献してきました。",
            es: "En 2023 y 2024, Kelvin fue jurado en las competiciones de Robocup Jr. en Europa y América. Además, diseñó y construyó kits robóticos de bajo costo para escuelas públicas, ayudando a los estudiantes a desarrollar habilidades robóticas. También contribuyó a proyectos electrónicos especializados para ayudar a personas con discapacidad, como el desarrollo de una silla de ruedas inteligente para personas parapléjicas."
        },
        {
            title: "about-conclusion",
            en: "Kelvin received his B.S. in Electrical and Electronics Engineering from Technological University of Panama (2022)",
            zh: "我一直在寻找新的机会,以创新的方式运用我的知识和技能。如果您想了解更多关于我的工作或寻求合作,欢迎浏览我的项目或与我联系！",
            ja: "私は常に、自分の知識とスキルを革新的な方法で応用できる新しい機会を探しています。私の仕事についてもっと知りたい方、コラボレーションをご希望の方は、お気軽に私のプロジェクトをご覧いただくか、ご連絡ください。",
            es: "Kelvin obtuvo su licenciatura en Ingeniería Eléctrica y Electrónica en la Universidad Tecnológica de Panamá (2022)"
        }
    ];

    //to add into the github page
    function jsonToTable(jsonData, containerId) {
        const language = document.getElementById("lang-select").value;
        let table = "<table style='width: 100%; border-collapse: collapse; margin-top: 2rem;'>";

        fetch(jsonData)  // Ensure this is the correct path to your JSON file
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                table += "<thead><tr style='background-color: var(--secondary-color);'>";

                //headers
                const headers = ["Project Name", "Summary"]
                headers.forEach(header => {
                    table += `<th style="padding: 1rem; text-align: center;">${header}</th>`;
                });
                table += "</tr></thead>";
                table += "<tbody>";
                //body 
                data.forEach(row => {
                    table += "<tr style='padding: 1rem; border:5px solid #999; text-align:left'>";
                    table += `<td><a href="details.html?projectId=${row["id"]}" target="_blank" style="color: var(--accent-color); text-decoration: none;">${row["title"][language]}</a></td>`;
                    table += `<td>${row["summary"][language]}</td>`;
                    table += "</tr>";
                });
                table += "</tbody></table>";
                document.getElementById(containerId).innerHTML = table;
            })
    }

    function updateAboutSection() {
        const language = document.getElementById("lang-select").value;

        const langElements = document.querySelectorAll("[data-lang]");

        langElements.forEach(element => {
            const key = element.getAttribute('data-lang');
            about.forEach(item => {
                if (key === item["title"]) {
                    const translatedText = item[language] ? item[language] : element.textContent;
                    element.innerHTML = translatedText || element.innerHTML;
                }
            })
        });
    }

    function updateCollaborationsSection() {
        const container = document.querySelector(".collab-carousel");
        if (!container) return console.warn("No collab-carousel container found.");

        container.innerHTML = "";

        // Get selected language
        const language = document.getElementById("lang-select").value;

        // Fetch collaborators JSON directly
        fetch("./data/collaborators.json")
            .then(response => {
                if (!response.ok) throw new Error("Failed to load collaborators JSON");
                return response.json();
            })
            .then(collaborators => {
                collaborators.forEach(item => {
                    const localized = item[language] || item["en"]; // fallback to English

                    const div = document.createElement("div");
                    div.className = "collab-item";
                    div.innerHTML = `
                    <div class="collab-description">
                        <h3>${item.name}</h3>
                        <p><strong>${localized.Title}</strong> — ${localized.University}</p>
                        <p>${localized.Branch}, ${localized.Country}</p>
                    </div>
                    <div class="collab-photo">
                        <img src="${item.image_url}" alt="${item.name}">
                    </div>
                `;
                    container.appendChild(div);
                });
            })
            .catch(err => console.error("Error loading collaborators:", err));
    }

    // ---------------------- PORTFOLIO VIEW FUNCTIONS ----------------------

    // Language helper for portfolio fields
    function getTranslatedField(field) {
        const lang = document.getElementById('lang-select').value;
        if (typeof field === 'object' && !Array.isArray(field)) {
            return field[lang] || Object.values(field)[0];
        }
        return field;
    }

    // Filter portfolio data
    function filterData(category) {
        if (category === 'all') {
            filteredData = [...data];
        } else {
            filteredData = data.filter(item =>
                (typeof item.category === 'object' ? item.category.en : item.category) === category
            );
        }

        // Sort filteredData by most recent first
        filteredData.sort((a, b) => {
            const dateA = a.finish.toLowerCase() === 'today' ? new Date() : new Date(a.finish);
            const dateB = b.finish.toLowerCase() === 'today' ? new Date() : new Date(b.finish);
            return dateB - dateA;
        });

        const activeView =
            document.querySelector('.timeline')?.classList.contains('active') ? 'timeline' :
                document.querySelector('.accordion')?.classList.contains('active') ? 'accordion' :
                    'interactive';

        switchViewMode(activeView);
    }

    // Switch portfolio views
    function switchViewMode(viewMode) {
        document.querySelector('.timeline')?.classList.remove('active');
        document.querySelector('.accordion')?.classList.remove('active');
        document.querySelector('.interactive')?.classList.remove('active');

        if (viewMode === 'timeline') {
            document.querySelector('.timeline')?.classList.add('active');
            renderTimeline();
        } else if (viewMode === 'accordion') {
            document.querySelector('.accordion')?.classList.add('active');
            renderAccordion();
        } else {
            document.querySelector('.interactive')?.classList.add('active');
            renderInteractive();
        }
    }

    function formatDate(dateStr) {
        const lang = document.getElementById("lang-select").value;
        const date = dateStr.toLowerCase() === 'today' ? new Date() : new Date(dateStr);
        return new Intl.DateTimeFormat(lang, {
            weekday: 'short',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
        }).format(date);
    }

    function renderTimeline() {
        const container = document.getElementById('timeline-container');
        if (!container) return;

        container.innerHTML = '';

        // Sort filteredData by most recent first
        filteredData.sort((a, b) => {
            const dateA = a.finish.toLowerCase() === 'today' ? new Date() : new Date(a.finish);
            const dateB = b.finish.toLowerCase() === 'today' ? new Date() : new Date(b.finish);
            return dateB - dateA;
        });

        filteredData.forEach((item, index) => {
            const side = index % 2 === 0 ? 'left' : 'right';
            const moreInfoButton = item.links ?
                `<a href="${item.links}" target="_blank" class="btn">More Info</a>` : '';

            const timelineItem = document.createElement('div');
            timelineItem.classList.add('timeline-item', side);
            timelineItem.innerHTML = `
            <h3>${getTranslatedField(item.details)}</h3>
            <p><strong>${getTranslatedField(item.institution)}</strong></p>
            <p>${getTranslatedField(item.participation)}</p>
            <p><em>${formatDate(item.finish)}</em></p>
            ${moreInfoButton}
        `;
            container.appendChild(timelineItem);
        });
    }

    function renderAccordion() {
        const container = document.getElementById('accordion-container');
        container.innerHTML = '';

        if (!filteredData || filteredData.length === 0) {
            container.innerHTML = '<p>No projects found.</p>';
            return;
        }

        // Group projects by localized institution
        const groups = {};
        filteredData.forEach(item => {
            const institution = getTranslatedField(item.institution); // localized institution
            if (!groups[institution]) groups[institution] = [];
            groups[institution].push(item);
        });

        // Create accordion items for each institution
        for (const institution in groups) {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'accordion-category';

            const header = document.createElement('h3');
            header.textContent = institution;
            categoryDiv.appendChild(header);

            // Container for the projects under this institution
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'accordion-items show'; // visible by default

            // Display each project in a grid inside this institution
            groups[institution].forEach(item => {
                const moreInfoButton = item.links ?
                    `<a href="${item.links}" target="_blank" class="btn small">More Info</a>` : '';

                const projectDiv = document.createElement('div');
                projectDiv.className = 'accordion-project';
                projectDiv.innerHTML = `
                <h4>${getTranslatedField(item.details)}</h4>
                <p><strong>${getTranslatedField(item.participation)}</strong></p>
                <p><em>${formatDate(item.finish)}</em></p>                
                ${moreInfoButton}
            `;
                itemsContainer.appendChild(projectDiv);
            });

            categoryDiv.appendChild(itemsContainer);
            container.appendChild(categoryDiv);

            // Optional: toggle visibility when clicking the institution header
            header.addEventListener('click', () => {
                itemsContainer.classList.toggle('show');
            });
        }
    }

    function renderInteractive() {
        const container = document.getElementById('interactive-container');
        container.innerHTML = '';

        if (!filteredData || filteredData.length === 0) {
            container.innerHTML = '<p style="color:#888;">No projects found.</p>';
            return;
        }

        // Sort by most recent
        filteredData.sort((a, b) => new Date(b.finish) - new Date(a.finish));

        filteredData.forEach(item => {
            const category = getTranslatedField(item.category);
            const moreInfoButton = item.links ?
                `<a href="${item.links}" target="_blank" class="btn small">More Info</a>` : '';

            const card = document.createElement('div');
            card.className = `interactive-card category-${category.replace(/\s+/g, '-')}`;
            card.innerHTML = `
            <div class="card-content">
                <h4>${getTranslatedField(item.details)}</h4>
                <p><strong>${getTranslatedField(item.participation)}</strong></p>
                <p class="institution">${getTranslatedField(item.institution)}</p>
                <p class="dates">${formatDate(item.finish)}</p>
                ${moreInfoButton}
            </div>
        `;
            container.appendChild(card);
        });
    }



    // Load portfolio JSON
    function loadPortfolioData() {
        fetch('./data/portfolio.json')
            .then(response => {
                if (!response.ok) throw new Error('Failed to load JSON data');
                return response.json();
            })
            .then(json => {
                data = [...json];
                filteredData = [...json];
                filterData('all');
                switchViewMode('timeline');
            })
            .catch(err => console.error('Error loading portfolio JSON:', err));
    }

    // ---------------------- INITIALIZATION ----------------------
    function initializeAllData() {
        const lang = document.getElementById("lang-select").value;
        updateAboutSection();  // existing
        jsonToTable("./data/projects.json", "tableContainer");  // existing
        updateCollaborationsSection()
        loadPortfolioData();  // <-- integrated portfolio loader
        document.querySelectorAll("[data-lang]").forEach(el => {
            const key = el.getAttribute("data-lang");
            if (translations[lang][key]) el.innerHTML = translations[lang][key];
        });
    }

    // ---------------------- LANGUAGE HANDLING ----------------------
    function detectUserLanguage() {
        const userLang = navigator.language || navigator.userLanguage;
        let language = "en";
        if (userLang.includes("zh")) language = "zh";
        else if (userLang.includes("ja")) language = "ja";
        else if (userLang.includes("es")) language = "es";
        return language;
    }

    function setLanguage() {
        const language = detectUserLanguage();
        document.getElementById("lang-select").value = language;
        initializeAllData();
    }

    document.getElementById("lang-select").addEventListener("change", e => {
        initializeAllData();
    });

    // ---------------------- EXPOSE FUNCTIONS GLOBALLY ----------------------
    window.switchViewMode = switchViewMode;
    window.filterData = filterData;

    // ---------------------- INITIAL LOAD ----------------------
    setLanguage();
});