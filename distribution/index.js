document.addEventListener('DOMContentLoaded', () => {
    const navToggle = document.getElementById('nav-toggle');
    const mobileNav = document.getElementById('mobile-nav');

    if (!navToggle || !mobileNav) return;

    navToggle.addEventListener('click', () => {
        mobileNav.classList.toggle('hidden');
        const expanded = navToggle.getAttribute('aria-expanded') === 'true';
        navToggle.setAttribute('aria-expanded', String(!expanded));
    });
});

const API_KEY = '6d92c0d7e1d91eabc65a0b9d974bdc9c';

// List of Indian States 
const INDIAN_STATE_MAPPING = {
    "assam": "Guwahati",
    "madhya pradesh": "Bhopal",
    "maharashtra": "Mumbai",
    "uttar pradesh": "Lucknow",
    "bihar": "Patna",
    "west bengal": "Kolkata",
    "rajasthan": "Jaipur",
    "gujarat": "Ahmedabad",
    "karnataka": "Bengaluru",
    "andhra pradesh": "Vijayawada",
    "odisha": "Bhubaneswar",
    "telangana": "Hyderabad",
    "kerala": "Thiruvananthapuram",
    "jharkhand": "Ranchi",
    "punjab": "Chandigarh",
    "haryana": "Chandigarh",
    "chhattisgarh": "Raipur",
    "jammu and kashmir": "Srinagar",
    "uttarakhand": "Dehradun",
    "himachal pradesh": "Shimla",
    "tripura": "Agartala",
    "meghalaya": "Shillong",
    "manipur": "Imphal",
    "nagaland": "Kohima",
    "goa": "Panaji",
    "arunachal pradesh": "Itanagar",
    "mizoram": "Aizawl",
    "sikkim": "Gangtok"
};

// Target the location and date elements
const locationDOM = document.getElementById("current-location");
const dateDOM = document.getElementById("current-date");
// Create a DOM reference for the country badge near the top
const countryDOM = document.getElementById("current-country");

// Target the search form and input elements
const searchForm = document.querySelector("form");
const searchInput = document.getElementById("city-search");

// Weather Data DOM Elements
const mainTempDOM = document.getElementById("main-temp");
const weatherIconDOM = document.getElementById("weather-icon");
const conditionDOM = document.getElementById("weather-condition");
const dayMaxDOM = document.getElementById("day-max");
const nightMinDOM = document.getElementById("night-min");
const humidityDOM = document.getElementById("humidity-value");
const windDOM = document.getElementById("wind-value");
const windDirectionDOM = document.getElementById("wind-direction");

// Sunrise/Sunset Time Elements
const sunriseDOM = document.getElementById("sunrise-time");
const sunsetDOM = document.getElementById("sunset-time");

// Global state variable to store parsed 5-day forecast objects
let currentForecastMetricData = [];
let currentActiveThemeBg = { from: "#3b82f6", to: "#1d4ed8" };
const forecastContainerDOM = document.getElementById("forecast-container");

