# 🌦️ Weather Channel Dashboard

A modern, highly responsive weather forecasting web application featuring real-time data visualization, dynamic contextual theme shifts, and smart search capabilities. Built entirely with semantic HTML5, Tailwind CSS, and vanilla JavaScript, it provides a seamless user experience across mobile, tablet, and desktop devices.

![Weather Dashboard Preview](img/weather-channel-dashboard-2.png)

---

## 🚀 Key Features

### 📍 Intelligent Location & Search Engine
* **Automated Geolocation Tracking:** Automatically requests user coordinates on launch, parsing them via the native browser Geolocation API.
* **Reverse Geocoding Resolution:** Translates raw latitude and longitude into human-readable regional parameters (City, State, and Country).
* **Smart History Dropdown Menu:** Features an autocomplete menu that remains hidden for new users, appearing dynamically once a search history is built. It stores up to 5 unique recent cities and features a quick **"Use Current Location"** option to return to local metrics.
* **Smart Search Normalization:** Includes an internal dictionary mapping Indian states directly to their respective capitals. It also integrates with the RestCountries API to resolve country-wide queries to their specific capital cities.

### 🎨 Context-Aware Visuals & Dynamic Themes
* **Adaptive Gradient Backgrounds:** The main hero card and all extended 5-day forecast cards dynamically recalculate their gradient variations and borders to reflect current weather criteria (e.g., clear skies, distinct cloud densities, heavy storms, mist, or snow).
* **Visual Weather Emojis:** Maps OpenWeather icon packages to vibrant, drop-shadowed emojis for intuitive scanning.

### 📊 Deep Meteorological Insights
* **Comprehensive Today Card:** Provides at-a-glance access to primary temperature, day/night splits, humidity percentage, and wind speeds.
* **True-Heading Wind Indicator:** Dynamically rotates a vector direction arrow component using real-time meteorological degree metadata.
* **Timezone-Corrected Solar Intervals:** Renders calculated sunrise and sunset times specific to the searched city's native UTC offset.
* **5-Day Extended Forecast:** Slices 3-hour forecast chunks down to precise midday metrics, rendering a structured 5-day overview layout.
* **Global Unit Toggle:** Effortlessly updates all active dashboard nodes simultaneously between Celsius (°C) and Fahrenheit (°F) states.

---

## 🛠️ Tech Stack

* **Structure:** `index.html` (Semantic markup utilizing uniform utility layouts)
* **Styling:** Tailwind CSS (Utility-first framework configuration)
* **Logic:** `index.js` (Asynchronous native JavaScript, managing state and working entirely with the DOM without external framework overhead)
* **External Integrations:** * [OpenWeatherMap API](https://openweathermap.org/api) (Current Conditions & 5-Day / 3-Hour Forecast feeds)
  * [RestCountries API](https://restcountries.com/) (Country boundary-to-capital resolution)

---

## 📂 File Architecture

```bash
├── index.html          # Core layout, sidebar routing context, and structural frames
├── 5day.html           # Dedicated multi-day extended breakdown view (Route Placeholder)
├── aqi.html            # Dedicated Air Quality Index panel (Route Placeholder)
├── style.css           # Compiled Tailwind CSS output utility file
├── index.js            # Unified async state engine and DOM rendering logic
└── image_a186d9.png    # Interface screenshot asset
```

## ⚡ Quick Start & Setup

To run this application locally, you do not need to configure complex dev servers.

### 1. **Clone the repository**
   ```bash
   git clone https://github.com/Shivank-Arya/project---weather-forecast-app.git
   cd project---weather-forecast-app
   ```

###2. **Configure your API Key:**
   Open `index.js` and update the global constant with your personal credential:
   ```javascript
   const API_KEY = 'your_openweather_api_key_here';
   ```
   ⚠️ Security Warning: Do not commit your raw API key back to public GitHub repositories. Keep it safe locally!
   Mine is available just in case...

###3. **Launch the app:**
   Simply double-click or open `index.html` directly in any modern browser to view the functional interface[cite: 1]!
   
   (Note: If you are making modifications to the Tailwind configuration or classes, ensure you run your local Tailwind compilation script to rebuild style.css).

---

## 🔮 Roadmap / Future Enhancements
* Incorporate logic mapping for the **5 Day** and **Air Quality Index** standalone navigational routes[cite: 1].
* Configure a localized caching policy for the forecast payloads to respect external API call volume limits.