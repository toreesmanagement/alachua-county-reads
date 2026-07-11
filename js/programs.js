function playAudio(audioId) {
  const audio = document.getElementById(audioId);
  if (audio) audio.play();
}

function speakText(text) {
  if (window.ACRAudio && typeof window.ACRAudio.speak === 'function') {
    window.ACRAudio.speak(text, currentLanguage === 'es' ? 'es-US' : 'en-US');
    return;
  }

  if (!('speechSynthesis' in window)) {
    alert('Audio narration is not available in this browser.');
    return;
  }

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = 0.75;
  utterance.pitch = 1;
  utterance.lang = currentLanguage === 'es' ? 'es-US' : 'en-US';
  window.speechSynthesis.speak(utterance);
}

function listenCurrentPage() {
  const title = document.getElementById('pageTitle')?.textContent || 'Programs';
  const intro = document.getElementById('pageIntro')?.textContent || '';
  speakText(title + '. ' + intro + ' Use the cards and filters to find reading help. You can also use your location to see nearby programs and directions.');
}

function listenMapGuide() {
  speakText('This map area helps people see where in-person programs are located. If a person shares their location, nearby programs are shown first. Each program can open driving, public transportation, walking, or bicycling directions in Google Maps.');
}

function listenProgramSummary(program) {
  speakText(program.name + '. Located in ' + program.location + '. Cost: ' + program.cost + '. Format: ' + program.format + '. Language: ' + program.language + '. This program helps: ' + program.helps);
}

let currentLanguage = "en";

const translations = {
  en: {
    programsLabel: "Programs",
    listen: "Listen",
    findSupport: "Find literacy support",
    needHelpChoosing: "Need help choosing?",
    chooseWhatSounds: "Pick what sounds most like you. We'll suggest where to start.",
    wantEnglish: "I want to learn English",
    needReading: "I need help reading",
    helpChild: "I need help for my child",
    wantGED: "I want my GED",
    notSure: "I don't know where to start",
    nearMeTitle: "Find programs near me",
    nearMeText: "Use your location to help show nearby in-person programs first.",
    useLocation: "Use My Location",
    whatNeed: "What do you need help with?",
    quickChoose: "Choose one to quickly find matching programs.",
    allPrograms: "All Programs",
    learnEnglish: "Learn English",
    helpReading: "Help Reading",
    freePrograms: "Free Programs",
    onlineHelp: "Online Help",
    gedHelp: "GED Help",
    transportation: "Transportation",
    all: "All",
    free: "Free",
    inPerson: "In-Person",
    virtual: "Virtual",
    english: "English",
    spanish: "Spanish",
    tapDetails: "Tap card for details",
    supportAvailable: "Support Available",
    location: "Location",
    cost: "Cost",
    format: "Format",
    language: "Language",
    available: "Available",
    directions: "Directions",
    whoHelps: "Who this helps",
    howStart: "How to start",
    call: "Call",
    website: "Website",
    nearbyFirst: "Nearby programs are now shown first.",
    findingNearby: "Finding nearby programs...",
    locationOff: "Location was not turned on. You can still use maps and filters.",
    noLocation: "Your browser does not support location. You can still use the program list.",
    noPrograms: "No programs found",
    tryAnother: "Try another filter or go back to all programs.",
    communityResources: "Community Resources",
    communityIntro: "These are helpful coordination, hotline, and referral resources. They are not direct tutoring programs."
  },

  es: {
    programsLabel: "Programas",
    listen: "Escuchar",
    findSupport: "Encuentre apoyo de lectura",
    needHelpChoosing: "Necesita ayuda para escoger?",
    chooseWhatSounds: "Elija lo que mas se parece a su situacion. Le sugerimos por donde empezar.",
    wantEnglish: "Quiero aprender ingles",
    needReading: "Necesito ayuda para leer",
    helpChild: "Necesito ayuda para mi hijo",
    wantGED: "Quiero mi GED",
    notSure: "No se por donde empezar",
    nearMeTitle: "Buscar programas cerca de mi",
    nearMeText: "Use su ubicacion para mostrar primero programas cercanos en persona.",
    useLocation: "Usar mi ubicacion",
    whatNeed: "Con que necesita ayuda?",
    quickChoose: "Elija una opcion para encontrar programas.",
    allPrograms: "Todos los programas",
    learnEnglish: "Aprender ingles",
    helpReading: "Ayuda para leer",
    freePrograms: "Programas gratis",
    onlineHelp: "Ayuda en linea",
    gedHelp: "Ayuda con GED",
    transportation: "Transporte",
    all: "Todos",
    free: "Gratis",
    inPerson: "En persona",
    virtual: "Virtual",
    english: "Ingles",
    spanish: "Espanol",
    tapDetails: "Toque la tarjeta para ver detalles",
    supportAvailable: "Apoyo disponible",
    location: "Lugar",
    cost: "Costo",
    format: "Tipo",
    language: "Idioma",
    available: "Disponible",
    directions: "Direcciones",
    whoHelps: "A quien ayuda",
    howStart: "Como empezar",
    call: "Llamar",
    website: "Sitio web",
    nearbyFirst: "Los programas cercanos ahora aparecen primero.",
    findingNearby: "Buscando programas cercanos...",
    locationOff: "La ubicacion no esta activada. Todavia puede usar mapas y filtros.",
    noLocation: "Su navegador no permite ubicacion. Todavia puede usar la lista.",
    noPrograms: "No se encontraron programas",
    tryAnother: "Pruebe otro filtro o regrese a todos los programas.",
    communityResources: "Recursos comunitarios",
    communityIntro: "Estos recursos ayudan con coordinacion, llamadas y referidos. No son programas directos de tutoria."
  }
};



