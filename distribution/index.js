const API_KEY = '6d92c0d7e1d91eabc65a0b9d974bdc9c';

// Target the location and date elements
const locationDOM = document.getElementById("current-location");
const dateDOM = document.getElementById("current-date");

// Target the search form and input elements
const searchForm = document.querySelector("form"); 
const searchInput = document.getElementById("city-search");

// Initialize application
function displayCurrentDate() {
    const today = new Date();
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    const formattedDate = today.toLocaleDateString('en-US', options);
    dateDOM.textContent = formattedDate;
}
displayCurrentDate();

// 1. New function to convert lat/lon to City Name
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

// 2. Function to search coordinates by city name
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
            
            // Update UI with the found city details
            if (state) {
                locationDOM.textContent = `${name}, ${state}, ${country}`;
            } else {
                locationDOM.textContent = `${name}, ${country}`;
            }
            
        } else {
            locationDOM.textContent = "Location not found. Try again!";
        }
    } catch (error) {
        console.error("Error searching city:", error);
        locationDOM.textContent = "Error finding location";
    }
}

// 3. Event Listener for Form Submission
searchForm.addEventListener("submit", (event) => {
    // Prevent the default behavior of forms resetting/reloading the browser page
    event.preventDefault(); 
    
    const query = searchInput.value.trim();
    
    if (query) {
        getCoordinatesBySearch(query);
        searchInput.value = ""; // Clear the search bar input field after submission
    }
});

