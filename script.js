const apiKey = "7ed95d45757d80e19ad8d9d6c951a2aa";
const weatherContainer = document.createElement("div");
document.body.appendChild(weatherContainer);

const displayWeatherData = (data) => {
  weatherContainer.innerHTML = `
    <h2>Weather in ${data.name}</h2>
    <p>Temperature: ${(data.main.temp - 273.15).toFixed(0)}°C</p>
    <p>Weather: ${data.weather[0].description}</p>
    <p>Humidity: ${data.main.humidity}%</p>
    <p>Wind Speed: ${data.wind.speed} m/s</p>
  `;
};

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
// Search input and buttons
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
  } else {
    alert("Please enter a location");
  }
});

currentLocationButton.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
      fetchWeatherData(url);
    }, (error) => {
      console.error("Error getting the current location:", error);
    });
  } else {
    alert("Geolocation is not supported by this browser.");
  }
});

const suggestionsContainer = document.createElement("div");
suggestionsContainer.style.position = 'absolute';
suggestionsContainer.style.border = '1px solid #ccc';
suggestionsContainer.style.backgroundColor = '#fff';
suggestionsContainer.style.zIndex = '1000';
suggestionsContainer.style.display = 'none';
document.body.appendChild(suggestionsContainer);

searchInput.addEventListener('input', async () => {
  const query = searchInput.value;

  if (query.length < 3) {
    suggestionsContainer.style.display = 'none';
    return;
  }

  const suggestions = await fetchSuggestions(query);
  displaySuggestions(suggestions);
});

const fetchSuggestions = async (query) => {
  const response = await fetch(`https://api.openweathermap.org/data/2.5/find?q=${query}&type=like&sort=population&cnt=5&appid=${apiKey}`);
  const data = await response.json();
  return data.list.map(city => city.name);
};

const displaySuggestions = (suggestions) => {
  suggestionsContainer.innerHTML = '';
  if (suggestions.length > 0) {
    suggestionsContainer.style.display = 'block';
    suggestionsContainer.style.top = `${searchInput.offsetTop + searchInput.offsetHeight}px`;
    suggestionsContainer.style.left = `${searchInput.offsetLeft}px`;
    suggestionsContainer.style.width = `${searchInput.offsetWidth}px`;

    suggestions.forEach(suggestion => {
      const suggestionItem = document.createElement('div');
      suggestionItem.textContent = suggestion;
      suggestionItem.style.padding = '8px';
      suggestionItem.style.cursor = 'pointer';
      suggestionItem.addEventListener('click', () => {
        searchInput.value = suggestion;
        suggestionsContainer.style.display = 'none';
      });
      suggestionsContainer.appendChild(suggestionItem);
    });
  } else {
    suggestionsContainer.style.display = 'none';
  }
};

document.addEventListener('click', (e) => {
  if (!suggestionsContainer.contains(e.target) && e.target !== searchInput) {
    suggestionsContainer.style.display = 'none';
  }
});

searchInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchButton.click();
  }
});
