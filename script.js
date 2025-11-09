// Wait for the DOM to fully load
document.addEventListener("DOMContentLoaded", () => {
  // Helper function to format and compare dates (assuming dates are in 'YYYY-MM-DD' format)
  function parseDate(dateString) {
    const [month, day, year] = dateString.split('/');  // Split by '/'
    return new Date(year, month - 1, day); // month is 0-based
  }

  // Set current year in footer
  document.getElementById("year").textContent = new Date().getFullYear();

  // ----- Multi-language support -----
  const translations = {
    en: {
      name: "Kelvin Kung",
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
      "collab-title": "Professionals I've Worked With"
    },
    es: {
      name: "Kelvin Kung",
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
      "collab-title": "Profesionales con los que he colaborado"
    },
    zh: {
      name: "龚颖贤",
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
      "collab-title": "与我合作的专业人士"
    },
    ja: {
      name: "クンケルビン",
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
      "collab-title": "私が一緒に働いた専門家"
    }
  };

  const langSelect = document.getElementById("lang-select");

  function applyLanguage(lang) {
    document.querySelectorAll("[data-lang]").forEach(el => {
      const key = el.getAttribute("data-lang");      
      if (translations[lang][key]) el.innerHTML = translations[lang][key];
    });
    updateLanguageContent(lang);
  }

  langSelect.addEventListener("change", e => applyLanguage(e.target.value));
  applyLanguage(langSelect.value);

  // ===== CSV data loading =====
  function loadCSV() {
    const csvPath = "data/portfolio_data.csv";

    fetch(csvPath)
      .then(response => {
        if (!response.ok) throw new Error("CSV file not found");
        return response.text();
      })
      .then(csvText => {
        // Parse the CSV data
        const parsedData = Papa.parse(csvText, {
          header: true, // CSV headers are present
          skipEmptyLines: true // Skip empty lines
        }).data;
        // Group the data by category
        const groupedData = groupByCategory(parsedData);

        // Sort the data from the most recent to the oldest (by finish date)
        parsedData.sort((a, b) => parseDate(b.finish) - parseDate(a.finish));

        // Get the selected language
        const selectedLang = document.getElementById('lang-select').value;

        // Sort and display the 5 most recent items for each category
        displayData(groupedData, selectedLang);
      })
      .catch(err => console.error("❌ Error loading CSV:", err));
  }

  // Group data by category
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

  //Function to display data on the website
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
    const top5 = categoryData.slice(0, 5);
    top5.forEach(item => {
      // Get the description based on the selected language
      let description;
      switch (selectedLang) {
        case 'zh':
          description = item.details_zh;  // Chinese
          break;
        case 'ja':
          description = item.details_ja;  // Japanese
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
  // Call the loadCSV function to load and display the data
  // loadCSV();

  // Listen for language change and reload data
  document.getElementById('lang-select').addEventListener('change', function () {
    loadCSV();
  });

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

  // Set the initial background
  changeBackgroundImage();

  // Change the background every 4 seconds
  setInterval(() => {
    current = (current + 1) % heroImages.length;
    changeBackgroundImage();
  }, 4000);

  // ===== About me =====
  function updateLanguageContent(language) {
    const langElements = document.querySelectorAll("[data-lang]");

    // Fetch language data (you can also use a JSON file or another method to load this)
    fetch('/data/about.csv')  // Adjust the path based on your setup
      .then(response => response.text())
      .then(data => {
        const parsedData = parseCSV(data);  // You will need to implement a CSV parser if not already done

        langElements.forEach(element => {
          const key = element.getAttribute('data-lang');
          const translatedText = parsedData[key] ? parsedData[key][language] : element.textContent;

          // Use innerHTML to allow HTML tags to be rendered
          element.innerHTML = translatedText || element.innerHTML;
        });
      });
  }

  function parseCSV(csvText) {
    const rows = csvText.split("\n");
    const headers = rows[0].split(",");

    // Parse the CSV into a key-value structure
    const languageData = {};

    rows.slice(1).forEach(row => {
      const columns = row.split("|");
      const key = columns[0];

      // Map the language columns to their corresponding language
      languageData[key] = {
        en: columns[1],
        zh: columns[2],
        ja: columns[3],
        es: columns[4]
      };
    });

    return languageData;
  }

  // ===== Data loading for collaborators =====
  // Function to load collaboration data from CSV and create carousel items
  function loadCollaborationData() {
    // Fetch the CSV file containing the collaboration data
    Papa.parse('/data/collaborations.csv', {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        const collabData = results.data;

        // Get the carousel container
        const carouselContainer = document.querySelector('.collab-carousel');

        if (!carouselContainer) {
          console.error('Collaboration carousel container not found!');
          return;
        }

        // Clear any existing content in the carousel
        carouselContainer.innerHTML = '';

        // Loop through the collaboration data and create the carousel items
        collabData.forEach(item => {
          const collabItem = document.createElement('div');
          collabItem.classList.add('collab-item');

          // Create the left column (description/abstract)
          const descriptionColumn = document.createElement('div');
          descriptionColumn.classList.add('collab-description');

          // Get the description based on the current language
          const lang = document.documentElement.lang || 'en'; // Default to 'en' if no language is set
          descriptionColumn.innerHTML = `
          <h3>${item.first_name} ${item.last_name}</h3>
          <p><strong>Academic Grade:</strong> ${item.academic_grade}</p>
          <p><strong>Institution:</strong> ${item.institution}</p>
          <p><strong>Branch:</strong> ${item.branch}</p>
          <p><strong>Country:</strong> ${item.country}</p>
        `;

          // Create the right column (photo)
          const photoColumn = document.createElement('div');
          photoColumn.classList.add('collab-photo');
          photoColumn.innerHTML = `<img src="${item.image_url}" alt="${item.first_name} ${item.last_name}">`;

          // Append both columns to the collab item
          collabItem.appendChild(descriptionColumn);
          collabItem.appendChild(photoColumn);

          // Append the collab item to the carousel
          carouselContainer.appendChild(collabItem);
        });
      },
      error: function (error) {
        console.error('Error loading CSV:', error);
      }
    });
  }
  // Call the function to load collaboration data when the page is loaded
  loadCollaborationData()

  // ===== Detect the users default language =====
  function detectUserLanguage() {
    const userLang = navigator.language || navigator.userLanguage; // e.g., "en", "zh-CN", "ja", etc.

    // Convert language code to match your supported languages (e.g., "en" => "en", "zh" => "zh", etc.)
    let language = "en"; // Default to English
    if (userLang.includes("zh")) {
      language = "zh"; // Chinese
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
    loadLanguageData(language); // Function to load your CSV or translation data
    // Optionally, you can also update a language selector if needed
    document.getElementById("lang-select").value = language;
  }

  function loadLanguageData(language) {
    // Load the appropriate language file or data
    applyLanguage(language)
    loadCSV();
    updateLanguageContent(language);
    // Here, you would load and apply the translations, for example from a CSV or JSON file
    // You can also call the function that updates the text on your website accordingly
  }

  //forcing language change
  setLanguage();

  // ===== Projects carousel =====
  function loadProjectsCarousel() {
    const projectCsvUrl = '/data/projects.csv'; // Path to your CSV file
    Papa.parse(projectCsvUrl, {
      download: true,
      header: true,
      dynamicTyping: true,
      complete: function (results) {
        const projects = results.data;
        createCarouselItems(projects);
      },
      error: function (error) {
        console.error('Error loading projects CSV:', error);
      }
    });
  }

  // Create carousel items dynamically
  function createCarouselItems(projects) {
    const carouselContainer = document.getElementById('carousel-items');
    carouselContainer.innerHTML = '';  // Clear any existing content

    // Get the current language setting
    const currentLang = getCurrentLanguage(); // Assuming you have a function that detects the language (e.g., 'en', 'zh', 'ja', 'es')

    projects.forEach(project => {
      // Create the carousel item div
      const carouselItem = document.createElement('div');
      carouselItem.classList.add('carousel-item');

      // Create the project description section
      const descriptionDiv = document.createElement('div');
      descriptionDiv.classList.add('project-description');

      // Dynamically select the correct description based on the current language
      let description = '';

      switch (currentLang) {
        case 'en':
          description = project.details_eng;
          break;
        case 'zh':
          description = project.details_zh;
          break;
        case 'ja':
          description = project.details_ja;
          break;
        case 'es':
          description = project.details_es;
          break;
        default:
          description = project.details_eng; // Fallback to English if the language is unknown
      }

      // Set the inner HTML for the description
      descriptionDiv.innerHTML = `
      <h3>${project.title}</h3>
      <p>${description}</p>
    `;

      // Create the project image section
      const imageDiv = document.createElement('div');
      imageDiv.classList.add('project-image');
      imageDiv.innerHTML = `<img src="${project.image_url}" alt="${project.title}" />`;

      // Append description and image to the carousel item
      carouselItem.appendChild(descriptionDiv);
      carouselItem.appendChild(imageDiv);

      // Append the carousel item to the container
      carouselContainer.appendChild(carouselItem);
    });

    // Initialize the carousel navigation
    initializeCarousel();
  }

  // Initialize carousel navigation
  function initializeCarousel() {
    let currentIndex = 0;
    const carouselItems = document.querySelectorAll('.carousel-item');
    const totalItems = carouselItems.length;

    // Show the first item
    updateCarouselDisplay(currentIndex);

    // Attach event listeners for previous and next buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateCarouselDisplay(currentIndex);
      }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
      if (currentIndex < totalItems - 1) {
        currentIndex++;
        updateCarouselDisplay(currentIndex);
      }
    });

    function updateCarouselDisplay(index) {
      const carouselItems = document.querySelectorAll('.carousel-item');
      const carouselContainer = document.getElementById('carousel-items');

      // Update carousel container to show the correct item
      carouselContainer.style.transform = `translateX(-${index * 100}%)`;
    }
  }

  // Call the function to load the project carousel after page load
  window.onload = function () {
    loadProjectsCarousel();
  };

  // Function to detect the current language (assuming you have a method for this)
  function getCurrentLanguage() {
    // This could be done based on the user's browser language, URL path, or other factors.
    // Here’s a simple example of detecting language from the URL query parameter (e.g., ?lang=en, ?lang=zh, etc.)
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('lang') || 'en';  // Default to English if no 'lang' parameter is found
  }


});