// Weather Card
const weatherCardDOM = document.getElementById("weather-card");
const WEATHER_THEMES = {
    // --- CLEAR SKY ---
    "clear sky": { from: "#38bdf8", to: "#2563eb", border: "border-blue-500" },

    // --- CLOUDS GROUP ---
    "few clouds": { from: "#94a3b8", to: "#1d4ed8", border: "border-slate-500" },
    "scattered clouds": { from: "#94a3b8", to: "#1e40af", border: "border-slate-600" },
    "broken clouds": { from: "#64748b", to: "#334155", border: "border-slate-600" },
    "overcast clouds": { from: "#71717a", to: "#1e293b", border: "border-slate-700" },

    // --- DRIZZLE GROUP ---
    "light intensity drizzle": { from: "#2dd4bf", to: "#475569", border: "border-teal-600" },
    "drizzle": { from: "#14b8a6", to: "#334155", border: "border-teal-700" },
    "heavy intensity drizzle": { from: "#0d9488", to: "#1e293b", border: "border-teal-800" },
    "light intensity drizzle rain": { from: "#06b6d4", to: "#334155", border: "border-cyan-600" },
    "drizzle rain": { from: "#0891b2", to: "#1e293b", border: "border-cyan-700" },
    "heavy intensity drizzle rain": { from: "#0e7490", to: "#0f172a", border: "border-cyan-900" },
    "shower drizzle": { from: "#14b8a6", to: "#1e40af", border: "border-teal-600" },

    // --- RAIN GROUP ---
    "light rain": { from: "#60a5fa", to: "#475569", border: "border-blue-500" },
    "moderate rain": { from: "#3b82f6", to: "#334155", border: "border-blue-600" },
    "heavy intensity rain": { from: "#2563eb", to: "#1e293b", border: "border-blue-700" },
    "very heavy rain": { from: "#1d4ed8", to: "#0f172a", border: "border-blue-900" },
    "extreme rain": { from: "#312e81", to: "#1e293b", border: "border-black" },
    "freezing rain": { from: "#7dd3fc", to: "#334155", border: "border-sky-400" },
    "light intensity shower rain": { from: "#60a5fa", to: "#1e40af", border: "border-blue-500" },
    "shower rain": { from: "#3b82f6", to: "#1d4ed8", border: "border-blue-600" },
    "heavy intensity shower rain": { from: "#2563eb", to: "#1e1b4b", border: "border-blue-900" },

    // --- THUNDERSTORM GROUP ---
    "thunderstorm with light rain": { from: "#6b21a8", to: "#475569", border: "border-purple-900" },
    "thunderstorm with rain": { from: "#581c87", to: "#1e293b", border: "border-purple-950" },
    "thunderstorm with heavy rain": { from: "#3b0764", to: "#27272a", border: "border-black" },
    "light thunderstorm": { from: "#3730a3", to: "#475569", border: "border-indigo-900" },
    "thunderstorm": { from: "#312e81", to: "#334155", border: "border-indigo-950" },
    "heavy thunderstorm": { from: "#1e1b4b", to: "#1e293b", border: "border-black" },
    "ragged thunderstorm": { from: "#1e293b", to: "#3b0764", border: "border-purple-900" },
    "thunderstorm with light drizzle": { from: "#581c87", to: "#115e59", border: "border-purple-950" },
    "thunderstorm with drizzle": { from: "#581c87", to: "#134e4a", border: "border-purple-950" },
    "thunderstorm with heavy drizzle": { from: "#3b0764", to: "#042f2e", border: "border-black" },

    // --- SNOW GROUP ---
    "light snow": { from: "#bae6fd", to: "#64748b", border: "border-sky-300" },
    "snow": { from: "#7dd3fc", to: "#475569", border: "border-sky-400" },
    "heavy snow": { from: "#38bdf8", to: "#1d4ed8", border: "border-sky-500" },
    "sleet": { from: "#67e8f9", to: "#475569", border: "border-cyan-400" },
    "light shower sleet": { from: "#a5f3fc", to: "#64748b", border: "border-cyan-300" },
    "shower sleet": { from: "#22d3ee", to: "#334155", border: "border-cyan-500" },
    "light rain and snow": { from: "#93c5fd", to: "#bae6fd", border: "border-blue-400" },
    "rain and snow": { from: "#60a5fa", to: "#7dd3fc", border: "border-blue-500" },
    "light shower snow": { from: "#bae6fd", to: "#2563eb", border: "border-sky-300" },
    "shower snow": { from: "#7dd3fc", to: "#1d4ed8", border: "border-sky-400" },
    "heavy shower snow": { from: "#38bdf8", to: "#1e40af", border: "border-sky-500" },

    // --- ATMOSPHERE GROUP ---
    "mist": { from: "#a1a1aa", to: "#475569", border: "border-zinc-500" },
    "smoke": { from: "#52525b", to: "#1e293b", border: "border-zinc-700" },
    "haze": { from: "#a1a1aa", to: "#64748b", border: "border-zinc-500" },
    "sand/dust whirls": { from: "#d97706", to: "#44403c", border: "border-amber-700" },
    "fog": { from: "#a8a29e", to: "#475569", border: "border-stone-500" },
    "sand": { from: "#f59e0b", to: "#52525b", border: "border-amber-600" },
    "dust": { from: "#78716c", to: "#44403c", border: "border-stone-600" },
    "volcanic ash": { from: "#44403c", to: "#171717", border: "border-black" },
    "squalls": { from: "#475569", to: "#0f172a", border: "border-slate-700" },
    "tornado": { from: "#262626", to: "#000000", border: "border-neutral-950" }
};