const spanishValueMap = {
  "Free": "Gratis", "Low Cost": "Bajo costo", "Sliding Scale": "Escala variable", "Insurance Accepted": "Se acepta seguro", "Income-Based Eligibility": "Elegibilidad según ingresos",
  "In-Person": "En persona", "Virtual": "Virtual", "Hybrid": "Híbrido", "Either": "En persona o virtual", "Home / Mail": "En casa / Por correo", "Home / Virtual": "En casa / Virtual",
  "English": "Inglés", "Spanish": "Español", "English / Spanish": "Inglés / Español", "Multiple Languages": "Varios idiomas", "Online": "En línea",
  "Early Literacy": "Alfabetización temprana", "Mentorship": "Mentoría", "Free Books": "Libros gratis", "Reading Support": "Apoyo de lectura", "Books at Home": "Libros en casa",
  "Adult Literacy": "Alfabetización para adultos", "English Learners": "Estudiantes de inglés", "Conversation Practice": "Práctica de conversación", "GED Prep": "Preparación para el GED",
  "Adult Education": "Educación para adultos", "Digital Books": "Libros digitales", "Multilingual": "Multilingüe", "Spanish Available": "Español disponible", "Transportation": "Transporte",
  "ADA Accessible": "Accesible según ADA", "Dyslexia Support": "Apoyo para dislexia", "ADHD Support": "Apoyo para TDAH", "Autism Support": "Apoyo para autismo",
  "Family Support": "Apoyo familiar", "Home Visiting": "Visitas al hogar", "Tutoring": "Tutoría", "After-School": "Después de clases", "Homework Help": "Ayuda con tareas",
  "Academic Support": "Apoyo académico", "Summer": "Verano", "Rural Support": "Apoyo rural", "Literacy Enrichment": "Enriquecimiento de lectura", "School Referral": "Referencia escolar",
  "Digital Skills": "Habilidades digitales", "Citizenship": "Ciudadanía", "Nutrition": "Nutrición", "Research Study": "Estudio de investigación"
};
const spanishPhraseMap = {
  "Young children building early reading skills.": "Niños pequeños que están desarrollando habilidades iniciales de lectura.",
  "Children from birth to age five who need books at home.": "Niños desde el nacimiento hasta los cinco años que necesitan libros en casa.",
  "Florida students who need extra reading practice.": "Estudiantes de Florida que necesitan práctica adicional de lectura.",
  "Adults who want help with reading, English, or basic learning skills.": "Adultos que desean ayuda con lectura, inglés o habilidades básicas de aprendizaje.",
  "Adults learning English who want conversation practice.": "Adultos que aprenden inglés y desean practicar conversación.",
  "Teens and adults preparing for the GED.": "Jóvenes y adultos que se preparan para el GED.",
  "Children and families who want free digital books.": "Niños y familias que desean libros digitales gratis.",
  "Contact the program to ask about enrollment and availability.": "Comuníquese con el programa para preguntar sobre inscripción y disponibilidad.",
  "Visit the program website or call to check eligibility.": "Visite el sitio web del programa o llame para confirmar la elegibilidad.",
  "Visit the website to learn if the student qualifies.": "Visite el sitio web para saber si el estudiante califica.",
  "Call or visit the library to ask about adult literacy services.": "Llame o visite la biblioteca para preguntar por servicios de alfabetización para adultos.",
  "Call or visit the library to ask when the group meets.": "Llame o visite la biblioteca para preguntar cuándo se reúne el grupo.",
  "Contact the provider to ask about schedules and requirements.": "Comuníquese con el proveedor para preguntar por horarios y requisitos.",
  "Visit the website to start reading online.": "Visite el sitio web para comenzar a leer en línea."
};
function localizeValue(value) {
  if (currentLanguage !== "es" || value === null || value === undefined) return value;
  return spanishPhraseMap[value] || spanishValueMap[value] || value;
}
function localizeSupportList(items) { return items.map(localizeValue); }

