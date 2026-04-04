// portfolio_summary.js

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("year").textContent = new Date().getFullYear();

    const urlParams = new URLSearchParams(window.location.search);
    const productType = urlParams.get('product') || 'Projects';
    
    document.getElementById('product-title').textContent = productType + " Portfolio";
    
    const langSelect = document.getElementById("lang-select");

    const translations = {
        en: { subtitle: "Select a project below to learn more about my contributions to this field.", empty: "No projects found." },
        es: { subtitle: "Selecciona un proyecto de abajo para conocer más sobre mis contribuciones en este campo.", empty: "No se encontraron proyectos." },
        zh: { subtitle: "在下面选择一个项目以了解我在此领域内的贡献。", empty: "未找到项目。" },
        ja: { subtitle: "以下のプロジェクトを選択して、この分野における私の貢献について学んでください。", empty: "プロジェクトが見つかりません。" }
    };

    let data = [];

    const detectLang = () => navigator.language?.includes("zh") ? "zh" : navigator.language?.includes("ja") ? "ja" : navigator.language?.includes("es") ? "es" : "en";
    const lang = () => langSelect.value;
    
    const tField = f => f && typeof f === "object" && !Array.isArray(f) ? (f[lang()] || Object.values(f)[0]) : (f || "");

    const formatDate = d => new Intl.DateTimeFormat(lang(), { weekday: "short", month: "long", day: "numeric", year: "numeric" }).format(d.toLowerCase() === "today" ? new Date() : new Date(d));
    const renderLinks = links => links && typeof links === "object" ? `<div class="btn-group">${Object.entries(links).map(([l, u]) => `<a href="${u}" target="_blank" class="btn">More info in ${l}</a>`).join("")}</div>` : "";
    const renderImage = (src, cls, alt) => src ? `<div class="${cls}"><img src="${src}" alt="${alt}" loading="lazy"/></div>` : "";

    function renderProjects() {
        const c = document.getElementById("summary-container");
        if (!c) return;
        
        document.getElementById('product-subtitle').textContent = translations[lang()].subtitle;

        const filtered = data.filter(d => {
            const cat = (d.category?.en || d.category || '').toLowerCase();
            if(!cat.includes('research') && !cat.includes('professional')) return false;
            return d.Product === productType;
        }).sort((a, b) => (b.finish?.toLowerCase() === "today" ? new Date() : new Date(b.finish)) - (a.finish?.toLowerCase() === "today" ? new Date() : new Date(a.finish)));

        c.innerHTML = "";
        if (!filtered.length) {
            c.innerHTML = `<p style="color:#888; text-align: center;">${translations[lang()].empty}</p>`;
            return;
        }

        filtered.forEach(i => {
            const catClass = i.category?.en ? i.category.en : i.category;
            c.innerHTML += `
            <div class="interactive-card clickable-card category-${catClass}" data-href="details1.html?projectId=${i.id}">
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
    }

    document.addEventListener("click", e => {
        if (e.target.closest("a,.btn")) return;
        const card = e.target.closest(".clickable-card");
        if (card?.dataset.href) window.open(card.dataset.href, "_blank");
    });

    langSelect.addEventListener("change", renderProjects);

    fetch("data/information.json")
        .then(r => r.json())
        .then(j => {
            data = j;
            langSelect.value = detectLang();
            renderProjects();
        });
});