// Weather Card Theme
function updateCardTheme(weatherDescription) {
    const lookupKey = weatherDescription.toLowerCase().trim();

    const theme = WEATHER_THEMES[lookupKey] || { from: "#3b82f6", to: "#1d4ed8", border: "border-blue-700" };

    const currentClasses = Array.from(weatherCardDOM.classList);
    currentClasses.forEach(cls => {
        if (cls.startsWith("border-")) {
            weatherCardDOM.classList.remove(cls);
        }
    });

    weatherCardDOM.classList.add(theme.border);
    weatherCardDOM.style.backgroundImage = `linear-gradient(to bottom, ${theme.from}, ${theme.to})`;

    // Save the active background values globally for the extended forecast sync
    currentActiveThemeBg = { from: theme.from, to: theme.to };

    // Force a re-render of the extended forecast cards with the updated background
    renderExtendedForecast();
}

// Global state variables for temperature unit tracking
let currentUnit = "C";
let currentTempMetric = null;
let currentMaxMetric = null;
let currentMinMetric = null;

const unitFBtn = document.getElementById("unit-f");
const unitCBtn = document.getElementById("unit-c");

// Initialize application
function displayCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    dateDOM.textContent = formattedDate;
}
displayCurrentDate();

// 1. Function to convert lat/lon to City Name
async function getCityName(lat, lon) {
    const geoUrl = `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`;

    try {
        locationDOM.textContent = "Fetching city name...";

        const response = await fetch(geoUrl);
        if (!response.ok) {
            throw new Error("Failed to fetch location data");
        }

        const data = await response.json();

        if (data && data.length > 0) {
            countryDOM.textContent = `🌐 ${data[0].country}`;
            const cityName = data[0].name;
            const stateName = data[0].state;
            const country = data[0].country;

            if (stateName) {
                locationDOM.textContent = `${cityName}, ${stateName}, ${country}`;
            } else {
                locationDOM.textContent = `${cityName}, ${country}`;
            }
        } else {
            locationDOM.textContent = "City not found";
        }

        // Trigger both layout streams synchronously
        await fetchWeatherData(lat, lon);
        await fetchExtendedForecastData(lat, lon);
    } catch (error) {
        console.error("Error with reverse geocoding:", error);
        locationDOM.textContent = "Error loading city";
    }
}

// 2. Updated Location Function to pass coordinates to getCityName
function getUserLocation() {
    if (!navigator.geolocation) {
        locationDOM.textContent = "Geolocation not supported";
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            getCityName(lat, lon);
        },
        (error) => {
            console.error(error);
            locationDOM.textContent = "Location access denied";
        }
    );
}
getUserLocation();

// 3. Function to search coordinates by city name
async function getCoordinatesBySearch(cityName) {
    const directGeoUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${encodeURIComponent(cityName)}&limit=1&appid=${API_KEY}`;

    try {
        locationDOM.textContent = "Searching...";

        const response = await fetch(directGeoUrl);
        if (!response.ok) throw new Error("Search failed");

        const data = await response.json();

        if (data && data.length > 0) {
            const lat = data[0].lat;
            const lon = data[0].lon;
            const name = data[0].name;
            const state = data[0].state;
            const country = data[0].country;

            if (state) {
                locationDOM.textContent = `${name}, ${state}, ${country}`;
            } else {
                locationDOM.textContent = `${name}, ${country}`;
            }

            countryDOM.textContent = `🌐 ${country}`;

            // Capture the confirmed match into history storage
            saveToHistory(name);

            // Sync structural targets side-by-side
            await fetchWeatherData(lat, lon);
            await fetchExtendedForecastData(lat, lon);

        } else {
            locationDOM.textContent = "Location not found. Try again!";
        }
    } catch (error) {
        console.error("Error searching city:", error);
        locationDOM.textContent = "Error finding location";
    }
}

// 4. Event Listener for Form Submission (Dynamic Country Check)
searchForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    let query = searchInput.value.trim();

    if (query) {
        const lowerQuery = query.toLowerCase();
        locationDOM.textContent = "Checking location...";

        try {
            if (INDIAN_STATE_MAPPING[lowerQuery]) {
                query = INDIAN_STATE_MAPPING[lowerQuery];
            } else {
                const countryCheckUrl = `https://restcountries.com/v3.1/name/${encodeURIComponent(query)}?fullText=true`;
                const countryResponse = await fetch(countryCheckUrl);

                if (countryResponse.ok) {
                    const countryData = await countryResponse.json();
                    if (countryData[0] && countryData[0].capital) {
                        query = countryData[0].capital[0];
                    }
                }
            }
        } catch (err) {
            console.log("Proceeding with direct city coordinates check.");
        }

        getCoordinatesBySearch(query);
        dropdownDOM.classList.add("hidden"); // Clear active layout overlays on explicit entry
        searchInput.value = "";
    }
});

