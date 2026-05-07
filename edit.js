import { db } from './firebase-config.js';
import { doc, setDoc } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

class ProjectEditor {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('edit_data')) || {};
        this.temphighlightCount = parseInt(localStorage.getItem('edit_highlight_count')) + 1 || 0;
        this.currentViewLang = 'all';
        this.languages = ['en', 'es', 'zh', 'ja'];
        this.init();
    }

    toSentenceCase(str) {
        return str ? str.trim().charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
    }

    toInputDate(d) {
        if (!d) return "";
        const raw = (typeof d === "string" && d.toLowerCase() === "today") ? new Date() : new Date(d);
        return raw.toISOString().split('T')[0];
    }

    init() {
        const idField = document.getElementById('field-id');

        // Automation: ID based on project count if new
        // Note: this.getProjectCount() should be defined in admin.js/window.manager
        if (!this.data.id || this.data.id === 0) {
            idField.value = window.manager ? window.manager.getProjectCount() : 0;
        } else {
            idField.value = this.data.id;
        }

        // Dates and Profile
        document.getElementById('date-start').value = this.toInputDate(this.data.start);
        document.getElementById('date-end').value = this.toInputDate(this.data.finish);
        document.getElementById('field-profile').value = this.data.profile || "";

        // Visibility Radio Initialization
        const visId = this.data.visible === true ? 'v-true' : 'v-false';
        const visRadio = document.getElementById(visId);
        if (visRadio) visRadio.checked = true;

        // Highlight and Rank Automation
        const highToggle = document.getElementById('field-highlight');
        const rankInput = document.getElementById('field-high-rank');
        const rankCont = document.getElementById('rankContainer');

        const currentHighlight = parseInt(this.data.highlight) || 0;
        highToggle.checked = currentHighlight > 0;

        if (highToggle.checked) {
            rankInput.value = currentHighlight;
            rankCont.style.display = "block";
        }

        highToggle.onchange = (e) => {
            rankCont.style.display = e.target.checked ? "block" : "none";
            if (e.target.checked && (!rankInput.value || rankInput.value == 0)) {
                rankInput.value = this.temphighlightCount;
            }
        };

        // Images and Links
        if (Array.isArray(this.data.images)) {
            this.data.images.forEach(img => this.addImageRow(img));
        }

        if (this.data.links) {
            Object.entries(this.data.links).forEach(([k, v]) => this.addLinkRow(k, v));
        }

        // Content Shape and Initial Rendering
        const shapeSelect = document.getElementById('contentShape');
        if (shapeSelect) {
            shapeSelect.value = this.data.content_shape || 'story';
            shapeSelect.onchange = (e) => this.renderFields(e.target.value);
            this.renderFields(shapeSelect.value);
        } else {
            this.renderFields('story');
        }

        this.setupListeners();
    }

    addImageRow(val = "") {
        const container = document.getElementById('imagesContainer');
        if (!container) return;
        const row = document.createElement('div');
        row.className = 'kv-row';
        row.innerHTML = `
            <input type="text" class="img-path" placeholder="/assets/img.jpg" value="${val}">
            <button class="remove-btn">✕</button>
        `;
        row.querySelector('.remove-btn').onclick = () => row.remove();
        container.appendChild(row);
    }

    addLinkRow(key = "", val = "") {
        const container = document.getElementById('linksContainer');
        if (!container) return;
        const row = document.createElement('div');
        row.className = 'kv-row';
        row.innerHTML = `
            <input type="text" class="link-key" placeholder="Label" value="${key}" style="flex:1">
            <input type="text" class="link-val" placeholder="URL" value="${val}" style="flex:2">
            <button class="remove-btn">✕</button>
        `;
        row.querySelector('.remove-btn').onclick = () => row.remove();
        container.appendChild(row);
    }

    createLangRow(fieldName, fieldKey, isTextArea = false, isNested = false) {
        const langs = this.currentViewLang === 'all' ? this.languages : [this.currentViewLang];
        const section = document.createElement('div');
        section.className = 'field-group';
        let html = `<label class="field-title">${fieldName}</label><div class="lang-grid">`;

        langs.forEach(l => {
            let val = "";
            if (isNested) {
                const [parent, child] = fieldKey.split('.');
                val = (this.data[parent] && this.data[parent][child]) ? (this.data[parent][child][l] || '') : '';
            } else {
                val = this.data[fieldKey] ? (this.data[fieldKey][l] || '') : '';
            }

            html += `
                <div class="lang-box">
                    <span class="lang-label">${l.toUpperCase()}</span>
                    ${isTextArea ?
                    `<textarea class="text-input" data-l="${l}" data-f="${fieldKey}" rows="4">${val}</textarea>` :
                    `<input type="text" class="text-input" data-l="${l}" data-f="${fieldKey}" value="${val}">`
                }
                </div>`;
        });
        section.innerHTML = html + `</div>`;
        return section;
    }

    renderFields() {
        const container = document.getElementById('dynamicContent');
        if (!container) return;
        container.innerHTML = '';

        // Standard Metadata
        container.appendChild(this.createLangRow("Project Title", "title"));
        container.appendChild(this.createLangRow("Institution", "institution"));
        container.appendChild(this.createLangRow("Branch / League", "branch"));
        container.appendChild(this.createLangRow("Category Name", "category"));
        container.appendChild(this.createLangRow("Participation", "participation"));
        container.appendChild(this.createLangRow("Summary", "summary", true));

        // Content Shape Selection
        const shape = this.data.content_shape || 'story';
        const shapeSelector = document.createElement('div');
        shapeSelector.className = 'config-group';
        shapeSelector.innerHTML = `
        <label>Content Structure</label>
        <select id="contentShape">
            <option value="story" ${shape === 'story' ? 'selected' : ''}>Story Narrative (5 Pars)</option>
            <option value="technical" ${shape === 'technical' ? 'selected' : ''}>Technical Breakdown (4 Sections)</option>
        </select>
    `;
        container.appendChild(shapeSelector);

        const contentDiv = document.createElement('div');
        contentDiv.id = "shapeSpecificContent";
        container.appendChild(contentDiv);

        this.renderShapeFields(shape);

        document.getElementById('contentShape').onchange = (e) => {
            this.renderShapeFields(e.target.value);
        };
    }

    renderShapeFields(shape) {
        const target = document.getElementById('shapeSpecificContent');
        target.innerHTML = '';

        if (shape === 'story') {
            target.appendChild(this.createLangRow("Project Development Story", "content.story", true, true));
        } else {
            target.appendChild(this.createLangRow("Technical Challenge", "content.problem", true, true));
            target.appendChild(this.createLangRow("Methodology", "content.approach", true, true));
            target.appendChild(this.createLangRow("Role Detail", "content.role", true, true));
            target.appendChild(this.createLangRow("Key Outcome & Results", "content.outcome", true, true));
        }
    }

    async save(isTest = false) {
        // Reset/Initialize schema structures
        this.data.content = this.data.content || {};

        document.querySelectorAll('.text-input').forEach(el => {
            const { l, f } = el.dataset;
            if (f.includes('.')) {
                const [parent, child] = f.split('.');
                if (!this.data[parent]) this.data[parent] = {};
                if (!this.data[parent][child]) this.data[parent][child] = {};
                this.data[parent][child][l] = this.toSentenceCase(el.value);
            } else {
                if (!this.data[f]) this.data[f] = {};
                this.data[f][l] = this.toSentenceCase(el.value);
            }
        });

        this.data.profile = document.getElementById('field-profile').value;
        const visValue = document.querySelector('input[name="visible"]:checked');
        this.data.visible = visValue ? visValue.value === "true" : false;

        const isHighChecked = document.getElementById('field-highlight').checked;
        const rankValue = parseInt(document.getElementById('field-high-rank').value) || 0;
        this.data.highlight = isHighChecked ? rankValue : 0;

        this.data.start = document.getElementById('date-start').value;
        this.data.finish = document.getElementById('date-end').value;
        this.data.content_shape = document.getElementById('contentShape').value;

        this.data.images = Array.from(document.querySelectorAll('.img-path'))
            .map(input => input.value)
            .filter(v => v);

        this.data.links = {};
        document.querySelectorAll('#linksContainer .kv-row').forEach(row => {
            const k = row.querySelector('.link-key').value.trim();
            const v = row.querySelector('.link-val').value.trim();
            if (k) this.data.links[k] = v;
        });

        console.log("Test Save Output:", this.data);
        if (isTest) {
            const blob = new Blob([JSON.stringify(this.data, null, 4)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'testing.json';
            a.click();
            return;
        }

        try {
            
            console.log("🚀 Starting Cloud Upload...");

            // Ensure ID is a string to prevent malformed URL segments
            const docId = String(this.data.id);
            const docRef = doc(db, "projects", docId);

            console.log("Attempting to sync project with ID:", docId);

            // setDoc with merge:true mimics the behavior of a clean upload script
            await setDoc(docRef, this.data, { merge: true });
            console.log("Empty document")

            console.log(`✅ Successfully synced project ${docId} to Firestore.`);

            // 4. Update local cache to keep Admin UI in sync
            let allProjects = JSON.parse(localStorage.getItem('projects_cache')) || [];
            const index = allProjects.findIndex(p => p.id === this.data.id);
            if (index !== -1) {
                allProjects[index] = this.data;
            } else {
                allProjects.push(this.data);
            }
            localStorage.setItem('projects_cache', JSON.stringify(allProjects));

            alert("Project saved and synced successfully.");
            window.location.href = 'admin.html';           

        } catch (error) {
            console.error("❌ Cloud Save Failure:", error);
            alert("Firestore Write Blocked. Check your internet or ad-blocker.");
        }

        // alert("Project saved successfully.");
        // window.location.href = 'admin.html';
    }

    setupListeners() {
        const langSelect = document.getElementById('editLangSelect');
        if (langSelect) {
            langSelect.onchange = (e) => {
                this.currentViewLang = e.target.value;
                this.renderFields();
            };
        }

        const addLinkBtn = document.getElementById('addLinkBtn');
        if (addLinkBtn) addLinkBtn.onclick = () => this.addLinkRow();

        const addImgBtn = document.getElementById('addImgBtn');
        if (addImgBtn) addImgBtn.onclick = () => this.addImageRow();

        document.getElementById('saveBtn').onclick = () => this.save(false);

        const testBtn = document.getElementById('testSaveBtn');
        if (testBtn) testBtn.onclick = () => this.save(true);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.editor = new ProjectEditor();
});