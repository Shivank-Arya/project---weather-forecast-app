const API_KEY = '6d92c0d7e1d91eabc65a0b9d974bdc9c';

const locationDOM = document.getElementById("current-location");
const dateDOM = document.getElementById("current-date");

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