// Dropdown DOM Elements and Local History Setup
const dropdownDOM = document.getElementById("search-dropdown");
let searchHistory = JSON.parse(localStorage.getItem("weatherSearchHistory")) || [];

// Save valid query history up to a limit of 5 entries
function saveToHistory(cityName) {
    if (!cityName) return;
    // Strip state/country formatting out if present, or maintain pure city name string
    const cleanName = cityName.split(",")[0].trim();

    // Filter duplicates out and push recent searches to the top
    searchHistory = searchHistory.filter(item => item.toLowerCase() !== cleanName.toLowerCase());
    searchHistory.unshift(cleanName);

    if (searchHistory.length > 5) searchHistory.pop(); // Cap history length
    localStorage.setItem("weatherSearchHistory", JSON.stringify(searchHistory));
}

// Render dynamic elements inside the dropdown panel
function renderDropdown() {
    if (!dropdownDOM) return;
    dropdownDOM.innerHTML = "";

    // 1. Core Default: Current Location Quick Switcher
    const currentLocRow = document.createElement("div");
    currentLocRow.className = "px-4 py-2.5 hover:bg-blue-50 cursor-pointer text-sm font-semibold text-blue-600 flex items-center gap-2 transition";
    currentLocRow.innerHTML = "<span>📍</span> Use Current Location";
    currentLocRow.addEventListener("click", () => {
        getUserLocation();
        dropdownDOM.classList.add("hidden");
    });
    dropdownDOM.appendChild(currentLocRow);

    // 2. Loop through recent persistent historic user selections
    searchHistory.forEach(city => {
        const historyRow = document.createElement("div");
        historyRow.className = "px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700 truncate flex items-center justify-between transition";
        historyRow.innerHTML = `<span>⏳ ${city}</span>`;

        historyRow.addEventListener("click", () => {
            searchInput.value = city;
            getCoordinatesBySearch(city);
            dropdownDOM.classList.add("hidden");
            searchInput.value = "";
        });
        dropdownDOM.appendChild(historyRow);
    });
}

// Interaction listeners for toggle display streams
searchInput.addEventListener("focus", () => {
    // Only reveal dropdown framework if history contains values 
    if (searchHistory.length > 0) {
        renderDropdown();
        dropdownDOM.classList.remove("hidden");
    }
});

// Dismiss dropdown gracefully if user clicks anywhere outside the form viewport context
document.addEventListener("click", (event) => {
    if (dropdownDOM && !searchForm.contains(event.target)) {
        dropdownDOM.classList.add("hidden");
    }
});

// Helper function to convert Celsius to Fahrenheit cleanly
function celsiusToFahrenheit(celsius) {
    return Math.round((celsius * 9) / 5 + 32);
}

// Unified render function to handle layout changes dynamically
function renderTemperatures() {
    if (currentTempMetric === null) return;

    let displayTemp, displayMax, displayMin;

    if (currentUnit === "C") {
        displayTemp = Math.round(currentTempMetric);
        displayMax = Math.round(currentMaxMetric);
        displayMin = Math.round(currentMinMetric);
    } else {
        displayTemp = celsiusToFahrenheit(currentTempMetric);
        displayMax = celsiusToFahrenheit(currentMaxMetric);
        displayMin = celsiusToFahrenheit(currentMinMetric);
    }

    // 1. Update main temperature card node
    mainTempDOM.textContent = `${displayTemp}°${currentUnit}`;

    // 2. Update dynamic daytime spreads with realistic fallback handling
    if (displayMax === displayMin) {
        dayMaxDOM.textContent = `${displayMax + (currentUnit === "C" ? 2 : 4)}°${currentUnit}`;
        nightMinDOM.textContent = `${displayMin - (currentUnit === "C" ? 4 : 7)}°${currentUnit}`;
    } else {
        dayMaxDOM.textContent = `${displayMax}°${currentUnit}`;
        nightMinDOM.textContent = `${displayMin}°${currentUnit}`;
    }

    // 3. Synchronize the extended 5-day forecast data to use the same active unit
    renderExtendedForecast();
}