const supportIcons = {
  "Early Literacy": "menu_book",
  "Mentorship": "volunteer_activism",
  "Free Books": "auto_stories",
  "Reading Support": "chrome_reader_mode",
  "Books at Home": "home",
  "Adult Literacy": "person_book",
  "ESL": "language",
  "English Learners": "translate",
  "Conversation Practice": "forum",
  "GED Prep": "school",
  "Adult Education": "workspace_premium",
  "Digital Books": "computer",
  "Multilingual": "public",
  "Spanish Available": "translate",
  "Transportation": "directions_bus",
  "ADA Accessible": "accessible",
  "Dyslexia Support": "psychology",
  "ADHD Support": "bolt",
  "Autism Support": "diversity_1",
  "VPK": "child_care",
  "School Readiness": "child_care",
  "Family Support": "family_restroom",
  "Head Start": "child_care",
  "Home Visiting": "home",
  "Tutoring": "school",
  "After-School": "schedule",
  "Homework Help": "edit_note",
  "Academic Support": "school",
  "Summer": "sunny",
  "Rural Support": "location_on",
  "Literacy Enrichment": "auto_stories",
  "School Referral": "assignment_ind",
  "Culturally Responsive": "diversity_3",
  "Digital Skills": "computer",
  "Citizenship": "flag",
  "Nutrition": "restaurant",
  "Research Study": "science"
};

/* Program and community resource data moved to data/program-data.js */

let currentPrograms = [];
let userLocation = null;
let selectedMapProgram = null;
/* Local approval workflow: approved submissions are stored in browser localStorage for the current front-end version. */
function getApprovedPrograms() {
  try {
    return JSON.parse(localStorage.getItem("acrApprovedPrograms") || "[]");
  } catch (error) {
    return [];
  }
}

function getProgramCatalog() {
  return [...programs, ...getApprovedPrograms()];
}



function t(key) {
  return translations[currentLanguage][key] || translations.en[key] || key;
}

function setLanguage(lang, button) {
  currentLanguage = lang;
  document.documentElement.lang = lang;
  try { localStorage.setItem("acrLanguage", lang); } catch (e) {}

  document.querySelectorAll(".language-toggle").forEach(btn => {
    btn.classList.remove("active-lang");
  });

  if (button) button.classList.add("active-lang");

  document.querySelectorAll("[data-i18n]").forEach(element => {
    const key = element.getAttribute("data-i18n");
    element.textContent = t(key);
  });

  loadProgramsPage();
}


function getDirectionsUrl(address) {
  return getTravelUrl(address, 'driving');
}

function getTravelUrl(address, mode) {
  if (!address) return '#';

  const params = new URLSearchParams();
  params.set('api', '1');
  params.set('destination', address);
  params.set('travelmode', mode);

  if (userLocation) {
    params.set('origin', userLocation.latitude + ',' + userLocation.longitude);
  }

  return 'https://www.google.com/maps/dir/?' + params.toString();
}

function getMapPreviewUrl(address) {
  if (!address) return 'https://www.google.com/maps?q=Gainesville%2C%20FL&output=embed';
  return 'https://www.google.com/maps?q=' + encodeURIComponent(address) + '&z=14&output=embed';
}

function previewProgramMap(program) {
  const frame = document.getElementById('mapPreviewFrame');
  if (!frame || !program || !program.address) return;

  selectedMapProgram = program;
  frame.src = getMapPreviewUrl(program.address);

  const note = document.getElementById('mapPreviewNote');
  if (note) {
    note.textContent = 'Map preview for ' + program.name;
  }

  const selected = document.getElementById('selectedMapProgram');
  if (selected) {
    const distance = program.distance !== null && program.distance !== undefined
      ? '<span class="selected-distance">' + program.distance.toFixed(1) + ' miles away</span>'
      : '<span class="selected-distance">Use My Location to estimate distance</span>';

    selected.innerHTML = `
      <span class="material-symbols-rounded">location_on</span>
      <div>
        <strong>${program.name}</strong>
        <p>${program.address}</p>
        ${distance}
      </div>
    `;
  }
}

function openSelectedRoute(mode) {
  if (!selectedMapProgram || !selectedMapProgram.address) {
    showLocationMessage('Select a program card first to open route options.');
    return;
  }

  window.open(getTravelUrl(selectedMapProgram.address, mode), '_blank');
}

function selectFirstMappableProgram() {
  const first = currentPrograms.find(program => program.address);
  if (first) previewProgramMap(first);
}

