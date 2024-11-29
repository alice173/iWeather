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

// Function to fetch forecast data
const fetchForecastData = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Forecast data:", data);
      const forecast = processForecastData(data);
      displayForecast(forecast);
    })
    .catch((error) => {
      console.error("Error fetching the forecast data:", error);
    });
};

// Function to process forecast data
const processForecastData = (data) => {
  const forecast = [];
  const dailyData = {};

  data.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(entry);
  });

  console.log("Daily data:", dailyData); // Log dailyData to check its contents

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  Object.keys(dailyData)
    .slice(1, 8)
    .forEach((date) => {
      const dayData = dailyData[date];
      console.log("Day data:", dayData); // Log dayData to check its contents
      const tempSum = dayData.reduce((sum, entry) => sum + entry.main.temp, 0);
      const avgTemp = tempSum / dayData.length;

      // Calculate minimum temperature
      const minTemp = Math.min(...dayData.map((entry) => entry.main.temp_min));

      // Convert temperatures from Kelvin to Celsius
      const avgTempCelsius = avgTemp - 273.15;
      const minTempCelsius = minTemp - 273.15;

      // Extract wind information
      const windSpeed = dayData[0].wind.speed;
      const windDirection = dayData[0].wind.deg;

      // Extract precipitation information
      const precipitation = dayData[0].rain
        ? dayData[0].rain["3h"]
        : dayData[0].snow
        ? dayData[0].snow["3h"]
        : 0;

      // Convert date to Date object and get day of the week
      const dateObj = new Date(date);
      const dayName = dayNames[dateObj.getDay()];

      // Format date as day/month/year
      const formattedDate = `${dateObj.getDate()}/${
        dateObj.getMonth() + 1
      }/${dateObj.getFullYear()}`;

      forecast.push({
        date: formattedDate,
        day: dayName,
        avgTemp: Math.floor(avgTempCelsius),
        minTemp: Math.floor(minTempCelsius),
        weather: dayData[0].weather[0].description,
        icon: dayData[0].weather[0].icon,
        windSpeed: windSpeed.toFixed(2), // Round to 2 decimal places
        windDirection,
        precipitation: precipitation.toFixed(2),
      });
    });

  console.log("Processed forecast data:", forecast); // Log the forecast data
  return forecast;
};

// Function to display forecast data
const displayForecast = (forecast) => {
  const list = document.getElementById("forecast-list");
  const details = document.getElementById("7day-dropdown");
  details.classList.remove("hidden");
  if (!list) {
    console.error("Element with id 'forecast-list' not found");
    return;
  }

  // Clear previous forecast data
  list.innerHTML = "";

  console.log("Displaying forecast data:", forecast); // Log the forecast data

  forecast.forEach((day) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <div class="forecast-day">
        <p class="day">${day.day}</p>
        <p>${day.date}</p>
      </div>
      <div class="day-forecast--wrapper">
        <div class="day-forecast--day">
            <img class="day-forecast--img" src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.weather} icon" />
            <p>${day.weather}</p>
        </div>
        <div class="day-forecast--day">
            <i class="fas fa-thermometer-half" aria-label="average temperature"></i>
            <p>${day.avgTemp}°C</p>
        </div>
        <div class="day-forecast--day">
            <i class="fa-solid fa-wind" aria-label="wind speed"></i>
            <p>${day.windSpeed}</p>
        </div>
        <div class="day-forecast--day">
            <i class="fa-solid fa-droplet" aria-label="precipitation"></i>
            <p>${day.precipitation}</p>
        </div>
        <div class="day-forecast--day">
            <i class="fa-regular fa-moon" aria-label="minimum temperature"></i>
            <p>${day.minTemp}°C</p>
        </div>
      </div>`;
    list.appendChild(listItem);
  });
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
const currentLocationButton = document.getElementById(
  "current-location-button"
);
const saveFavoriteButton = document.getElementById("save-favorite-button");

// Event listener for search input
searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    const location = searchInput.value;
    if (location) {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}`;
      fetchWeatherData(url);

      const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`;
      fetchForecastData(forecastUrl);
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

    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${apiKey}`;
    fetchForecastData(forecastUrl);
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

        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
        fetchForecastData(forecastUrl);
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