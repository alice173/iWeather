const apiKey = "7ed95d45757d80e19ad8d9d6c951a2aa";
const weatherContainer = document.createElement("div");
document.body.appendChild(weatherContainer);

// weather components

const displayWeatherData = (data) => {
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

  weatherContainer.innerHTML = `
    <h2>Weather in ${data.name}, on ${dayName} the ${formattedDate}</h2>
    <p>Weather: ${data.weather[0].description}</p>
    <p>High of Day: ${(data.main.temp - 273.15).toFixed(0)}°C</p>
    <p>Low of Day: ${(data.main.temp_min - 273.15).toFixed(0)}°C</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
    <p>Precipitation: ${precipitation} mm</p>
  `;
};

const fetchWeatherData = (url) => {
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log("Fetched data:", data); // Log fetched data
      displayWeatherData(data);
    })
    .catch((error) => {
      console.error("Error fetching the weather data:", error);
    });
};

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

const displayForecast = (forecast) => {
  const list = document.getElementById("forecast-list");
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
        <p>${day.day}</p>
        <p>${day.date}</p>
      </div>
      <div>
        <div class="7day_forecast">
            <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.weather} icon" />
            <p>${day.weather}</p>
        </div>
        <div class="7day_forecast">
            <i class="fas fa-thermometer-half" aria-label="average temperature"></i>
            <p>${day.avgTemp}°C</p>
        </div>
        <div class="7day_forecast">
            <i class="fa-solid fa-wind" aria-label="wind speed"></i>
            <p>${day.windSpeed}</p>
        </div>
        <div class="7day_forecast">
            <i class="fa-solid fa-droplet" aria-label="precipitation"></i>
            <p>${day.precipitation}</p>
        </div>
        <div class="7day_forecast">
            <i class="fa-regular fa-moon" aria-label="minimum temperature"></i>
            <p>${day.minTemp}°C</p>
        </div>
      </div>`;
    list.appendChild(listItem);
  });
};

// Ensure you have an element with id 'forecast-list' in your HTML
// <ul id="forecast-list"></ul>

// Add event listeners for search and current location buttons
const searchInput = document.createElement("input");
searchInput.type = "text";
searchInput.placeholder = "Enter location";
document.body.appendChild(searchInput);

const searchButton = document.createElement("button");
searchButton.textContent = "Search";
document.body.appendChild(searchButton);

const currentLocationButton = document.createElement("button");
currentLocationButton.textContent = "Use Current Location";
document.body.appendChild(currentLocationButton);

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

const suggestionsContainer = document.createElement("div");
suggestionsContainer.style.position = "absolute";
suggestionsContainer.style.border = "1px solid #ccc";
suggestionsContainer.style.backgroundColor = "#fff";
suggestionsContainer.style.zIndex = "1000";
suggestionsContainer.style.display = "none";
document.body.appendChild(suggestionsContainer);

const fetchSuggestions = async (query) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${apiKey}`
    );
    const data = await response.json();
    if (data.list) {
      return data.list.map((city) => city.name);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    return [];
  }
};

searchInput.addEventListener("input", async () => {
  const query = searchInput.value;

  if (query.length < 3) {
    suggestionsContainer.style.display = "none";
    return;
  }

  const suggestions = await fetchSuggestions(query);
  displaySuggestions(suggestions);
});

const displaySuggestions = (suggestions) => {
  suggestionsContainer.innerHTML = "";
  if (suggestions.length > 0) {
    suggestionsContainer.style.display = "block";
    suggestionsContainer.style.top = `${
      searchInput.offsetTop + searchInput.offsetHeight
    }px`;
    suggestionsContainer.style.left = `${searchInput.offsetLeft}px`;
    suggestionsContainer.style.width = `${searchInput.offsetWidth}px`;

    suggestions.forEach((suggestion) => {
      const suggestionItem = document.createElement("div");
      suggestionItem.textContent = suggestion;
      suggestionItem.style.padding = "8px";
      suggestionItem.style.cursor = "pointer";
      suggestionItem.addEventListener("click", () => {
        searchInput.value = suggestion;
        suggestionsContainer.style.display = "none";
      });
      suggestionsContainer.appendChild(suggestionItem);
    });
  } else {
    suggestionsContainer.style.display = "none";
  }
};

document.addEventListener("click", (e) => {
  if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
    suggestionsContainer.style.display = "none";
  }
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});