// Function to update active/inactive button visual styling states flawlessly
function updateUnitToggleUI() {
    if (currentUnit === "C") {
        // ==========================================
        // 1. HIGHLIGHT CELSIUS BUTTON (Active)
        // ==========================================
        unitCBtn.classList.add("text-white", "bg-blue-600", "shadow-sm");
        unitCBtn.classList.remove("text-gray-700", "hover:bg-gray-50");

        // ==========================================
        // 2. DIM FAHRENHEIT BUTTON (Inactive)
        // ==========================================
        unitFBtn.classList.remove("text-white", "bg-blue-600", "shadow-sm");
        unitFBtn.classList.add("text-gray-700", "hover:bg-gray-50");
    } else {
        // ==========================================
        // 3. HIGHLIGHT FAHRENHEIT BUTTON (Active)
        // ==========================================
        unitFBtn.classList.add("text-white", "bg-blue-600", "shadow-sm");
        unitFBtn.classList.remove("text-gray-700", "hover:bg-gray-50");

        // ==========================================
        // 4. DIM CELSIUS BUTTON (Inactive)
        // ==========================================
        unitCBtn.classList.remove("text-white", "bg-blue-600", "shadow-sm");
        unitCBtn.classList.add("text-gray-700", "hover:bg-gray-50");
    }
}

// Interactive unified event triggers for both button elements
unitFBtn.addEventListener("click", () => {
    if (currentUnit !== "F") {
        currentUnit = "F";
        updateUnitToggleUI();
        renderTemperatures();
    }
});

unitCBtn.addEventListener("click", () => {
    if (currentUnit !== "C") {
        currentUnit = "C";
        updateUnitToggleUI();
        renderTemperatures();
    }
});

// 5. Function to fetch weather data (UPDATED: Added live evaluation hooks for extreme alerts)
async function fetchWeatherData(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error("Weather data fetch failed");

        const data = await response.json();
        const detailedDescription = data.weather[0].description;

        updateCardTheme(detailedDescription);

        // ==========================================
        // DYNAMIC ALERT EVALUATION ENGINE TRIGGER
        // ==========================================
        evaluateWeatherAlerts(data);

        // ==========================================
        // CACHE METRIC VALUES WITH SPREAD CHECKS
        // ==========================================
        currentTempMetric = data.main.temp;

        const rawMax = data.main.temp_max;
        const rawMin = data.main.temp_min;

        if (Math.round(rawMax) === Math.round(rawMin)) {
            currentMaxMetric = rawMax + 2;
            currentMinMetric = rawMin - 4;
        } else {
            currentMaxMetric = rawMax;
            currentMinMetric = rawMin;
        }

        // Run primary DOM painting framework
        renderTemperatures();

        // Update non-temperature text condition node
        conditionDOM.textContent = data.weather[0].description;

        // Set the Weather Icon Emoji dynamically
        weatherIconDOM.textContent = getWeatherEmoji(data.weather[0].icon);

        // Update Humidity & Wind metrics
        humidityDOM.textContent = `${data.main.humidity}%`;

        const windSpeedKmH = Math.round(data.wind.speed * 3.6);
        windDOM.textContent = `${windSpeedKmH} km/h`;

        // Rotate the wind arrow based on meteorological degrees
        if (data.wind && data.wind.deg !== undefined) {
            const windDegrees = data.wind.deg;
            windDirectionDOM.style.transform = `rotate(${windDegrees}deg)`;
        } else {
            windDirectionDOM.style.transform = `rotate(0deg)`;
        }

        const sunriseTimestamp = data.sys.sunrise;
        const sunsetTimestamp = data.sys.sunset;
        const timezoneOffset = data.timezone;

        // Format and display time parameters
        sunriseDOM.textContent = formatUnixTime(sunriseTimestamp, timezoneOffset);
        sunsetDOM.textContent = formatUnixTime(sunsetTimestamp, timezoneOffset);

    } catch (error) {
        console.error("Error fetching weather data:", error);
        locationDOM.textContent = "Weather unavailable"; // Replaces "Searching..." safely
        showSystemError("Failed to sync current weather metrics. Please check your internet connection or try again later.");
    }
}

// 6. Helper function to map OpenWeather icons to clean emojis
function getWeatherEmoji(iconCode) {
    const iconMap = {
        "01d": "☀️", "01n": "🌙",
        "02d": "⛅", "02n": "☁️",
        "03d": "☁️", "03n": "☁️",
        "04d": "☁️", "04n": "☁️",
        "09d": "🌧️", "09n": "🌧️",
        "10d": "🌦️", "10n": "🌧️",
        "11d": "⛈️", "11n": "⛈️",
        "13d": "❄️", "13n": "❄️",
        "50d": "🌫️", "50n": "🌫️"
    };
    return iconMap[iconCode] || "⏳";
}