function isInPerson(program) {
  return program.format.toLowerCase().includes("in-person") || program.format.toLowerCase().includes("home visits");
}

function formatIcon(format) {
  const f = format.toLowerCase();
  if (f.includes("virtual") || f.includes("online") || f.includes("zoom")) return "computer";
  if (f.includes("mail")) return "local_shipping";
  if (f.includes("phone")) return "call";
  if (f.includes("home")) return "home";
  return "school";
}

function getSupportIcon(label) {
  return supportIcons[label] || "check_circle";
}

function getAgeFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get("age");
}

function getAgeLabel(age) {
  const labels = {
    en: {
      "0-5": "Programs for Ages 0-5",
      "5-8": "Programs for Ages 5-8",
      "8-11": "Programs for Ages 8-11",
      "11-14": "Programs for Ages 11-14",
      "14-18": "Programs for Ages 14-18",
      adult: "Programs for Adults 18+",
      all: "All Literacy Programs"
    },
    es: {
      "0-5": "Programas para edades 0-5",
      "5-8": "Programas para edades 5-8",
      "8-11": "Programas para edades 8-11",
      "11-14": "Programas para edades 11-14",
      "14-18": "Programas para edades 14-18",
      adult: "Programas para adultos 18+",
      all: "Todos los programas de lectura"
    }
  };

  return labels[currentLanguage][age] || labels[currentLanguage].all;
}

function getAgeIntro(age) {
  const intros = {
    en: {
      "0-5": "Reading support, free books, and early learning programs.",
      "5-8": "Programs for children learning to read.",
      "8-11": "Reading support for upper elementary students.",
      "11-14": "Literacy support for middle school students.",
      "14-18": "Reading, school, GED, and teen learning support.",
      adult: "Adult reading, English learning, GED, and digital literacy programs.",
      all: "Browse literacy programs and services in Alachua County."
    },
    es: {
      "0-5": "Apoyo de lectura, libros gratis y programas de aprendizaje temprano.",
      "5-8": "Programas para ninos que estan aprendiendo a leer.",
      "8-11": "Apoyo de lectura para estudiantes de primaria.",
      "11-14": "Apoyo de lectura para estudiantes de escuela intermedia.",
      "14-18": "Lectura, escuela, GED y apoyo para adolescentes.",
      adult: "Lectura para adultos, ingles, GED y habilidades digitales.",
      all: "Explore programas de lectura en el condado de Alachua."
    }
  };

  return intros[currentLanguage][age] || intros[currentLanguage].all;
}

function calculateDistanceMiles(lat1, lon1, lat2, lon2) {
  const earthRadius = 3958.8;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
    Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function addDistances(programList) {
  if (!userLocation) return programList;

  return programList.map(program => {
    if (program.latitude && program.longitude) {
      const distance = calculateDistanceMiles(
        userLocation.latitude,
        userLocation.longitude,
        program.latitude,
        program.longitude
      );

      return { ...program, distance };
    }

    return { ...program, distance: null };
  });
}

function sortNearbyFirst(programList) {
  return [...programList].sort((a, b) => {
    if (a.distance === null && b.distance === null) return 0;
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });
}

function useMyLocation() {
  if (!navigator.geolocation) {
    showLocationMessage(t("noLocation"));
    return;
  }

  showLocationMessage(t("findingNearby"));

  navigator.geolocation.getCurrentPosition(
    position => {
      userLocation = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      };

      currentPrograms = sortNearbyFirst(addDistances(currentPrograms));
      renderPrograms(currentPrograms);

      showLocationMessage(t("nearbyFirst"));
    },
    () => {
      showLocationMessage(t("locationOff"));
    }
  );
}

function showLocationMessage(text) {
  const message = document.getElementById("locationMessage");
  if (!message) return;

  message.textContent = text;
  message.classList.remove("hidden");
}

function loadProgramsPage() {
  const results = document.getElementById("programResults");
  if (!results) return;

  const age = getAgeFromURL();

  const title = document.getElementById("pageTitle");
  const intro = document.getElementById("pageIntro");

  if (title) title.textContent = getAgeLabel(age);
  if (intro) intro.textContent = getAgeIntro(age);

  const catalog = getProgramCatalog();

  currentPrograms = age
    ? catalog.filter(program => program.ageGroups.includes(age))
    : catalog;

  if (userLocation) {
    currentPrograms = sortNearbyFirst(addDistances(currentPrograms));
  }

  renderPrograms(currentPrograms);
  renderCommunityResources();
  selectFirstMappableProgram();
}


function findProgramByEncodedName(encodedName) {
  const name = decodeURIComponent(encodedName);
  return currentPrograms.find(program => program.name === name) || getProgramCatalog().find(program => program.name === name);
}

function openModalByName(encodedName) {
  const program = findProgramByEncodedName(encodedName);
  if (program) openModal(program);
}

