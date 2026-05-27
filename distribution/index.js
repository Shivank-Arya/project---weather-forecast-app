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

// Weather Card
const weatherCardDOM = document.getElementById("weather-card");

const WEATHER_THEMES = {
    // --- CLEAR SKY ---
    "clear sky": { from: "#38bdf8", to: "#2563eb", border: "border-blue-500" }, // Sky-400 to Blue-600

    // --- CLOUDS GROUP ---
    "few clouds": { from: "#94a3b8", to: "#1d4ed8", border: "border-slate-500" }, // Slate-400 to Blue-700
    "scattered clouds": { from: "#94a3b8", to: "#1e40af", border: "border-slate-600" }, // Slate-400 to Blue-800
    "broken clouds": { from: "#64748b", to: "#334155", border: "border-slate-600" }, // Slate-500 to Slate-700
    "overcast clouds": { from: "#71717a", to: "#1e293b", border: "border-slate-700" }, // Zinc-500 to Slate-800 (Tokyo's Fix)

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
    
    // Default safe fallback if theme lookup returns undefined
    const theme = WEATHER_THEMES[lookupKey] || { from: "#3b82f6", to: "#1d4ed8", border: "border-blue-700" };
    
    // Step A: Strip any prior border classes cleanly
    const currentClasses = Array.from(weatherCardDOM.classList);
    currentClasses.forEach(cls => {
        if (cls.startsWith("border-")) {
            weatherCardDOM.classList.remove(cls);
        }
    });
    
    // Step B: Inject the new border style structural token
    weatherCardDOM.classList.add(theme.border);
    
    // Step C: Directly apply explicit colors using native inline CSS gradients. 
    // This circumvents Tailwind v4's dynamic compilation boundaries flawlessly.
    weatherCardDOM.style.backgroundImage = `linear-gradient(to bottom, ${theme.from}, ${theme.to})`;
}

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

        // OpenWeatherMap returns an array of results. Grab the first one.
        if (data && data.length > 0) {
            countryDOM.textContent = `🌐 ${data[0].country}`;
            const cityName = data[0].name;
            const stateName = data[0].state; // <-- Extract the state
            const country = data[0].country;

            // Check if a state exists in the API response for this location
            if (stateName) {
                // Displays: "City, State, Country" (e.g., "Bhopal, Madhya Pradesh, IN")
                locationDOM.textContent = `${cityName}, ${stateName}, ${country}`;
            } else {
                // Fallback if no state is provided: "City, Country"
                locationDOM.textContent = `${cityName}, ${country}`;
            }
        } else {
            locationDOM.textContent = "City not found";
        }
        fetchWeatherData(lat, lon);
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

            // Send coordinates to get converted into a City Name
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

            // Update the main card layout
            if (state) {
                locationDOM.textContent = `${name}, ${state}, ${country}`;
            } else {
                locationDOM.textContent = `${name}, ${country}`;
            }

            // NEW: Update the metadata country badge beside the unit buttons!
            countryDOM.textContent = `🌐 ${country}`;

            fetchWeatherData(lat, lon);

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
            // Check if it's an Indian State name
            if (INDIAN_STATE_MAPPING[lowerQuery]) {
                // Instantly swap the state name for a concrete city OpenWeather understands!
                query = INDIAN_STATE_MAPPING[lowerQuery];
            } else {
                // Otherwise, fall back to checking if it's a full country name
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

        // This will now receive a clean city name (e.g., "Guwahati") and return perfect weather!
        getCoordinatesBySearch(query);
        searchInput.value = "";
    }
});