// 7. Function to get timezone
function formatUnixTime(unixTimestamp, timezoneOffset) {
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC'
    });
}

// Function to handle fetching and processing the 5-Day Forecast data stream
async function fetchExtendedForecastData(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(forecastUrl);
        if (!response.ok) throw new Error("Forecast data fetch failed");

        const data = await response.json();

        // 1. Get today's date string format (YYYY-MM-DD) to easily exclude it
        const todayStr = new Date().toISOString().split('T')[0];

        // 2. Group all incoming 3-hour blocks by their calendar date string
        const groupedByDate = {};

        data.list.forEach(block => {
            const datePart = block.dt_txt.split(" ")[0];

            // Skip today's data entirely
            if (datePart === todayStr) return;

            if (!groupedByDate[datePart]) {
                groupedByDate[datePart] = [];
            }
            groupedByDate[datePart].push(block);
        });

        const temporaryDailyArray = [];

        // 3. Iterate through each unique future date group (up to 5 days)
        const futureDates = Object.keys(groupedByDate).sort().slice(0, 5);

        futureDates.forEach(dateStr => {
            const dayBlocks = groupedByDate[dateStr];

            // Try to find a block closest to midday (12:00 PM), fallback to the middle block
            const selectedBlock = dayBlocks.find(b => b.dt_txt.includes("12:00:00")) || dayBlocks[Math.floor(dayBlocks.length / 2)];

            const dateObject = new Date(selectedBlock.dt * 1000);
            const dayName = dateObject.toLocaleDateString("en-US", { weekday: "long" });
            const dateString = dateObject.toLocaleDateString("en-US", { month: "short", day: "numeric" });

            temporaryDailyArray.push({
                dayName: dayName,
                dateString: dateString,
                tempC: selectedBlock.main.temp,
                mainCondition: selectedBlock.weather[0].main,
                description: selectedBlock.weather[0].description,
                iconCode: selectedBlock.weather[0].icon,
                // EXTRACT METRICS SAFELY HERE:
                humidity: selectedBlock.main.humidity,
                windSpeed: selectedBlock.wind ? selectedBlock.wind.speed : 0,
                windDeg: selectedBlock.wind ? selectedBlock.wind.deg : 0
            });
        });

        // Save exactly what we found into global memory
        currentForecastMetricData = temporaryDailyArray;

        // Render the processed cards inside our template container
        renderExtendedForecast();

    } catch (error) {
        console.error("Error fetching or parsing extended forecast:", error);
        // Clean out stagnant HTML blocks from previous lookups inside the container
        if (forecastContainerDOM) forecastContainerDOM.innerHTML = ""; 
        showSystemError("Could not retrieve the 5-day extended forecast data grid from the server.");
    }
}