function listenProgramByName(encodedName) {
  const program = findProgramByEncodedName(encodedName);
  if (program) listenProgramSummary(program);
}

function renderSupportBadges(program) {
  return program.support.map(item => `
    <span class="support-badge">
      <span class="material-symbols-rounded">${getSupportIcon(item)}</span>
      ${localizeValue(item)}
    </span>
  `).join("");
}

function getVerificationLabel(program) {
  return "Verified Resource";
}

function renderVerificationBadge(program) {
  return `
    <div class="verification-pill verified-source" title="Information verified by Alachua County Reads">
      <span class="material-symbols-rounded">verified</span>
      <span>Verified Resource</span>
      <small>Information verified by Alachua County Reads</small>
    </div>
  `;
}

function getSearchableText(program) {
  return [
    program.name,
    program.location,
    program.address,
    program.cost,
    program.format,
    program.language,
    program.helps,
    program.start,
    program.tags?.join(" "),
    program.support?.join(" ")
  ].filter(Boolean).join(" ").toLowerCase();
}

function searchPrograms(query) {
  const normalized = (query || "").trim().toLowerCase();

  document.querySelectorAll(".filter-chip").forEach(btn => btn.classList.remove("active"));
  document.querySelectorAll(".quick-help-card").forEach(card => card.classList.remove("active-help"));

  if (!normalized) {
    renderPrograms(currentPrograms);
    return;
  }

  const filtered = currentPrograms.filter(program => getSearchableText(program).includes(normalized));
  renderPrograms(filtered);
}

function clearProgramSearch() {
  const input = document.getElementById("programSearchInput");
  if (input) input.value = "";
  renderPrograms(currentPrograms);
}

function renderDistance(program) {
  if (program.distance === null || program.distance === undefined) return "";

  return `
    <div class="distance-pill">
      <span class="material-symbols-rounded">near_me</span>
      ${program.distance.toFixed(1)} miles away
    </div>
  `;
}

function renderPrograms(list) {
  const results = document.getElementById("programResults");
  if (!results) return;

  results.innerHTML = "";

  if (list.length === 0) {
    results.innerHTML = `
      <div class="empty-state">
        <h2>${t("noPrograms")}</h2>
        <p>${t("tryAnother")}</p>
      </div>
    `;
    return;
  }

  list.forEach(program => {
    const encodedName = encodeURIComponent(program.name);
    const mapButton = program.address
      ? `<div class="card-direction-row">
          <button class="mini-map-button map-preview-button" onclick='event.stopPropagation(); previewProgramMapByName("${encodedName}")'>
            <span class="material-symbols-rounded">map</span>
            Map
          </button>
          <a class="mini-map-button" href="${getTravelUrl(program.address, 'driving')}" target="_blank" onclick="event.stopPropagation();">
            <span class="material-symbols-rounded">directions_car</span>
            Drive
          </a>
          <a class="mini-map-button" href="${getTravelUrl(program.address, 'transit')}" target="_blank" onclick="event.stopPropagation();">
            <span class="material-symbols-rounded">directions_bus</span>
            Bus
          </a>
          <a class="mini-map-button optional-walk-link" href="${getTravelUrl(program.address, 'walking')}" target="_blank" onclick="event.stopPropagation();">
            <span class="material-symbols-rounded">directions_walk</span>
            Walk
          </a>
          <a class="mini-map-button optional-bike-link" href="${getTravelUrl(program.address, 'bicycling')}" target="_blank" onclick="event.stopPropagation();">
            <span class="material-symbols-rounded">directions_bike</span>
            Bike
          </a>
        </div>`
      : "";

    const listenButton = `<button class="card-listen-button" onclick='event.stopPropagation(); listenProgramByName("${encodedName}")'>
      <span class="material-symbols-rounded">volume_up</span>
      Listen about this program
    </button>`;

    results.innerHTML += `
      <article class="program-card stat-program-card" onclick='openModalByName("${encodedName}")' onmouseenter='previewProgramMapByName("${encodedName}")' onfocusin='previewProgramMapByName("${encodedName}")'>

        <div class="stat-card-image">
          <img src="${program.image}" alt="${program.name}" onerror="this.style.display='none'; this.parentElement.classList.add('image-missing');" />
        </div>

        <div class="program-body">
          <div class="program-card-top">
            <h3>${program.name}</h3>
            <span class="program-status">${t("available")}</span>
          </div>

          ${renderVerificationBadge(program)}
          ${renderDistance(program)}

          <div class="stat-grid">
            <div class="stat-badge">
              <span class="material-symbols-rounded">location_on</span>
              <div>
                <small>${t("location")}</small>
                <strong>${localizeValue(program.location)}</strong>
              </div>
            </div>

            <div class="stat-badge">
              <span class="material-symbols-rounded">paid</span>
              <div>
                <small>${t("cost")}</small>
                <strong>${localizeValue(program.cost)}</strong>
              </div>
            </div>

            <div class="stat-badge">
              <span class="material-symbols-rounded">${formatIcon(program.format)}</span>
              <div>
                <small>${t("format")}</small>
                <strong>${localizeValue(program.format)}</strong>
              </div>
            </div>

            <div class="stat-badge">
              <span class="material-symbols-rounded">language</span>
              <div>
                <small>${t("language")}</small>
                <strong>${localizeValue(program.language)}</strong>
              </div>
            </div>
          </div>

          <div class="support-section">
            <small>${t("supportAvailable")}</small>
            <div class="support-badge-row">
              ${renderSupportBadges(program)}
            </div>
          </div>

          <div class="card-action-row">
            <span>${t("tapDetails")}</span>
            <span class="material-symbols-rounded">arrow_forward</span>
          </div>

          ${listenButton}
          ${mapButton}

        </div>

      </article>
    `;
  });
}

