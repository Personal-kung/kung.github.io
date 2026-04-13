let data = [];  // Will hold the JSON data
let filteredData = [];  // A copy of the data for filtering purposes

// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {


    // Set current year in footer
    document.getElementById("year").textContent = new Date().getFullYear();

    async function loadProfiles() {
        const grid = document.getElementById("tileGrid");
        if (!grid) return;

        try {
            const response = await fetch("data/information.json");
            const data = await response.json();
            const profiles = Array.isArray(data) ? data : data.profiles;
            if (!profiles) return;

            const fragment = document.createDocumentFragment();

            profiles.forEach(profile => {
                if (!profile.profile_image) return;

                const tile = document.createElement("div");
                tile.className = "tile";

                const img = document.createElement("img");
                img.src = profile.profile_image;
                img.loading = "lazy";

                tile.appendChild(img);
                fragment.appendChild(tile);
            });

            grid.appendChild(fragment);

        } catch (error) {
            console.error("Error loading images:", error);
        }
    }

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
            "about-title": "Kelvin Kung",
            "about-intro": "Kelvin Kung is an Electrical and Electronics Engineer. Currently researching Very Large System Integration (VLSI) testing in Kyushu Institute of Technology",
            "about-body": "Kelvin worked in Technological University of Panama (2022-2025) focusing on high voltage electrical systems design, with an emphasis on innovation and real-world applications. Throughout his career, he designed and installed complex electrical systems, including lightning rods, grounding systems, and reactive capacitors compensation systems. He set benchmarks for nationwide electricity controls in universities, utilizing SCADA systems and Power BI to enhance decision-making processes.",
            "about-body1": "Kelvin conducted and organized power quality analysis tests across both public and private sectors nationwide. Additionally, I have experience designing and overseeing high-voltage systems (13.8kV and derivatives) ensuring safety and efficiency in electrical distribution.",
            "about-body2": "On the electronic side, he has worked on several innovative projects, including electromechanical teleoperation, spectral analysis for watermelons, and the development of the first Panamanian patent for nanoelectrical circuits. Kelvin has also designed a scoring board for the university's baseball field and contributed to multiple international publications and conferences, including IEEE and Neurocomputing (Elsevier).",
            "about-body3": "In 2023 and 2024 Kelvin served as judge for Robocup Jr. international competitions in Europe and America. Furthermore, he has designed and build low-cost robotic kits for public schools to help students develop robotics skills. He also contributed to specialized electronics projects aimed at assisting disabled people, such as developing a smart wheelchair for paraplegic individuals.",
            "about-conclusion": "Kelvin received his B.S. in Electrical and Electronics Engineering from Technological University of Panama (2022)",
            "exp-title": "Experience",
            "exp-academic": "Academic",
            "exp-research": "Researcher",
            "exp-professional": "Professional",
            "academic-details": "Academic",
            "research-details": "Researcher",
            "professional-details": "Professional",
            "projects-title": "Highlights",
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
            "filter-inte-title": "Interactive View",
            "stats-projects": "Projects",
            "stats-collaborators": "Collaborators",
            "stats-institutions": "Institutions",
            "brand-title": "Global Partners & Institutions"
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
            "about-title": "Kelvin Kung",
            "about-intro": "Kelvin Kung es Ingeniero Eléctrico y Electrónico. Actualmente investiga las pruebas de Integración de Sistemas Muy Grandes (VLSI <i>Very Large System Integration</i>) en el Instituto Tecnológico de Kyushu.",
            "about-body": "Kelvin trabajó en la Universidad Tecnológica de Panamá (2022-2025), enfocándose en el diseño de sistemas eléctricos de media y alta tensión, con énfasis en la innovación y las aplicaciones prácticas. A lo largo de su carrera, diseñó e instaló sistemas eléctricos complejos, incluyendo pararrayos, sistemas de puesta a tierra y sistemas de compensación de condensadores reactivos. Estableció puntos de referencia para los controles eléctricos a nivel nacional en universidades, utilizando sistemas SCADA y Power BI para optimizar los procesos de toma de decisiones.",
            "about-body1": "Kelvin realizó y organizó pruebas de análisis de calidad de energía en los sectores público y privado de todo el país. Además, tiene experiencia en el diseño y la supervisión de sistemas de alta tensión (13.8 kV y derivados), garantizando la seguridad y la eficiencia en la distribución eléctrica.",
            "about-body2": "En el ámbito electrónico, ha trabajado en varios proyectos innovadores, incluyendo teleoperación electromecánica, análisis espectral para sandías y el desarrollo de la primera patente panameña para circuitos nanoeléctricos. Kelvin también diseñó un marcador para el campo de béisbol de la universidad y colaboró ​​en múltiples publicaciones y conferencias internacionales, incluyendo IEEE y Neurocomputing (Elsevier).",
            "about-body3": "En 2023 y 2024, Kelvin fue jurado en las competiciones de Robocup Jr. en Europa y América. Además, diseñó y construyó kits robóticos de bajo costo para escuelas públicas, ayudando a los estudiantes a desarrollar habilidades robóticas. También contribuyó a proyectos electrónicos especializados para ayudar a personas con discapacidad, como el desarrollo de una silla de ruedas inteligente para personas parapléjicas.",
            "about-conclusion": "Kelvin obtuvo su licenciatura en Ingeniería Eléctrica y Electrónica en la Universidad Tecnológica de Panamá (2022)",
            "exp-title": "Experiencia",
            "exp-academic": "Académico",
            "exp-research": "Investigador",
            "exp-professional": "Profesional",
            "academic-details": "Académico",
            "research-details": "Investigador",
            "professional-details": "Profesional",
            "projects-title": "Proyectos Destacados",
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
            "filter-inte-title": "Vista Interactiva",
            "stats-projects": "Proyectos",
            "stats-collaborators": "Colaboradores",
            "stats-institutions": "Instituciones",
            "brand-title": "Alianzas Globales e Instituciones"
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
            "about-title": "龚颖贤",
            "about-intro": "龚颖贤是一名电气与电子工程师,目前在九州工业大学从事超大型系统集成(VLSI)测试方面的研究。",
            "about-body": "凯尔文于2022年至2025年在巴拿马科技大学工作,专注于高压电力系统设计,尤其注重创新和实际应用。在他的职业生涯中,他设计并安装了复杂的电力系统,包括避雷针、接地系统和无功电容补偿系统。他利用SCADA系统和Power BI来优化决策流程,为全国高校的电力控制树立了标杆。",
            "about-body1": "颖贤负责组织和开展全国范围内的公共和私营部门的电能质量分析测试。此外,我拥有设计和监管高压系统(13.8kV及其衍生电压)的经验,确保配电的安全性和效率。",
            "about-body2": "在电子领域,他参与了多个创新项目,包括机电远程操控、西瓜光谱分析以及巴拿马首个纳米电路专利的开发。凯尔文还为大学棒球场设计了记分牌,并为包括IEEE和《神经计算》(爱思唯尔出版社)在内的多家国际期刊和会议撰稿。",
            "about-body3": "2023年和2024年,凯尔文担任了欧洲和美洲Robocup Jr.国际机器人大赛的评委。此外,他还为公立学校设计并制造了低成本的机器人套件,以帮助学生培养机器人技能。他还参与了一些旨在帮助残疾人士的专用电子产品项目,例如为截瘫患者开发智能轮椅。",
            "about-conclusion": "颖贤于2022年获得巴拿马科技大学电气与电子工程学士学位。",
            "exp-title": "经验",
            "exp-academic": "学术",
            "exp-research": "研究者",
            "exp-professional": "职业",
            "academic-details": "学术",
            "research-details": "研究者",
            "professional-details": "职业",
            "projects-title": "亮点",
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
            "filter-inte-title": "交互式视图",
            "stats-projects": "项目",
            "stats-collaborators": "合作伙伴",
            "stats-institutions": "合作机构",
            "brand-title": "全球合作伙伴与机构"
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
            "about-title": "クン・ケルビンについて",
            "about-intro": "クン・ケルビンさんは電気電子工学のエンジニアです。現在、九州工業大学で超大規模システム統合(VLSI)のテストに関する研究を行っています。",
            "about-body": "クンさんはパナマ工科大学(2022～2025年)に勤務し、高電圧電気システムの設計、特にイノベーションと実社会への応用に重点を置いて研究を行いました。キャリアを通じて、避雷針、接地システム、リアクタンスコンデンサ補償システムなど、複雑な電気システムの設計・設置に携わりました。SCADAシステムとPower BIを活用した意思決定プロセスの改善により、全国の大学における電力制御のベンチマークを確立しました。",
            "about-body1": "クンさんは、全国の公共部門と民間部門の両方で電力品質分析試験を実施・運営してきました。さらに、配電の安全性と効率性を確保する高電圧システム(13.8kVおよび派生電圧)の設計と監督の経験も豊富です。",
            "about-body2": "電子工学分野では、電気機械遠隔操作、スイカのスペクトル分析、パナマ初のナノ電気回路特許取得など、数々の革新的なプロジェクトに携わってきました。また、大学野球場のスコアボードの設計や、IEEEやNeurocomputing(ELSEVIER)など、複数の国際的な出版物や会議への寄稿も行っています。",
            "about-body3": "クンさんは2023年と2024年に、ヨーロッパとアメリカで開催された国際大会「ロボカップ・ジュニア」の審査員を務めました。さらに、公立学校向けに低価格のロボットキットを設計・構築し、生徒のロボット工学スキル向上を支援しました。また、下半身麻痺者向けのスマート車椅子の開発など、障害者支援を目的とした専門的な電子機器プロジェクトにも貢献しました。",
            "about-conclusion": "クンさんはパナマ工科大学で電気電子工学の学士号を取得しました(2022年)",
            "exp-title": "経験",
            "exp-academic": "学術",
            "exp-research": "研究者",
            "exp-professional": "プロフェッショナル",
            "academic-details": "学術",
            "research-details": "研究者",
            "professional-details": "プロフェッショナル",
            "projects-title": "ハイライト",
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
            "filter-inte-title": "インタラクティブ表示",
            "stats-projects": "プロジェクト",
            "stats-collaborators": "協力者",
            "stats-institutions": "所属機関",
            "brand-title": "連携機関・ブランド"
        }
    };

    /** Animated counter function */
    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            obj.innerHTML = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    /** Setup IntersectionObserver for stats */
    function setupStatsAnimation(p, c, i) {
        const section = document.getElementById("stats-section");
        if (!section) return;
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateValue(document.getElementById("count-projects"), 1, p, 2000);
                animateValue(document.getElementById("count-collabs"), 1, c, 2000);
                animateValue(document.getElementById("count-institutions"), 1, i, 2000);
                observer.unobserve(section);
            }
        }, { threshold: 0.5 });
        observer.observe(section);
    }    

    function updateCollaborationsSection() {
        const container = document.querySelector(".collab-carousel");
        const showcaseContainer = document.getElementById("institution-logos");
        if (!container) return;

        container.innerHTML = "";
        const uniqueInstitutions = new Set();

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
                    const inst = tField(item.university);
                    if (inst) uniqueInstitutions.add(inst);

                    const div = document.createElement("div");
                    const hasWebsite = item.webpage && item.webpage.trim() !== "";
                    div.className = "collab-item" + (hasWebsite ? " has-link" : "");
                    
                    if (hasWebsite) {                        
                        div.style.cursor = "pointer";
                        div.addEventListener("click", () => window.open(item.webpage, "_blank"));
                    }

                    div.innerHTML = `
                    <div class="collab-description">
                        <h3>${tField(item.name)}</h3>
                        <p><strong>${tField(item.title)}</strong> — ${inst}</p>
                        ${hasWebsite ? '<a href="#" target="_blank" class="visit-link">' : ''}
                        <p>${(tField(item?.branch) ?? "") && `${tField(item?.branch)}, `} ${tField(item.country)}</p>                        
                    </div>
                    <div class="collab-photo">
                        <img src="${item.image_url}" alt="${item.name}">
                    ${hasWebsite ? '</a>' : ''}</div>
                `;
                    container.appendChild(div);
                });

                // Update Stats and Showcase once collaborator data is ready
                const projectsCount = data.filter(item => {
                    const cat = (item.category?.en || item.category || "").toLowerCase();
                    return cat === "professional" || cat === "research";
                }).length;
                const collabsCount = collaborators.length;
                const instCount = uniqueInstitutions.size;
                setupStatsAnimation(projectsCount, collabsCount, instCount);

                if (showcaseContainer) {
                    renderInstitutionShowcase(uniqueInstitutions, showcaseContainer);
                }
            })
            .catch(err => console.error("Error loading collaborators:", err));
    }

    // ---------------------- PORTFOLIO VIEW FUNCTIONS ----------------------
    /* =========================
       GLOBAL STATE
    ========================== */
    let data = [], filtered = [];
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);
    const langSelect = $("#lang-select");

    /* =========================
       UTILITIES
    ========================== */

    /** Get current selected language */
    const lang = () => langSelect.value;

    /** Translate object field by language */
    const tField = f =>
        f && typeof f === "object" && !Array.isArray(f)
            ? f[lang()] || Object.values(f)[0]
            : (f || "");

    /** Format date (supports 'today') */
    const formatDate = d =>
        new Intl.DateTimeFormat(lang(), {
            weekday: "short", month: "long", day: "numeric", year: "numeric"
        }).format(d.toLowerCase() === "today" ? new Date() : new Date(d));

    /** Sort projects by finish date desc */
    const sortByDate = arr =>
        arr.sort((a, b) =>
            (b.finish.toLowerCase() === "today" ? new Date() : new Date(b.finish)) -
            (a.finish.toLowerCase() === "today" ? new Date() : new Date(a.finish))
        );

    /** Generate links button group */
    const renderLinks = links =>
        links && typeof links === "object"
            ? `<div class="btn-group">
          ${Object.entries(links)
                .map(([l, u]) => `<a href="${u}" target="_blank" class="btn">More info in ${l}</a>`)
                .join("")}
         </div>`
            : "";

    /** Generate optional profile image */
    const renderImage = (src, cls, alt) =>
        src
            ? `<div class="${cls}">
           <img src="${src}" alt="${alt}" loading="lazy"/>
         </div>`
            : "";

    /** Fetch JSON helper */
    const fetchJSON = url =>
        fetch(url).then(r => {
            if (!r.ok) throw new Error(`Failed to load ${url}`);
            return r.json();
        });

    /* =========================
       TABLE GENERATOR
    ========================== */

    /**
     * Render JSON file into table
     * @param {string} url
     * @param {string} containerId
     */
    const jsonToTable = (url, containerId) => {
        fetchJSON(url).then(rows => {
            const html = `
        <table style="width:100%;border-collapse:collapse;margin-top:2rem;">
          <thead>
            <tr style="background:var(--secondary-color);">
              <th style="padding:1rem;text-align:center;">Project Name</th>
              <th style="padding:1rem;text-align:center;">Summary</th>
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr style="border:5px solid #999;">
                <td>
                  <a href="details.html?projectId=${r.id}" target="_blank"
                     style="color:var(--accent-color);text-decoration:none;">
                     ${r.title[lang()]}
                  </a>
                </td>
                <td>${r.summary[lang()]}</td>
              </tr>
            `).join("")}
          </tbody>
        </table>`;
            $("#" + containerId).innerHTML = html;
        });
    };

    /* =========================
       PORTFOLIO FILTERING
    ========================== */

    /**
     * Filter projects by category
     * @param {string} category
     */
    const filterData = category => {
        filtered = category === "all"
            ? [...data]
            : data.filter(i =>
                (typeof i.category === "object" ? i.category.en : i.category) === category
            );
        sortByDate(filtered);
        renderActiveView();
    };

    /** Detect active view */
    const getActiveView = () =>
        $(".timeline.active") ? "timeline"
            : $(".accordion.active") ? "accordion"
                : "interactive";

    /** Switch UI mode */
    const switchViewMode = mode => {
        ["timeline", "accordion", "interactive"]
            .forEach(v => $("." + v)?.classList.remove("active"));
        $("." + mode)?.classList.add("active");
        renderActiveView();
    };

    /** Render current active view */
    const renderActiveView = () => {
        const view = getActiveView();
        view === "timeline" ? renderTimeline()
            : view === "accordion" ? renderAccordion()
                : renderInteractive();
    };

    /* =========================
       VIEW RENDERERS
    ========================== */

    const renderTimeline = () => {
        const c = $("#timeline-container");
        if (!c) return;
        c.innerHTML = "";
        sortByDate(filtered).forEach((i, idx) => {
            c.innerHTML += `
        <div class="timeline-item ${idx % 2 ? "right" : "left"}">
          <div class="timeline-content clickable-card"
               data-href="details1.html?projectId=${i.id}">
            ${renderImage(i.profile_image, "timeline-profile-image", tField(i.title))}
            <h3>${tField(i.title)}</h3>
            <p class="institution">${tField(i.institution)}</p>
            <p>${tField(i.participation)}</p>
            <p class="date">${formatDate(i.finish)}</p>
            ${renderLinks(i.links)}
          </div>
        </div>`;
        });
    };

    const renderAccordion = () => {
        const c = $("#accordion-container");
        if (!c) return;
        c.innerHTML = "";
        if (!filtered.length) return c.innerHTML = "<p>No projects found.</p>";

        const groups = {};
        filtered.forEach(i => {
            const key = tField(i.institution);
            (groups[key] ||= []).push(i);
        });

        Object.entries(groups).forEach(([inst, items]) => {
            const block = document.createElement("div");
            block.className = "accordion-category";
            block.innerHTML = `
        <h3>${inst}</h3>
        <div class="accordion-items show">
          ${items.map(i => `
            <div class="accordion-project">
              ${renderImage(i.profile_image, "accordion-profile-image", tField(i.title))}
              <h4>${tField(i.title)}</h4>
              <p><strong>${tField(i.participation)}</strong></p>
              <p><em>${formatDate(i.finish)}</em></p>
              ${renderLinks(i.links)}
            </div>`).join("")}
        </div>`;
            block.querySelector("h3")
                .addEventListener("click", () =>
                    block.querySelector(".accordion-items").classList.toggle("show"));
            c.appendChild(block);
        });
    };

    const renderInteractive = () => {
        const c = $("#interactive-container");
        if (!c) return;
        c.innerHTML = "";
        if (!filtered.length)
            return c.innerHTML = '<p style="color:#888;">No projects found.</p>';

        sortByDate(filtered).forEach(i => {
            c.innerHTML += `
        <div class="interactive-card clickable-card category-${i.category.en}"
             data-href="details1.html?projectId=${i.id}">
          ${renderImage(i.profile_image, "interactive-profile-image", tField(i.title))}
          <div class="card-content">
            <h4>${tField(i.title)}</h4>
            <p><strong>${tField(i.participation)}</strong></p>
            <p class="institution">${tField(i.institution)}</p>
            <p class="dates">${formatDate(i.finish)}</p>
            ${renderLinks(i.links)}
          </div>
        </div>`;
        });
    };


    /* =========================
       NEW ENHANCEMENTS
    ========================== */

    function updateDynamicFooter() {
        const ftEmail = document.getElementById("footer-email");
        const ftGithub = document.getElementById("footer-github");
        if (!ftEmail || !ftGithub) return;
        const currentLang = langSelect.value;
        if (currentLang === "zh" || currentLang === "ja") {
            ftEmail.href = "mailto:kelvinmext1@gmail.com";
            ftGithub.href = "https://github.com/Personal-kung";
        } else {
            ftEmail.href = "mailto:kelvin.kung@utp.ac.pa";
            ftGithub.href = "https://github.com/kelvinutp";
        }
    }

    function renderHighlights() {
        const hc = document.getElementById("highlights-container");
        if (!hc) return;

        let highlights = data.filter(d => d.highlight).sort((a, b) => a.highlight - b.highlight);

        const fallbackDescs = {
            6: {
                en: "Explore the intersection of hardware and software with innovative robotics solutions designed to improve academic access and foster new avenues of technical discovery.",
                es: "Explora la intersección de hardware y software con soluciones robóticas innovadoras diseñadas para mejorar el acceso académico y fomentar nuevas vías de descubrimiento técnico.",
                zh: "探索硬件与软件的交叉领域，通过创新的机器人解决方案旨在提高学术界的可及性并促进技术发现的新途径。",
                ja: "ハードウェアとソフトウェアの交差点を探求し、学問のアクセスを改善し、技術的発見の新しい道を開くために設計された革新的なロボティクスソリューション。"
            }
        };

        hc.innerHTML = highlights.map(i => {
            let desc = tField(i.summary) || (fallbackDescs[i.id] ? fallbackDescs[i.id][lang()] : "");
            return `
            <div class="highlight-card clickable-card" data-href="details1.html?projectId=${i.id}">
                <div class="highlight-image">
                    <img src="${i.profile_image}" alt="highlight" loading="lazy">
                </div>
                <div class="highlight-content">
                    <h3>${tField(i.title)}</h3>
                    <p>${desc}</p>
                </div>
            </div>`;
        }).join('');
    }

    function renderPortfolios() {
        const pt = document.getElementById("portfolios-track");
        if (!pt) return;

        const productsMap = {};
        data.forEach(d => {
            const catEn = d.category ? (d.category.en || d.category) : '';
            if (catEn === 'Research' || catEn === 'Professional') {
                if (d.Product && !productsMap[d.Product]) {
                    productsMap[d.Product] = true;
                }
            }
        });

        const products = Object.keys(productsMap);
        if (products.length === 0) return;

        const productInfo = {
            "Robotics": {
                img: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&q=80&w=600",
                desc: {
                    en: "Cutting-edge electromechanical systems and automated machines driving the future of industry.",
                    es: "Sistemas electromecánicos de vanguardia y máquinas automatizadas impulsando el futuro de la industria.",
                    zh: "推动行业未来的尖端机电系统和自动化机器。",
                    ja: "産業の未来を牽引する最先端の電気機械システムと自動化機械。"
                }
            },
            "Dashboards": {
                img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=600",
                desc: {
                    en: "Robust monitoring, SCADA setups, and data visualization bridging hardware with human insights.",
                    es: "Monitoreo robusto, configuraciones SCADA y visualización de datos uniendo el hardware con conocimientos humanos.",
                    zh: "强大的监控、SCADA设置和数据可视化，连接硬件与人类洞察。",
                    ja: "堅牢な監視、SCADA設定、データ可視化によりハードウェアと人間の洞察を結びつける。"
                }
            },
            "Programming": {
                img: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=600",
                desc: {
                    en: "Scalable software solutions, from enterprise-level integrations to intricate machine logic.",
                    es: "Soluciones de software escalables, desde integraciones a nivel empresarial hasta lógica de máquina intricada.",
                    zh: "从企业级集成到复杂机器逻辑的可扩展软件解决方案。",
                    ja: "企業レベルの統合から複雑な機械ロジックまで、拡張性のあるソフトウェアソリューション。"
                }
            },
            "Electronics": {
                img: "https://cdn.rohde-schwarz.com/image/market-segments/industry-components-and-research-electronic-design-electronic-design-keyvisual-rohde-schwarz_200_104856_2880_1620_6.jpg",
                desc: {
                    en: "High-precision embedded systems, PCBs, and advanced energy technologies solving real-world challenges.",
                    es: "Sistemas embebidos de alta precisión, PCBs y tecnologías energéticas avanzadas resolviendo desafíos del mundo real.",
                    zh: "解决现实挑战的高精度嵌入式系统、PCB及先进能源技术。",
                    ja: "現実世界の課題を解決する高精度な組み込みシステム、PCB、最先端のエネルギー技術。"
                }
            },
            "Smart Systems": {
                img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600",
                desc: {
                    en: "Intelligent analytics, modeling, and algorithm development bridging theoretical research with practical utility.",
                    es: "Análisis inteligente, modelado y desarrollo de algoritmos uniendo la investigación teórica con la utilidad práctica.",
                    zh: "连接理论研究与实用价值的智能分析、建模及算法开发。",
                    ja: "理論研究と実用性を結びつけるインテリジェントな分析、モデリング、アルゴリズム開発。"
                }
            },
            "Research & Engineering": {
                img: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600",
                desc: {
                    en: "Specialized initiatives pushing the boundaries of scientific inquiry and applied technology.",
                    es: "Iniciativas especializadas superando los límites de la investigación científica y la tecnología aplicada.",
                    zh: "突破科学探究与应用技术边界的专业项目。",
                    ja: "科学的探求と応用技術の境界を押し広げる専門的な取り組み。"
                }
            }
        };

        pt.innerHTML = products.map(p => {
            const info = productInfo[p] || productInfo["Research & Engineering"];
            return `
            <div class="portfolio-card" onclick="window.open('portfolio_summary.html?product='+encodeURIComponent('${p}'), '_blank')">
                <div class="p-img-wrapper">
                    <img src="${info.img}" alt="${p}" loading="lazy">
                </div>
                <div class="p-content">
                    <h3>${p}</h3>
                    <p>${info.desc[lang()]}</p>
                </div>
            </div>`;
        }).join('');
    }

    /* =========================
       LANGUAGE + INIT
    ========================== */

    /** Detect browser language */
    const detectLang = () =>
        navigator.language?.includes("zh") ? "zh"
            : navigator.language?.includes("ja") ? "ja"
                : navigator.language?.includes("es") ? "es"
                    : "en";

    /** Apply translations */
    const applyTranslations = translations => {
        $$("[data-lang]").forEach(el => {
            const key = el.dataset.lang;
            if (translations[lang()]?.[key])
                el.innerHTML = translations[lang()][key];
        });
    };

    /** Initialize app */
    function init() {
        applyTranslations(translations);
        updateDynamicFooter();
        fetchJSON("data/information.json").then(j => {
            data = filtered = j;
            filterData("all");
            switchViewMode("timeline");
            renderHighlights();
            renderPortfolios();
            // Load collaborations after projects to ensure data is available for counters
            updateCollaborationsSection();
        });
        loadProfiles();
    }

    /* =========================
       EVENTS
    ========================== */

    document.addEventListener("click", e => {
        if (e.target.closest("a,.btn")) return;
        const card = e.target.closest(".clickable-card");
        if (card?.dataset.href) window.open(card.dataset.href, "_blank");
    });

    langSelect.addEventListener("change", () => {
        init(window.translations);
        updateDynamicFooter();
    });
    window.switchViewMode = switchViewMode;
    window.filterData = filterData;

    /* =========================
       START
    ========================== */

    langSelect.value = detectLang();
    init(window.translations);

});