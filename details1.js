document.addEventListener("DOMContentLoaded", () => {

  /* ================= STATE ================= */

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const langSelect = $("#lang-select");
  const contentEl = $("#projectContent");

  const lang = () => langSelect.value;

  const t = v =>
    v && typeof v === "object"
      ? v[lang()] || Object.values(v)[0] || ""
      : v || "";

  const formatDate = d =>
    !d ? "" :
      new Intl.DateTimeFormat(lang(), {
        weekday: "short", month: "long", day: "numeric", year: "numeric"
      }).format(d.toLowerCase?.() === "today" ? new Date() : new Date(d));

  const fetchJSON = url =>
    fetch(url).then(r => r.ok ? r.json() : Promise.reject(url));

  /* ================= RENDER HELPERS ================= */

  const table = (head, rows, cls = "") =>
    rows?.length
      ? `<table class="${cls}">
           ${head}
           <tbody>${rows.join("")}</tbody>
         </table>`
      : "";

  const renderLinks = links =>
    links && Object.keys(links).length
      ? table(
        `<thead><tr><th>Link</th><th>URL</th></tr></thead>`,
        Object.entries(links).map(([l, u]) =>
          `<tr>
               <td>${l}</td>
               <td><a href="${u}" target="_blank" rel="noopener">${u}</a></td>
             </tr>`
        ),
        "links-table"
      )
      : "";

  const renderCollaborators = list =>
    Array.isArray(list) && list.length
      ? `
        <h3>Project Collaborators</h3>
        ${table(
        `<thead>
             <tr>
               <th>Name</th><th>Role</th><th>Email</th>
             </tr>
           </thead>`,
        list.map(i => `
            <tr>
              <td>${t(i?.name)}</td>
              <td>${t(i?.roles)}</td>
              <td><a href="mailto:${i?.email || ""}">
                  ${i?.email || ""}
              </a></td>
            </tr>
          `), "links-table"
      )}
      `
      : "";

  const renderGallery = imgs => {
    const list = [].concat(imgs || []).filter(Boolean);
    return list.length
      ? `<section id="justifiedGallery">
           ${list.map(src => `<img src="${src}" loading="lazy">`).join("")}
         </section>`
      : "";
  };

  const renderContent = obj =>
    obj && typeof obj === "object"
      ? Object.entries(obj)
        .filter(([, v]) => v && (!Array.isArray(v) || v.length))
        .map(([k, v]) => `
            <div class="content-section section-${k}">
              <h3>${k[0].toUpperCase() + k.slice(1)}</h3>
              <${k === "quote" ? "blockquote" : "p"}>
                ${t(v)}
              </${k === "quote" ? "blockquote" : "p"}>
            </div>
          `)
        .join("")
      : "";

  /* ================= GALLERY ================= */

  const applyJustifiedLayout = () => {
    const container = $("#justifiedGallery");
    if (!container) return;

    const imgs = [...container.querySelectorAll("img")];
    if (!imgs.length) return;

    const gap = 8;
    const width = container.clientWidth;
    const targetH = innerWidth < 768 ? 180 : 250;

    Promise.all(imgs.map(img =>
      img.complete ? img :
        new Promise(res => img.onload = () => res(img))
    )).then(images => {

      let rows = [], row = [], aspect = 0;

      images.forEach(img => {
        const r = img.naturalWidth / img.naturalHeight;
        row.push({ img, r });
        aspect += r;

        if (aspect * targetH + gap * (row.length - 1) >= width) {
          rows.push({ row, aspect });
          row = []; aspect = 0;
        }
      });

      if (row.length) rows.push({ row, aspect });

      container.innerHTML = "";

      rows.forEach(({ row, aspect }) => {
        const h = (width - gap * (row.length - 1)) / aspect;
        const div = document.createElement("div");
        div.className = "justified-row";

        row.forEach(({ img, r }) => {
          const el = document.createElement("img");
          el.src = img.src;
          el.loading = "lazy";
          el.style.cssText = `height:${h}px;width:${h * r}px`;
          div.appendChild(el);
        });

        container.appendChild(div);
      });
    });
  };

  /* ================= PROJECT ================= */

  const loadProject = () => {
    const id = +new URLSearchParams(location.search).get("projectId");
    if (!id) return contentEl.innerHTML = "<p>Project not found!</p>";

    fetchJSON("data/information.json")
      .then(data => {
        const p = data.find(x => x.id === id);
        if (!p) throw Error();

        contentEl.innerHTML = `
          <section class="detailsTitle">
            <h1>${t(p.title)}</h1>
            <h2><span>${t(p.quote)}</span></h2>
          </section>
          ${renderGallery(p.images)}
          <section class="abstract">
            <strong>${t(p.tags)}</strong><br>
            ${p.finish
            ? p.start
              ? `${formatDate(p.finish)} - ${formatDate(p.start)}`
              : formatDate(p.finish)
            : ""}<br>
            <i>${t(p.summary)}</i>
          </section>
          <section class="details">
            ${renderContent(p.content)}
            ${renderLinks(p.links)}
            ${renderCollaborators(p.collaborators)}
          </section>
        `;

        setTimeout(applyJustifiedLayout, 50);
      })
      .catch(() =>
        contentEl.innerHTML = "<p>Error loading project data.</p>"
      );
  };

  /* ================= LANGUAGE ================= */

  const detectLang = () =>
    ["zh", "ja", "es"].find(l => navigator.language?.includes(l)) || "en";

  const applyTranslations = () =>
    $$("[data-lang]").forEach(el => {
      const key = el.dataset.lang;
      const tr = window.translations?.[lang()]?.[key];
      if (tr) el.innerHTML = tr;
    });

  const init = () => {
    applyTranslations();
    loadProject();
  };

  /* ================= EVENTS ================= */

  langSelect.value = detectLang();
  langSelect.addEventListener("change", init);

  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyJustifiedLayout, 150);
  });

  init();
});