function renderCommunityResources() {
  const grid = document.getElementById("communityResourcesGrid");
  if (!grid) return;

  grid.innerHTML = "";

  communityResources.forEach(resource => {
    const mapButton = resource.address
      ? `<a href="${getDirectionsUrl(resource.address)}" target="_blank"><span class="material-symbols-rounded">map</span> Directions</a>`
      : "";

    grid.innerHTML += `
      <article class="community-card">
        <img src="${resource.image}" alt="${resource.name}" />

        <div class="community-card-body">
          <h3>${resource.name}</h3>
          <p>${resource.description}</p>

          <div class="community-meta">
            <span><span class="material-symbols-rounded">location_on</span>${resource.location}</span>
            <span><span class="material-symbols-rounded">paid</span>${resource.cost}</span>
            <span><span class="material-symbols-rounded">${formatIcon(resource.format)}</span>${resource.format}</span>
          </div>

          <div class="community-actions">
            <a href="${resource.website}" target="_blank">
              <span class="material-symbols-rounded">open_in_new</span>
              Website
            </a>
            ${mapButton}
          </div>
        </div>
      </article>
    `;
  });
}

function quickFilter(type, button) {
  document.querySelectorAll(".quick-help-card").forEach(card => {
    card.classList.remove("active-help");
  });

  if (button) button.classList.add("active-help");

  if (type === "all") {
    renderPrograms(currentPrograms);
    return;
  }

  const filtered = currentPrograms.filter(program => program.tags.includes(type));
  renderPrograms(filtered);
}

function filterBy(type, button) {
  document.querySelectorAll(".filter-chip").forEach(btn => {
    btn.classList.remove("active");
  });

  if (button) button.classList.add("active");

  if (type === "all") {
    renderPrograms(currentPrograms);
    return;
  }

  const filtered = currentPrograms.filter(program => program.tags.includes(type));
  renderPrograms(filtered);
}