// Function to dynamically render the 5-day forecast cards into the DOM
function renderExtendedForecast() {
    if (!forecastContainerDOM || currentForecastMetricData.length === 0) return;

    // Flush old card layouts cleanly before redrawing
    forecastContainerDOM.innerHTML = "";

    // Target the next 5 consecutive upcoming days safely
    const todayWeekday = new Date().toLocaleDateString('en-US', { weekday: 'long' });
    const filteredDays = currentForecastMetricData.filter(day => day.dayName !== todayWeekday).slice(0, 5);

    filteredDays.forEach(day => {
        let displayTemp = currentUnit === "C" ? Math.round(day.tempC) : celsiusToFahrenheit(day.tempC);

        // Process wind metrics safely from the updated data object
        const windSpeedKmH = Math.round(day.windSpeed * 3.6);
        const windDegrees = day.windDeg !== undefined ? day.windDeg : 0;

        // Contextual dynamic fallback matching theme dictionary configs
        const lookupKey = day.description.toLowerCase().trim();
        const cardTheme = WEATHER_THEMES[lookupKey] || { from: "#3b82f6", to: "#1d4ed8", border: "border-blue-700" };
        
        // Compact padding to maximize layout efficiency
        const explicitGradientStyle = `background-image: linear-gradient(to right, ${cardTheme.from}, ${cardTheme.to}); padding: 10px 12px;`;

        const cardHTML = `
            <div style="${explicitGradientStyle}" class="flex flex-row items-center justify-between rounded-xl ${cardTheme.border} border text-white shadow-md transition-all duration-200 hover:scale-[1.01] w-full gap-1">
                
                <!-- 1. LEFT COLUMN: Day & Date (UPDATED: Downscaled text sizes for maximum tablet clearance) -->
                <div class="flex flex-col items-center justify-center text-center flex-1 min-w-0">
                    <p class="font-bold tracking-wide text-[10px] lg:text-sm drop-shadow-sm leading-tight truncate w-full">${day.dayName}</p>
                    <p class="text-[8.5px] lg:text-xs opacity-75 font-medium drop-shadow-sm mt-0.5 truncate w-full">${day.dateString}</p>
                </div>
                
                <!-- 2. MIDDLE COLUMN: Icon + Temp & Description -->
                <div class="flex flex-col items-center justify-center text-center flex-1 min-w-0 px-0.5">
                    <div class="flex items-center gap-1 justify-center w-full">
                        <span class="text-sm lg:text-xl filter drop-shadow-md select-none leading-none">${getWeatherEmoji(day.iconCode)}</span>
                        <span class="text-xs lg:text-base font-extrabold tracking-tight drop-shadow-md">${displayTemp}°${currentUnit}</span>
                    </div>
                    <p class="text-[9px] lg:text-xs font-medium opacity-85 truncate capitalize drop-shadow-sm mt-0.5 w-full">
                        ${day.description}
                    </p>
                </div>

                <!-- 3. RIGHT COLUMN: Humidity & Wind Parameters -->
                <div class="flex flex-col items-center justify-center text-center flex-1 min-w-0 gap-0.5 text-[9px] lg:text-xs font-semibold">
                    <!-- Humidity Row -->
                    <div class="flex items-center gap-1 justify-center opacity-95 w-full" title="Humidity">
                        <span>💧</span>
                        <span class="truncate">${day.humidity}%</span>
                    </div>
                    
                    <!-- Wind Row with Leaf Emoji -->
                    <div class="flex items-center gap-0.5 justify-center opacity-95 w-full" title="Wind Speed & Direction">
                        <span>🍃</span>
                        <span class="truncate">${windSpeedKmH} km/h</span>
                        <span style="transform: rotate(${windDegrees}deg); display: inline-block;" class="font-black transition-transform origin-center scale-90">↑</span>
                    </div>
                </div>
                
            </div>
        `;

        forecastContainerDOM.insertAdjacentHTML("beforeend", cardHTML);
    });
}

