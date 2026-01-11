# 🌱 PlantSmart — Agricultural Planting Decision Support App (MVP)

PlantSmart is a lightweight, farmer-focused web application designed to help smallholder farmers in **West Africa** decide **when to plant crops**, based on **rainfall forecasts and crop-specific agronomic rules**.

The app converts complex weather data/info into **simple, explainable planting recommendations** such as:

- ✅ Plant now  
- ⏳ Wait a few days  
- ❌ Do not plant yet  

This project is currently an **MVP (Minimum Viable Product)** focused on planting-time decisions.

---

## 🎯 Problem Statement

Rain-fed farmers in West Africa face increasing uncertainty due to:
- Unpredictable rainfall patterns
- False starts of the rainy season
- Crop failure caused by dry spells after planting

Existing tools often provide **raw weather data**, but not **clear decisions**.

PlantSmart bridges this gap by translating weather forecasts into **actionable planting advice**.

---

## 🌾 What the App Does (Current Features)

### Phase 1 (Implemented)
- City/town input (no GPS required)
- Crop selection (Maize, Rice, Cassava)
- City → latitude/longitude resolution (Open-Meteo Geocoding)
- 10-day rainfall forecast (Open-Meteo Forecast API)
- Rainfall analysis:
  - Total rainfall
  - Number of rainy days
  - Maximum dry spell
- Visual rainfall chart (daily bars)
- Crop-specific rule engine
- Clear planting recommendation with explanation
- Simple, mobile-first UI
- No login, no personal data collection

---

## 🧠 Decision Logic (Simplified)

1. User selects **location + crop**
2. App fetches rainfall forecast
3. Rainfall is analyzed for totals and dry spells
4. Crop-specific rules are applied
5. App generates one clear recommendation:
   - Plant now
   - Wait X days
   - Do not plant yet

All recommendations are **rule-based and explainable** (no black-box AI).

---

## 🌧️ Data Sources & Methodology

### Weather & Rainfall
- **Open-Meteo API**
  - Free, no API key
  - Reliable African coverage
  - Daily precipitation forecasts

### Agronomic Principles (Referenced)
Planting rules are **aligned with publicly available guidance** from:
- Ghana Ministry of Food and Agriculture (MoFA)
- Council for Scientific and Industrial Research (CSIR), Ghana
- Ghana Meteorological Agency (GMet)
- FAO climate-smart agriculture resources

> ⚠️ This app is **not officially endorsed** by these institutions.  
> It is **informed by and consistent with** their published principles.

---

## 🛠️ Technology Stack

- **HTML5**
- **CSS3** (mobile-first, card-based UI)
- **Vanilla JavaScript**
- **Open-Meteo APIs**
- Static hosting (GitHub Pages / Netlify compatible)

No backend is required in Phase 1.

---

## 📂 Project Structure


---

## 🚧 Limitations (Current MVP)

- No offline caching yet
- No SMS / WhatsApp alerts
- No local language support
- Rainfall rules are generalized (not agro-zone specific yet)
- Designed for **decision support**, not guaranteed outcomes

---

## 🔜 Planned Features (Next Phases)

- Agro-ecological zone adjustments
- More crops
- Soil moisture integration
- Offline support (last known forecast)
- SMS / WhatsApp alerts
- Cooperative & NGO dashboards
- Local language support

---

## ⚖️ Disclaimer

PlantSmart provides **decision-support guidance**, not guarantees.  
Final planting decisions should consider local knowledge and extension advice.

---

## 🤝 Contributions & Feedback

This project is under active development.  
Feedback from farmers, agronomists, and developers is welcome.

---

## 📜 License

MIT License (or update as needed)

---

## 🌍 Vision

To help Ghanaian farmers **plant at the right time**, reduce climate risk, and improve food security using **simple, trustworthy digital tools**.