function openModal(program) {
  const modal = document.getElementById("programModal");
  const body = document.getElementById("modalBody");

  if (!modal || !body) return;

  const encodedName = encodeURIComponent(program.name);

  const mapLink = program.address
    ? `<a class="modal-action map-action" href="${getTravelUrl(program.address, 'driving')}" target="_blank">
        <span class="material-symbols-rounded">directions_car</span>
        Drive
      </a>
      <a class="modal-action map-action" href="${getTravelUrl(program.address, 'transit')}" target="_blank">
        <span class="material-symbols-rounded">directions_bus</span>
        Bus / Transit
      </a>
      <a class="modal-action map-action" href="${getTravelUrl(program.address, 'walking')}" target="_blank">
        <span class="material-symbols-rounded">directions_walk</span>
        Walk
      </a>
      <a class="modal-action map-action" href="${getTravelUrl(program.address, 'bicycling')}" target="_blank">
        <span class="material-symbols-rounded">directions_bike</span>
        Bike
      </a>`
    : "";

  const distanceText =
    program.distance !== null && program.distance !== undefined
      ? `<div class="distance-pill modal-distance">
          <span class="material-symbols-rounded">near_me</span>
          ${program.distance.toFixed(1)} miles away
        </div>`
      : "";

  body.innerHTML = `
    <div class="modal-profile">

      <div class="modal-profile-image">
        <img src="${program.image}" alt="${program.name}" onerror="this.style.display='none'; this.parentElement.classList.add('image-missing');" />
      </div>

      <div class="modal-profile-content">
        <span class="program-status modal-status">${t("available")}</span>
        ${renderVerificationBadge(program)}
        <h2>${program.name}</h2>

        ${distanceText}

        <div class="modal-stat-grid">
          <div>
            <span class="material-symbols-rounded">location_on</span>
            <strong>${localizeValue(program.location)}</strong>
            <small>${t("location")}</small>
          </div>

          <div>
            <span class="material-symbols-rounded">paid</span>
            <strong>${localizeValue(program.cost)}</strong>
            <small>${t("cost")}</small>
          </div>

          <div>
            <span class="material-symbols-rounded">${formatIcon(program.format)}</span>
            <strong>${localizeValue(program.format)}</strong>
            <small>${t("format")}</small>
          </div>

          <div>
            <span class="material-symbols-rounded">language</span>
            <strong>${localizeValue(program.language)}</strong>
            <small>${t("language")}</small>
          </div>
        </div>

        ${program.address ? `
          <div class="modal-address">
            <span class="material-symbols-rounded">pin_drop</span>
            <span>${program.address}</span>
          </div>
        ` : ""}

        <div class="modal-section-block">
          <h4>${t("whoHelps")}</h4>
          <p>${localizeValue(program.helps)}</p>
        </div>

        <div class="modal-section-block">
          <h4>${t("howStart")}</h4>
          <p>${localizeValue(program.start)}</p>
        </div>

        <div class="modal-section-block">
          <h4>${t("supportAvailable")}</h4>
          <div class="support-badge-row modal-support">
            ${renderSupportBadges(program)}
          </div>
        </div>

        <div class="modal-actions">
          <button class="modal-action call-action" onclick='listenProgramByName("${encodedName}")'>
            <span class="material-symbols-rounded">volume_up</span>
            Listen
          </button>

          <button class="modal-action call-action" onclick="alert('${t("call")}: ${program.phone || t("website")}')">
            <span class="material-symbols-rounded">call</span>
            ${t("call")}
          </button>

          <a class="modal-action website-action" href="${program.website}" target="_blank">
            <span class="material-symbols-rounded">open_in_new</span>
            ${t("website")}
          </a>

          ${mapLink}
        </div>

      </div>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeModal() {
  const modal = document.getElementById("programModal");
  if (modal) modal.classList.add("hidden");
}

function getRecommendationData(type) {
  const data = {
    english: {
      title: currentLanguage === "es" ? "Empiece con apoyo en ingles" : "Start with English support",
      intro: currentLanguage === "es" ? "These programs help with English, conversation, and reading." : "These programs can help with English practice, conversation, and reading.",
      tags: ["english", "spanish"],
      icon: "translate"
    },
    reading: {
      title: currentLanguage === "es" ? "Empiece con ayuda para leer" : "Start with reading help",
      intro: currentLanguage === "es" ? "Estos programas ayudan con practica de lectura, libros y apoyo." : "These programs focus on reading practice, books, and literacy support.",
      tags: ["reading"],
      icon: "menu_book"
    },
    child: {
      title: currentLanguage === "es" ? "Empiece con programas para ninos" : "Start with child literacy programs",
      intro: currentLanguage === "es" ? "Estos programas son buenos para ninos y familias." : "These programs are good starting points for children and families.",
      tags: ["child"],
      icon: "family_restroom"
    },
    ged: {
      title: currentLanguage === "es" ? "Empiece con apoyo para GED" : "Start with GED support",
      intro: currentLanguage === "es" ? "Estos programas ayudan a jovenes y adultos a prepararse para el GED." : "These programs can help teens and adults prepare for the GED.",
      tags: ["ged"],
      icon: "school"
    },
    unsure: {
      title: currentLanguage === "es" ? "Buenos lugares para empezar" : "Good places to start",
      intro: currentLanguage === "es" ? "Si no sabe que necesita, estos programas son buenos primeros pasos." : "Not sure what you need? These programs are helpful first steps.",
      tags: ["reading", "free"],
      icon: "help"
    }
  };

  return data[type] || data.unsure;
}

function openRecommendation(type) {
  const modal = document.getElementById("recommendationModal");
  const body = document.getElementById("recommendationBody");

  if (!modal || !body) return;

  const rec = getRecommendationData(type);

  let matches = currentPrograms.filter(program =>
    rec.tags.some(tag => program.tags.includes(tag))
  );

  if (matches.length === 0) {
    matches = currentPrograms.slice(0, 3);
  }

  const detailsText = currentLanguage === "es" ? "Detalles" : "Details";
  const keepBrowsingText = currentLanguage === "es" ? "Seguir viendo" : "Keep Browsing";
  const seeProgramsText = currentLanguage === "es" ? "Ver programas abajo" : "See Programs Below";

  const recommendedCards = matches.slice(0, 3).map(program => {
    const encodedName = encodeURIComponent(program.name);
    return `
    <div class="recommendation-program">
      <div class="recommendation-program-icon">
        <span class="material-symbols-rounded">${formatIcon(program.format)}</span>
      </div>

      <div>
        <strong>${program.name}</strong>
        <p>${localizeValue(program.helps)}</p>
      </div>

      <button onclick='closeRecommendation(); openModalByName("${encodedName}")'>
        ${detailsText}
      </button>
    </div>
  `;
  }).join("");

  body.innerHTML = `
    <div class="recommendation-header">
      <div class="recommendation-icon">
        <span class="material-symbols-rounded">${rec.icon}</span>
      </div>

      <div>
        <h2>${rec.title}</h2>
        <p>${rec.intro}</p>
      </div>
    </div>

    <div class="recommendation-list">
      ${recommendedCards}
    </div>

    <div class="recommendation-actions">
      <button onclick="closeRecommendation()">${keepBrowsingText}</button>
      <button class="primary-rec-action" onclick="closeRecommendation()">${seeProgramsText}</button>
    </div>
  `;

  modal.classList.remove("hidden");
}

function closeRecommendation() {
  const modal = document.getElementById("recommendationModal");
  if (modal) modal.classList.add("hidden");
}

function toggleAssistant() {
  const panel = document.getElementById("assistantPanel");
  if (!panel) return;

  panel.classList.toggle("hidden");
}

function assistantChoose(type) {
  const panel = document.getElementById("assistantPanel");
  if (panel) panel.classList.add("hidden");

  if (type === "talk") {
    openTalkToSomeone();
    return;
  }

  if (type === "free") {
    renderPrograms(currentPrograms.filter(program => program.tags.includes("free")));
    return;
  }

  openRecommendation(type);
}

function openTalkToSomeone() {
  const modal = document.getElementById("recommendationModal");
  const body = document.getElementById("recommendationBody");

  if (!modal || !body) return;

  const title = currentLanguage === "es" ? "Hablar con alguien" : "Talk to someone";
  const intro = currentLanguage === "es"
    ? "Si necesita ayuda ahora, puede llamar a un programa o usar el boton de ayuda externa."
    : "If you need help now, you can call a program or use the outside help button.";

  const callText = currentLanguage === "es" ? "Llamar biblioteca" : "Call Library";
  const browseText = currentLanguage === "es" ? "Ver programas" : "See Programs";

  body.innerHTML = `
    <div class="recommendation-header">
      <div class="recommendation-icon">
        <span class="material-symbols-rounded">call</span>
      </div>

      <div>
        <h2>${title}</h2>
        <p>${intro}</p>
      </div>
    </div>

    <div class="recommendation-actions">
      <button onclick="alert('Call: (352) 334-3920')">${callText}</button>
      <button class="primary-rec-action" onclick="closeRecommendation()">${browseText}</button>
    </div>
  `;

  modal.classList.remove("hidden");
}

loadProgramsPage();

/* RC1.4 — Public API for ACR Guide */
function filterProgramsForGuide(intent) {
  let filtered = currentPrograms;

  switch (intent) {
    case 'reading':
      filtered = currentPrograms.filter(program => program.tags?.includes('reading') || getSearchableText(program).includes('reading') || getSearchableText(program).includes('literacy'));
      break;
    case 'child':
      filtered = currentPrograms.filter(program => program.tags?.includes('child') || program.ageGroups?.some(age => age !== 'adult'));
      break;
    case 'english':
      filtered = currentPrograms.filter(program => program.tags?.includes('english') || program.tags?.includes('spanish') || getSearchableText(program).includes('esol') || getSearchableText(program).includes('english learner'));
      break;
    case 'spanish':
      filtered = currentPrograms.filter(program => program.tags?.includes('spanish') || getSearchableText(program).includes('spanish') || getSearchableText(program).includes('espanol'));
      break;
    case 'ged':
      filtered = currentPrograms.filter(program => program.tags?.includes('ged') || getSearchableText(program).includes('ged'));
      break;
    case 'free':
      filtered = currentPrograms.filter(program => (program.cost || '').toLowerCase().includes('free') || program.tags?.includes('free'));
      break;
    case 'unsure':
      filtered = currentPrograms.filter(program => program.tags?.includes('reading') || program.tags?.includes('free') || (program.cost || '').toLowerCase().includes('free'));
      break;
    case 'all':
    default:
      filtered = currentPrograms;
      break;
  }

  renderPrograms(filtered);
  return filtered;
}

window.ACRProgramsAPI = {
  filterByGuide: filterProgramsForGuide,
  useMyLocation: useMyLocation,
  openByName: openModalByName,
  listenByName: listenProgramByName,
  showAll: function () { renderPrograms(currentPrograms); return currentPrograms; },
  getCurrentPrograms: function () { return currentPrograms; }
};
