/**
 * Project Details Controller
 * - Loads project from URL (?projectId=)
 * - Handles multilingual UI
 * - Renders project details, links & collaborators
 * - Fully null-safe
 */

document.addEventListener("DOMContentLoaded", () => {

    /* =============================
       STATE & SHORTCUTS
    ============================== */
    const $ = s => document.querySelector(s);
    const $$ = s => document.querySelectorAll(s);
    const langSelect = $("#lang-select");

    /** Current selected language */
    const lang = () => langSelect.value;

    /** Safe object translation */
    const t = field =>
        typeof field === "object" && field !== null
            ? field?.[lang()] || Object.values(field)[0] || ""
            : field || "";

    /** Safe date formatting */
    const formatDate = d =>
        !d ? "" :
            new Intl.DateTimeFormat(lang(), {
                weekday: "short", month: "long", day: "numeric", year: "numeric"
            }).format(d.toLowerCase?.() === "today" ? new Date() : new Date(d));

    /** Fetch JSON safely */
    const fetchJSON = url =>
        fetch(url).then(r => {
            if (!r.ok) throw new Error(`Failed loading ${url}`);
            return r.json();
        });

    /* =============================
       TRANSLATIONS
    ============================== */

    const translations = window.translations || {}; // reuse if global

    const headers = {
        project_title: { en: "Project information", es: "Información del proyecto", zh: "项目信息", ja: "プロジェクト情報" },
        problem: { en: "Describing the Problem", es: "Describiendo el problema", zh: "问题描述", ja: "問題の説明" },
        reason: { en: "Why I joined?", es: "¿Por qué me integré?", zh: "为什么加入？", ja: "なぜ参加したのか？" },
        approach: { en: "My Approach", es: "Mi Enfoque", zh: "方法", ja: "私のアプローチ" },
        outcome: { en: "Outcomes", es: "Resultados", zh: "结果", ja: "結果" },
        collaborators: { en: "Project Collaborators", es: "Colaboradores del proyecto", zh: "项目合作者", ja: "プロジェクト協力者" }
    };

    /* =============================
       TABLE RENDERERS
    ============================== */

    /** Render links table */
    const renderLinks = links =>
        links && typeof links === "object" && Object.keys(links).length
            ? `
      <table class="links-table">      
        <thead>
          <tr><th>Link</th><th>URL</th></tr>
        </thead>
        <tbody>
          ${Object.entries(links).map(([l, u]) => `
            <tr>
              <td>${l}</td>
              <td><a href="${u}" target="_blank" rel="noopener">${u}</a></td>
            </tr>`).join("")}
        </tbody>
      </table>`
            : "";

    /** Render collaborators table */
    const renderCollaborators = list =>
        Array.isArray(list) && list.length
            ? `
      <h3>${t(headers.collaborators)}</h3>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:var(--secondary-color);">
            <th style="padding:.2rem;text-align:center;">Name</th>
            <th style="padding:.2rem;text-align:center;">Role</th>
            <th style="padding:.2rem;text-align:center;">Email</th>
          </tr>
        </thead>
        <tbody>
          ${list.map(i => `
            <tr>
              <td>${t(i?.name)}</td>
              <td>${t(i?.roles)}</td>
              <td>
                <a href="mailto:${i?.email || ""}"
                   style="color:var(--accent-color);text-decoration:none;">
                   ${i?.email || ""}
                </a>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>`
            : "";

    /**
     * Render Google-Photos-style justified gallery
     */
    const renderImageGallery = images => {
        if (!images) return "";

        const list = Array.isArray(images) ? images : [images];
        if (!list.length) return "";


        return `
                <section class="justified-gallery" id="justifiedGallery">
                ${list.map(src =>
            `
                    <img src="${src}" loading="lazy" />
                `).join("")}
                </section>
            `;
    };

    /**
 * Apply stable justified layout (Google-style)
 * - Waits for all images to load
 * - Uses naturalWidth / naturalHeight
 * - No zoom distortion
 * - No reload bug
 */
    const applyJustifiedLayout = () => {
        const container = document.getElementById("justifiedGallery");
        if (!container) return;

        const images = Array.from(container.querySelectorAll("img"));
        if (!images.length) return;

        const gap = 8;
        const containerWidth = container.clientWidth;
        const targetRowHeight = window.innerWidth < 768 ? 180 : 250;
        

        Promise.all(
            images.map(img =>
                img.complete
                    ? Promise.resolve(img)
                    : new Promise(res => (img.onload = () => res(img)))
            )
        ).then(loadedImages => {

            const rows = [];
            let currentRow = [];
            let aspectSum = 0;

            loadedImages.forEach(img => {
                const ratio = img.naturalWidth / img.naturalHeight;
                currentRow.push({ img, ratio });
                aspectSum += ratio;

                const rowWidth = aspectSum * targetRowHeight + gap * (currentRow.length - 1);

                if (rowWidth >= containerWidth) {
                    rows.push({ items: currentRow, aspectSum });
                    currentRow = [];
                    aspectSum = 0;
                }
            });

            if (currentRow.length) rows.push({ items: currentRow, aspectSum });

            container.innerHTML = "";


            rows.forEach(row => {
                const rowDiv = document.createElement("div");
                rowDiv.className = "justified-row";

                const rowHeight =
                    (containerWidth - gap * (row.items.length - 1)) / row.aspectSum;

                row.items.forEach(({ img, ratio }) => {
                    const newImg = document.createElement("img");
                    newImg.src = img.src;
                    newImg.loading = "lazy";
                    newImg.style.height = `${rowHeight}px`;
                    newImg.style.width = `${rowHeight * ratio}px`;
                    rowDiv.appendChild(newImg);
                });

                container.appendChild(rowDiv);
            });
        });
    };



    /* =============================
       PROJECT LOADER
    ============================== */

    /**
     * Load project from URL parameter (?projectId=)
     */
    const loadProject = () => {
        const id = parseInt(new URLSearchParams(location.search).get("projectId"));        
        if (!id) return $("#projectContent").innerHTML = "<p>Project not found!</p>";

        fetchJSON("data/information.json")
            .then(list => {
                const project = list.find(p => p.id === id);
                if (!project)
                    return $("#projectContent").innerHTML = "<p>Project not found!</p>";

                
                $("#projectContent").innerHTML = `
                    <section class="detailsTitle">
                        <h1>${t(project.title)}</h1>
                        <h2><span>${t(project.quote)}</span></h2>
                    </section>

                    ${renderImageGallery(project.images)}
                    <div class="information">
                        <section class="abstract">
                        <strong>${t(project.tags)}</strong><br>
                        ${formatDate(project.finish)} - ${formatDate(project.start)}<br>
                        <i>${t(project.summary)}</i>
                        </section>

                        <section class="details">
                        <h1>${t(headers.project_title)}</h1>

                        <h3>${t(headers.problem)}</h3>
                        <p>${t(project.problem)}</p>

                        <h3>${t(headers.outcome)}</h3>
                        <p>${t(project.outcome)}</p>

                        <h3>${t(headers.approach)}</h3>
                        <p>${t(project.approach)}</p>

                        ${renderLinks(project.links)}
                        <br>
                        ${renderCollaborators(project.collaborators)}
                        </section>
                    </div>`;
            })
            .catch(err => {
                console.error(err);
                $("#projectContent").innerHTML =
                    "<p>Error loading project data.</p>";
            });
    };

    setTimeout(applyJustifiedLayout, 100);
    let resizeTimeout;
    window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(applyJustifiedLayout, 200);
    });


    /* =============================
       LANGUAGE SYSTEM
    ============================== */

    /** Detect browser language */
    const detectLang = () =>
        navigator.language?.includes("zh") ? "zh" :
            navigator.language?.includes("ja") ? "ja" :
                navigator.language?.includes("es") ? "es" : "en";

    /** Apply UI translations */
    const applyTranslations = () => {
        $$("[data-lang]").forEach(el => {
            const key = el.dataset.lang;
            if (translations?.[lang()]?.[key])
                el.innerHTML = translations[lang()][key];
        });
    };

    /** Initialize everything */
    const init = () => {
        applyTranslations();
        loadProject();
    };

    /* =============================
       EVENTS
    ============================== */

    langSelect.value = detectLang();
    langSelect.addEventListener("change", init);

    init();
});
