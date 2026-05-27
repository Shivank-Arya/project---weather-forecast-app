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
        searchInput.value = "";
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

// 5. Function to fetch weather data
async function fetchWeatherData(lat, lon) {
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error("Weather data fetch failed");

        const data = await response.json();
        const detailedDescription = data.weather[0].description;

        updateCardTheme(detailedDescription);

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
            // dt_txt format is "YYYY-MM-DD HH:MM:SS", pulling the date part
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
            
            // Try to find a block closest to midday (12:00 PM), fallback to the middle block of the day array
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
                iconCode: selectedBlock.weather[0].icon
            });
        });

        // Save exactly what we found into global memory
        currentForecastMetricData = temporaryDailyArray;

        // Render the processed cards inside our template container
        renderExtendedForecast();

    } catch (error) {
        console.error("Error fetching or parsing extended forecast:", error);
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
        
        // Contextual dynamic fallback matching theme dictionary configs
        const lookupKey = day.description.toLowerCase().trim();
        const cardTheme = WEATHER_THEMES[lookupKey] || { from: "#3b82f6", to: "#1d4ed8", border: "border-blue-700" };
        const explicitGradientStyle = `background-image: linear-gradient(to bottom, ${cardTheme.from}, ${cardTheme.to});`;

        const cardHTML = `
            <div style="${explicitGradientStyle}" class="flex flex-row lg:flex-col items-center justify-between lg:justify-center p-4 rounded-xl ${cardTheme.border} border text-white shadow-md transition-all duration-300 hover:scale-[1.02] gap-2 min-w-0 w-full text-left lg:text-center">
                
                <!-- Date & Day Section -->
                <div class="min-w-0">
                    <p class="font-bold tracking-wide text-sm sm:text-base truncate drop-shadow-sm">${day.dayName}</p>
                    <p class="text-xs opacity-75 drop-shadow-sm">${day.dateString}</p>
                </div>
                
                <!-- Visual Icon Representation -->
                <div class="flex items-center justify-center my-0 lg:my-2">
                    <span class="text-2xl sm:text-3xl filter drop-shadow-md select-none">${getWeatherEmoji(day.iconCode)}</span>
                </div>
                
                <!-- Metrics & Condition Text -->
                <div class="min-w-0 text-right lg:text-center">
                    <p class="text-base sm:text-lg font-extrabold tracking-tight drop-shadow-md">${displayTemp}°${currentUnit}</p>
                    <p class="text-[10px] sm:text-xs font-medium opacity-85 truncate capitalize drop-shadow-sm">${day.mainCondition}</p>
                </div>
                
            </div>
        `;
        
        forecastContainerDOM.insertAdjacentHTML("beforeend", cardHTML);
    });
}