// Function to evaluate live weather data parameters for extreme or severe conditions
function evaluateWeatherAlerts(data) {
    // 1. Target or automatically provision a container for alert banners above the main card
    let alertContainer = document.getElementById("alert-container");
    if (!alertContainer && weatherCardDOM) {
        alertContainer = document.createElement("div");
        alertContainer.id = "alert-container";
        alertContainer.className = "w-full mb-4 flex flex-col gap-3 transition-all duration-300";
        weatherCardDOM.parentNode.insertBefore(alertContainer, weatherCardDOM);
    }

    // Always clear old alerts when a new city data stream arrives
    alertContainer.innerHTML = "";

    const description = data.weather[0].description.toLowerCase().trim();
    const conditionGroup = data.weather[0].main;
    const tempCelsius = data.main.temp;
    const windSpeedKmH = Math.round(data.wind.speed * 3.6);

    const activeAlerts = [];

    // --- ALERT CONFIGURATION CRITERIA ---

    // 1. Torandoes, Squalls, and Hurricanes
    if (["tornado", "squalls"].includes(description)) {
        activeAlerts.push({
            type: "danger",
            icon: "🌪️",
            title: "Severe Tornado / Gale Warning",
            message: "Destructive localized atmospheric forces detected nearby. Take safe indoor shelter immediately."
        });
    }

    // 2. Severe and Heavy Thunderstorms
    if (conditionGroup === "Thunderstorm" && (description.includes("heavy") || description.includes("ragged"))) {
        activeAlerts.push({
            type: "danger",
            icon: "⛈️",
            title: "Severe Thunderstorm Warning",
            message: "Violent electrical storms with dangerous lightning and heavy downpours observed. Avoid open outdoor spaces."
        });
    }

    // 3. Flash Flood Threats (Torrential Rain)
    if (["heavy intensity rain", "very heavy rain", "extreme rain", "heavy intensity shower rain"].includes(description)) {
        activeAlerts.push({
            type: "warning",
            icon: "🌧️",
            title: "Flash Flood Watch",
            message: "Torrential downpours may cause sudden localized flooding. Avoid driving through subways or low-lying paths."
        });
    }

    // 4. Extreme Heat Waves
    if (tempCelsius >= 40) {
        activeAlerts.push({
            type: "warning",
            icon: "🥵",
            title: "Extreme Heat Advisory",
            message: `Dangerously high temperature of ${Math.round(tempCelsius)}°C reported. Stay thoroughly hydrated and avoid direct sun exposure.`
        });
    }

    // 5. Blizzards and Deep Freezes
    if (tempCelsius <= 0) {
        activeAlerts.push({
            type: "warning",
            icon: "🥶",
            title: "Extreme Freeze Warning",
            message: `Sub-zero thermal readings (${Math.round(tempCelsius)}°C) detected. Watch out for black ice on roads and keep pets safely sheltered.`
        });
    }

    // 6. Destructive High Winds
    if (windSpeedKmH >= 55) {
        activeAlerts.push({
            type: "warning",
            icon: "💨",
            title: "High Wind Advisory",
            message: `Damaging gale winds matching ${windSpeedKmH} km/h detected. Secure loose outdoor property and exercise travel caution.`
        });
    }

    // 7. Volcanic Ash / Severe Sandstorms
    if (["volcanic ash", "sand", "dust"].includes(description)) {
        activeAlerts.push({
            type: "danger",
            icon: "😷",
            title: "Hazardous Air Quality Alert",
            message: "Severe airborne particulate visibility impairments reported. Use protective face covers and keep windows sealed shut."
        });
    }

    // --- RENDER ALERTS INTO DOM ---
    if (activeAlerts.length === 0) return; // Exit cleanly if skies are safe and regular

    activeAlerts.forEach((alert, index) => {
        // Apply responsive visual themes based on alert severity type
        const themeClass = alert.type === "danger" 
            ? "bg-red-500/10 border-red-500 text-red-200" 
            : "bg-amber-500/10 border-amber-500 text-amber-200";

        const alertID = `weather-alert-${index}`;

        const alertHTML = `
            <div id="${alertID}" class="flex items-start justify-between p-4 rounded-xl border backdrop-blur-md shadow-lg transition-all duration-300 animate-fadeIn ${themeClass}">
                <div class="flex gap-3">
                    <span class="text-2xl filter drop-shadow select-none">${alert.icon}</span>
                    <div class="flex flex-col gap-0.5">
                        <h4 class="font-extrabold tracking-wide text-sm text-black">${alert.title}</h4>
                        <p class="text-xs font-medium opacity-90 leading-relaxed">${alert.message}</p>
                    </div>
                </div>
                <button onclick="document.getElementById('${alertID}').remove()" class="text-white/60 hover:text-white transition-colors p-0.5 ml-2 focus:outline-none text-base font-bold select-none" title="Dismiss Alert">
                    ✕
                </button>
            </div>
        `;
        alertContainer.insertAdjacentHTML("beforeend", alertHTML);
    });
}

// Reusable UI notifier for API / Network exceptions
function showSystemError(message) {
    let alertContainer = document.getElementById("alert-container");
    if (!alertContainer && weatherCardDOM) {
        alertContainer = document.createElement("div");
        alertContainer.id = "alert-container";
        alertContainer.className = "w-full mb-4 flex flex-col gap-3 transition-all duration-300";
        weatherCardDOM.parentNode.insertBefore(alertContainer, weatherCardDOM);
    }
    if (!alertContainer) return;

    const errorId = `sys-error-${Date.now()}`;
    const errorHTML = `
        <div id="${errorId}" class="flex items-start justify-between p-4 rounded-xl border backdrop-blur-md shadow-lg bg-red-500/10 border-red-500 text-red-200 transition-all duration-300">
            <div class="flex gap-3">
                <span class="text-2xl filter drop-shadow select-none">⚠️</span>
                <div class="flex flex-col gap-0.5">
                    <h4 class="font-extrabold tracking-wide text-sm text-white">Application Error</h4>
                    <p class="text-xs font-medium opacity-90 leading-relaxed">${message}</p>
                </div>
            </div>
            <button onclick="document.getElementById('${errorId}').remove()" class="text-white/60 hover:text-white p-0.5 ml-2 font-bold focus:outline-none">
                ✕
            </button>
        </div>
    `;
    alertContainer.insertAdjacentHTML("beforeend", errorHTML);
}

