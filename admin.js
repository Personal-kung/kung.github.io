// js/admin.js
import { db } from './firebase-config.js'; // Note the './' prefix
import { collection, getDocs } from "https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js";

// Test connection by fetching projects
async function testConnection() {
    try {
        const querySnapshot = await getDocs(collection(db, "projects"));
        console.log("Connection successful! Found documents:", querySnapshot.size);
    } catch (e) {
        console.error("Error connecting to Firebase:", e);
    }
}

testConnection();

class ProjectManager {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.projects = [];
        this.viewMode = 'stack';
        this._lang = 'all'; // Fixed reference to match init
        this.init();
    }

    tF(f) {
        const target = this._lang === 'all' ? 'en' : this._lang;
        return f && typeof f === "object" && !Array.isArray(f)
            ? (f[target] ?? Object.values(f)[0] ?? "")
            : (f ?? "");
    }

    parseDate(d) {
        if (!d) return new Date();
        return (typeof d === "string" && d.toLowerCase() === "today") ? new Date() : new Date(d);
    }

    async init() {
        try {
            // Priority: Load from cache if user has been editing, else fetch JSON
            const cached = localStorage.getItem('projects_cache');
            if (cached) {
                console.log("Loaded projects from cache");
                this.projects = JSON.parse(cached);
            } else {
                console.log("Loaded projects from JSON");
                const res = await fetch('data/testing.json');
                const data = await res.json();
                this.projects = data.projects || data;
            }
            this.setupListeners();
            this.render();
        } catch (e) { console.error("Load failed"); }
    }

    setupListeners() {
        document.getElementById('langSelect').onchange = (e) => {
            this._lang = e.target.value;
            this.render();
        };
        document.getElementById('sortSelect').onchange = (e) => this.render(e.target.value);
        document.getElementById('stackBtn').onclick = () => { this.viewMode = 'stack'; this.render(); };
        document.getElementById('gridBtn').onclick = () => { this.viewMode = 'grid'; this.render(); };

        // New Project Listener
        const newBtn = document.getElementById('newProjectBtn');
        if (newBtn) {
            newBtn.onclick = () => this.createNewProject();
        }
    }
    getProjectCount() {
        // Falls back to the class projects array or a fresh check of the cache
        const projects = this.projects.length > 0 ? this.projects : (JSON.parse(localStorage.getItem('projects_cache')) || []);
        return projects.length;
    }

    getHighlightCount() {
        const projects = this.projects.length > 0 ? this.projects : (JSON.parse(localStorage.getItem('projects_cache')) || []);

        // Extract all highlight integers and find the maximum
        // If no projects are highlighted, it returns 0
        const highlightValues = projects.map(p => parseInt(p.highlight) || 0);
        return Math.max(0, ...highlightValues);
    }

    createNewProject() {
        const nextId = this.getProjectCount(); // Calling your new function

        const highlightCount = this.getHighlightCount();
        const newProj = {
            id: nextId, // Unique ID based on current count
            visible: false,
            highlighted: false,
            title: { en: "New Project", es: "", zh: "", ja: "" },
            institution: { en: "", es: "", zh: "", ja: "" },
            category: { en: "General", es: "", zh: "", ja: "" },
            summary: { en: "", es: "", zh: "", ja: "" },
            start: "today",
            finish: "today",
            images: [],
            links: {},
            profile: ""
        };
        localStorage.setItem('edit_data', JSON.stringify(newProj));
        localStorage.setItem('edit_highlight_count', highlightCount);
        // We don't set an edit_idx so the edit page knows it's a new entry
        localStorage.removeItem('edit_idx');
        window.location.href = 'edit.html';
    }

    toggleVisibility(index, event) {
        console.log("Toggling visibility for index:", index);
        event.stopPropagation(); // Prevent card click (edit.html redirect)
        const project = this.projects.find(p => p.id === index);

        if (project) {
            // 2. Flip the visibility state
            project.visible = !project.visible;

            // 3. Trigger the internal saving mechanism
            this.saveState();

            // 4. Re-render the UI to reflect the change (maintaining current sort)
            const currentSort = document.getElementById('sortSelect').value;
            this.render(currentSort);

            console.log(`Project ${index} visibility updated to: ${project.visible}`);
        }
    }

    // Dedicated saving function to maintain data integrity
    saveState() {
        try {
            // Update the local cache
            localStorage.setItem('projects_cache', JSON.stringify(this.projects));

            // Note: In the Vercel phase, we will add a fetch call here 
            // to update the GitHub JSON file automatically.
        } catch (e) {
            console.error("Failed to save project state:", e);
        }
    }

    render(sortKey = 'date-desc') {
        if (!this.container) return;
        this.container.innerHTML = '';
        this.container.className = `project-${this.viewMode}`;

        let list = [...this.projects];
        const [field, order] = sortKey.split('-');
        const highlightCount = this.getHighlightCount();

        list.sort((a, b) => {
            let valA = field === 'date' ? this.parseDate(a.finish) : this.tF(a.title);
            let valB = field === 'date' ? this.parseDate(b.finish) : this.tF(b.title);
            if (field === 'highlight') { valA = a.highlighted; valB = b.highlighted; }
            return order === 'desc' ? (valB > valA ? 1 : -1) : (valA > valB ? 1 : -1);
        });

        list.forEach((p, i) => {
            const card = document.createElement('div');
            const catKey = (p.category && p.category.en) ? p.category.en.toLowerCase() : 'general';
            const catClass = `cat-${catKey}`;
            const visClass = p.visible ? 'is-visible' : 'is-hidden';

            card.className = `project-card ${catClass} ${visClass}`;
            card.innerHTML = `
        <div class="card-content">
            <div class="card-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
                <h3>${this.tF(p.title)} ${p.highlighted ? '⭐' : ''}</h3>
                
                <!-- Toggle Switch Control -->
                <label class="switch" onclick="event.stopPropagation()">
                    <input type="checkbox" ${p.visible ? 'checked' : ''} 
                           onchange="window.manager.toggleVisibility(${p.id}, event)">
                    <span class="slider round"></span>
                </label>
            </div>
            <p class="institution">${this.tF(p.institution)}</p>
            <div class="meta">
                <span>${this.parseDate(p.start).toLocaleDateString(this._lang === 'all' ? 'en' : this._lang)} — 
                      ${this.parseDate(p.finish).toLocaleDateString(this._lang === 'all' ? 'en' : this._lang)}</span>
                <span class="badge">${this.tF(p.category)}</span>
            </div>
        </div>
    `;

            card.onclick = () => {
                localStorage.setItem('edit_data', JSON.stringify(p));
                localStorage.setItem('edit_idx', p.id);
                localStorage.setItem('edit_lang', this._lang);
                localStorage.setItem('edit_highlight_count', highlightCount);
                window.location.href = 'edit.html';
            };
            this.container.appendChild(card);
        });
    }
}

// // Global instance to allow access from inline onclick handlers
window.manager = new ProjectManager('projectContainer');