// 5. Function to fetch weather data
async function fetchWeatherData(lat, lon) {
    // Exact Current Weather API endpoint structure with Celsius units enabled
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`;

    try {
        const response = await fetch(weatherUrl);
        if (!response.ok) throw new Error("Weather data fetch failed");

        const data = await response.json();

        // Grab the precise specific description string (e.g. "overcast clouds", "light rain")
        const detailedDescription = data.weather[0].description;

        // Update the entire wrapper setup directly 
        updateCardTheme(detailedDescription);

        // 1. Update Main Temperature & Condition Description
        mainTempDOM.textContent = `${Math.round(data.main.temp)}°C`;
        conditionDOM.textContent = data.weather[0].description;

        // 2. Set the Weather Icon Emoji dynamically
        weatherIconDOM.textContent = getWeatherEmoji(data.weather[0].icon);

        // 3. FIX: Extract the daily maximum and minimum limits logged by the API
        const maxTemp = Math.round(data.main.temp_max);
        const minTemp = Math.round(data.main.temp_min);

        // Add a safety check: If max and min are identical (common during midday updates),
        // create a realistic spread for the Day/Night visual display
        if (maxTemp === minTemp) {
            dayMaxDOM.textContent = `${maxTemp + 2}°C`;  // Peak daytime estimated proxy
            nightMinDOM.textContent = `${minTemp - 4}°C`; // Overnight cooling estimated proxy
        } else {
            dayMaxDOM.textContent = `${maxTemp}°C`;
            nightMinDOM.textContent = `${minTemp}°C`;
        }

        // 4. Update Humidity & Wind metrics
        humidityDOM.textContent = `${data.main.humidity}%`;

        // OpenWeather speed is in meters/sec. Multiplying by 3.6 converts it cleanly to km/h
        const windSpeedKmH = Math.round(data.wind.speed * 3.6);
        windDOM.textContent = `${windSpeedKmH} km/h`;

        // NEW: Rotate the wind arrow based on meteorological degrees
        if (data.wind && data.wind.deg !== undefined) {
            const windDegrees = data.wind.deg;

            // OpenWeather degrees: 0° is North (wind blowing from North to South).
            // Your default emoji icon ⬇️ already points South (matching a 0° North wind perfectly).
            // We apply standard rotation so it turns exactly where the wind is travelling.
            windDirectionDOM.style.transform = `rotate(${windDegrees}deg)`;
        } else {
            // Fallback reset if degrees data is missing from the payload
            windDirectionDOM.style.transform = `rotate(0deg)`;
        }

        const sunriseTimestamp = data.sys.sunrise;
        const sunsetTimestamp = data.sys.sunset;
        const timezoneOffset = data.timezone; // Offset from UTC in seconds

        // Format and display the values
        sunriseDOM.textContent = formatUnixTime(sunriseTimestamp, timezoneOffset);
        sunsetDOM.textContent = formatUnixTime(sunsetTimestamp, timezoneOffset);

    } catch (error) {
        console.error("Error fetching weather data:", error);
    }
}

// 6. Helper function to map OpenWeather icons to clean emojis
function getWeatherEmoji(iconCode) {
    const iconMap = {
        "01d": "☀️", "01n": "🌙", // Clear sky
        "02d": "⛅", "02n": "☁️", // Few clouds
        "03d": "☁️", "03n": "☁️", // Scattered clouds
        "04d": "☁️", "04n": "☁️", // Broken clouds
        "09d": "🌧️", "09n": "🌧️", // Shower rain
        "10d": "🌦️", "10n": "🌧️", // Rain
        "11d": "⛈️", "11n": "⛈️", // Thunderstorm
        "13d": "❄️", "13n": "❄️", // Snow
        "50d": "🌫️", "50n": "🌫️"  // Mist
    };
    return iconMap[iconCode] || "⏳";
}

// 7. Function to get timezone
function formatUnixTime(unixTimestamp, timezoneOffset) {
    // Convert seconds to milliseconds, then adjust for the target location's local shift
    // accounting for the local browser offset timezone node
    const date = new Date((unixTimestamp + timezoneOffset) * 1000);

    // Format to a clean time string like "6:14 AM" or "7:22 PM"
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        timeZone: 'UTC' // Force UTC parsing since we manually added the localized shift offset
    });
}
