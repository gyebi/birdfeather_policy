const  GEO_API_URL = "https://geocoding-api.open-meteo.com/v1/search";

const FORECAST_API_URL = "https://api.open-meteo.com/v1/forecast";
//crop rules 

const cropRules = {
  maize: {
    minRain: 40,        // mm in next 10 days
    minRainyDays: 3,
    maxDrySpell: 4
  },
  rice: {
    minRain: 60,
    minRainyDays: 5,
    maxDrySpell: 2
  },
  cassava: {
    minRain: 25,
    minRainyDays: 2,
    maxDrySpell: 5
  }
};


// ===== Screen elements =====
const screenInput = document.getElementById("screen-input");
const screenOverview = document.getElementById("screen-overview");
const screenRecommendation = document.getElementById("screen-recommendation");

const rainTotalEl = document.getElementById("rainTotal");
const rainyDaysEl = document.getElementById("rainyDays");
const maxDrySpellEl = document.getElementById("maxDrySpell");

const decisionCard = document.getElementById("decisionCard");
const decisionTitle = document.getElementById("decisionTitle");
const decisionReason = document.getElementById("decisionReason");

const expTotalRain = document.getElementById("expTotalRain");
const expRainyDays = document.getElementById("expRainyDays");
const expDrySpell = document.getElementById("expDrySpell");


// ===== Buttons =====
const checkBtn = document.getElementById("checkBtn");
const backBtn = document.getElementById("backBtn");
const toRecommendationBtn = document.getElementById("toRecommendationBtn");
const backToOverviewBtn = document.getElementById("backToOverviewBtn");
const restartBtn = document.getElementById("restartBtn");

// ===== Helper: show only one screen =====
function showScreen(screenToShow) {
  screenInput.classList.add("hidden");
  screenOverview.classList.add("hidden");
  screenRecommendation.classList.add("hidden");

  screenToShow.classList.remove("hidden");
}


function isValidLocation(text) {
  return /^[a-zA-Z\s]+$/.test(text);
}

async function getCoordinates(city) {
  try {
    const response = await fetch(
      `${GEO_API_URL}?name=${encodeURIComponent(city)}&count=1`
    );

    if (!response.ok) {
      throw new Error("Geocoding request failed");
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      throw new Error("Location not found");
    }

    const location = data.results[0];

    return {
      latitude: location.latitude,
      longitude: location.longitude,
      name: location.name,
      country: location.country
    };

  } catch (error) {
    throw error;
  }
}


function drawRainChart(rainArray) {
  const chartArea = document.getElementById("chartArea");
  chartArea.innerHTML = ""; // clear old bars

  const maxRain = Math.max(...rainArray, 5); // avoid division by zero

  rainArray.forEach(mm => {
    const bar = document.createElement("div");
    bar.classList.add("rain-bar");

    const heightPercent = (mm / maxRain) * 100;
    bar.style.height = `${heightPercent}%`;

    if (mm > 1) {
      bar.classList.add("rainy");
    } else {
      bar.classList.add("dry");
    }

    chartArea.appendChild(bar);
  });
}


function analyzeRainfall(rainArray) {
  let totalRain = 0;
  let rainyDays = 0;
  let maxDrySpell = 0;
  let currentDrySpell = 0;

  rainArray.forEach(mm => {
    totalRain += mm;

    if (mm > 1) {
      rainyDays++;
      currentDrySpell = 0;
    } else {
      currentDrySpell++;
      maxDrySpell = Math.max(maxDrySpell, currentDrySpell);
    }
  });

  return {
    totalRain: Math.round(totalRain),
    rainyDays,
    maxDrySpell
  };
}

function getPlantingDecision(stats, crop) {
  const rules = cropRules[crop];

  if (
    stats.totalRain >= rules.minRain &&
    stats.rainyDays >= rules.minRainyDays &&
    stats.maxDrySpell <= rules.maxDrySpell
  ) {
    return {
      status: "good",
      title: "PLANT NOW",
      reason: "Rainfall and dry spells are within safe limits."
    };
  }

  if (
    stats.totalRain >= rules.minRain * 0.7 &&
    stats.maxDrySpell <= rules.maxDrySpell + 2
  ) {
    return {
      status: "wait",
      title: "WAIT A FEW DAYS",
      reason: "Rainfall is expected, but conditions are not yet stable."
    };
  }

  return {
    status: "bad",
    title: "DO NOT PLANT YET",
    reason: "Rainfall is insufficient or dry spells are too long."
  };
}


// ===== Navigation logic =====

// Input → Overview
checkBtn.addEventListener("click", async() => {
  const location = locationInput.value.trim();
  const crop = cropSelect.value;

  statusText.textContent = "Finding location...";

  try {
    const coords = await getCoordinates(location);

    overviewTitle.textContent =
      `${crop.toUpperCase()} – ${coords.name}, ${coords.country}`;

        statusText.textContent = "Fetching rainfall data...";

  const rainArray = await getRainForecast(
    coords.latitude,
    coords.longitude
  );

  const stats = analyzeRainfall(rainArray);

  rainTotalEl.textContent = `${stats.totalRain} mm`;
  rainyDaysEl.textContent = stats.rainyDays;
  maxDrySpellEl.textContent = stats.maxDrySpell;

    drawRainChart(rainArray);


    // TEMP: store coordinates for next step
    window.selectedLocation = coords;
    window.selectedCrop = crop;
    window.rainStats = stats;
    window.dailyRain = rainArray;

    showScreen(screenOverview);

  } catch (error) {
    statusText.textContent = "Location not found. Please try another name.";
  }
});


async function getRainForecast(lat, lon) {
  try {
    const url =
      `${FORECAST_API_URL}?latitude=${lat}&longitude=${lon}` +
      `&daily=precipitation_sum&forecast_days=10&timezone=auto`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Forecast request failed");
    }

    const data = await response.json();

    return data.daily.precipitation_sum; // array of rainfall (mm)
  } catch (error) {
    throw error;
  }
}


// Overview → Input
backBtn.addEventListener("click", () => {
  showScreen(screenInput);
});

// Overview → Recommendation
toRecommendationBtn.addEventListener("click", () => {
  const stats = window.rainStats;
  const crop = window.selectedCrop;

  const decision = getPlantingDecision(stats, crop);

  // Reset card state
  decisionCard.className = "decision-card";

  // Apply decision styling
  if (decision.status === "good") {
    decisionCard.classList.add("decision-good");
  } else if (decision.status === "wait") {
    decisionCard.classList.add("decision-wait");
  } else {
    decisionCard.classList.add("decision-bad");
  }

  // Populate UI
  decisionTitle.textContent = decision.title;
  decisionReason.textContent = decision.reason;

  expTotalRain.textContent = `${stats.totalRain} mm`;
  expRainyDays.textContent = stats.rainyDays;
  expDrySpell.textContent = `${stats.maxDrySpell} days`;

  showScreen(screenRecommendation);
});


// Recommendation → Overview
backToOverviewBtn.addEventListener("click", () => {
  showScreen(screenOverview);
});

// Restart → Input
restartBtn.addEventListener("click", () => {
  showScreen(screenInput);
});


// ===== Input fields =====
const locationInput = document.getElementById("locationInput");
const cropSelect = document.getElementById("cropSelect");
const statusText = document.getElementById("statusText");

// ===== Overview placeholders =====
const overviewTitle = document.getElementById("overviewTitle");