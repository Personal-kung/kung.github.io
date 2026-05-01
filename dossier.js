export async function generateDossier(lang = "en") {
  const t = key => (PORTFOLIO_I18N[lang]?.[key] ?? PORTFOLIO_I18N.en[key] ?? key);
  const tF = f => f && typeof f === "object" && !Array.isArray(f)
    ? (f[lang] ?? Object.values(f)[0] ?? "") : (f ?? "");
  try {
    // Load external libs if missing
    async function loadScript(src) {
      return new Promise((resolve, reject) => {
        const s = document.createElement("script");
        s.src = src;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }

    if (typeof QRCode === "undefined") {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js");
    }
    console.log("QRCode type:", typeof QRCode);

    if (typeof html2pdf === "undefined") {
      await loadScript("https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js");
    }

    // Load data
    const res = await fetch("data/information.json");
    const data = await res.json();
    const emailAddr = t("email");
    const githubUrl = t("github");    

    // Filter ONLY items that HAVE the "highlight" field    
    const projectsArray = Array.isArray(data.projects)
      ? data.projects
      : Array.isArray(data)
        ? data
        : [];

    const highlighted = projectsArray.filter(p =>
      p && Object.prototype.hasOwnProperty.call(p, "highlight")
    );

    // Create container
    const el = document.createElement("div");
    el.style.cssText = `
      font-family: serif;
      color:#222;
      width:210mm;
      padding:0;
    `;


    // Build projects
    const projects = (highlighted || []).map(p => `
      <div style="margin-bottom:10px">
        <h3 style="margin:0">${tF(p.title)}</h3>
        <p style="margin:4px 0">${tF(p.summary)}</p>
      </div>
    `).join("");

    // Inject HTML
    el.innerHTML = `
    <div style="display:flex; min-height:297mm;">

      <!-- LEFT COLUMN -->
      <div style="width:32%; background:#f4f6f8; padding:20px;">
        <h2 style="margin-top:0;">${t("name")}</h2>

        <div id="qr" style="margin:15px 0;"></div>

        <p><b>Email</b><br>${emailAddr}</p>
        <p><b>GitHub</b><br>${githubUrl}</p>

        <h3 style="margin-top:20px;">Skills</h3>
        <p>${(data.skills?.[lang] || "").toString()}</p>
      </div>

      <!-- RIGHT COLUMN -->
      <div style="width:68%; padding:24px;">

        <h2 style="border-bottom:2px solid #000;">Profile</h2>
        <p style="text-align: justify;">${t("cv profile")}</p>

        <h2 style="border-bottom:2px solid #000; margin-top:20px;">Projects</h2>
        ${(highlighted || []).map(p => `
          <div style="margin-bottom:14px;">
            <h3 style="margin:0px;">${tF(p.title)}</h3>
            <p style="margin:4px 4px;text-align: justify;">
              ${tF(p.summary)}
            </p>
          </div>
        `).join("")}

      </div>
    </div>
    `;

    document.body.appendChild(el);

    const qrEl = el.querySelector("#qr");

    // --- Generate QR ---
    const qrInstance = new QRCode(qrEl, {
      text: "https://personal-kung.github.io/kung.github.io/",
      width: 100,
      height: 100
    });

    // --- WAIT for render ---
    await new Promise(r => setTimeout(r, 500));

    // PDF
    await html2pdf().from(el).set({
      magin: 0.5,
      filename: `CV_${lang}.pdf`,
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "in", format: "a4" }
    }).save();

    document.body.removeChild(el);

  } catch (e) {
    console.error("generateDossier error:", e);
  }
}