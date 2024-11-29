const apiKey = "7ed95d45757d80e19ad8d9d6c951a2aa";

// Function to fetch weather data
const fetchWeatherData = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      displayWeatherData(data);
    })
    .catch((error) => {
      console.error("Error fetching the weather data:", error);
    });
};

// Function to display weather data
const displayWeatherData = (data) => {
  const weatherContainer = document.getElementById("weather-container");
  weatherContainer.innerHTML = ""; // Clear previous data

  const precipitation = data.rain
    ? data.rain["1h"]
    : data.snow
    ? data.snow["1h"]
    : 0;
  const date = new Date();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const dayName = dayNames[date.getDay()];
  const day = date.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthName = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const suffix = (day) => {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };
  const formattedDate = `${day}${suffix(day)} of ${monthName} ${year}`;

  const weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

  weatherContainer.innerHTML = `
    <h2>Weather in ${data.name}, on ${dayName} the ${formattedDate}</h2>
    <img src="${weatherIcon}" alt="${data.weather[0].description} icon" />
    <p>Weather: ${data.weather[0].description}</p>
    <p>High of Day: ${(data.main.temp - 273.15).toFixed(0)}°C</p>
    <p>Low of Day: ${(data.main.temp_min - 273.15).toFixed(0)}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
    <p>Precipitation: ${precipitation} mm</p>
  `;
};

// Function to save favorite location
const saveFavoriteLocation = (location) => {
  const favoriteLocations = JSON.parse(localStorage.getItem("favoriteLocations")) || [];
  if (!favoriteLocations.includes(location)) {
    favoriteLocations.push(location);
    localStorage.setItem("favoriteLocations", JSON.stringify(favoriteLocations));
    updateFavoriteLocationsDropdown();
  }
};

// Function to update favorite locations dropdown
const updateFavoriteLocationsDropdown = () => {
  const favoriteLocations = JSON.parse(localStorage.getItem("favoriteLocations")) || [];
  const favoriteLocationsDropdown = document.getElementById("favorite-locations");
  favoriteLocationsDropdown.innerHTML = ""; // Clear previous items

  favoriteLocations.forEach((location) => {
    const listItem = document.createElement("li");
    listItem.classList.add("dropdown-item");
    listItem.textContent = location;
    listItem.addEventListener("click", () => {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
      fetchWeatherData(url);
    });
    favoriteLocationsDropdown.appendChild(listItem);
  });
};

// Get references to the search input and buttons
const searchInput = document.getElementById("search-input");
const searchButton = document.getElementById("search-button");
const currentLocationButton = document.getElementById("current-location-button");
const saveFavoriteButton = document.getElementById("save-favorite-button");

// Event listener for search input
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const location = searchInput.value;
    if (location) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
      fetchWeatherData(url);
    } else {
      alert("Please enter a location");
    }
  }
});

// Event listener for search button
searchButton.addEventListener("click", () => {
  const location = searchInput.value;
  if (location) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
    fetchWeatherData(url);
  } else {
    alert("Please enter a location");
  }
});

// Event listener for current location button
currentLocationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        fetchWeatherData(url);
      },
      (error) => {
        console.error("Error getting the current location:", error);
      }
    );
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

// Event listener for save favorite button
saveFavoriteButton.addEventListener("click", () => {
  const location = searchInput.value;
  if (location) {
    saveFavoriteLocation(location);
  } else {
    alert("Please enter a location to save");
  }
});

// Update favorite locations dropdown on page load
updateFavoriteLocationsDropdown();