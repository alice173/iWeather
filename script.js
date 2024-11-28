const apiKey = "7ed95d45757d80e19ad8d9d6c951a2aa";
const lat = 0; // Replace with actual latitude
const lon = 0; // Replace with actual longitude
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error fetching the forecast data:", error);
  });

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

// Removed duplicate fetchWeatherData function definition

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
const header = document.querySelector("header");
const firstParagraph = document.querySelector("p");

header.insertAdjacentElement("afterend", searchInput);
searchInput.insertAdjacentElement("afterend", searchButton);
searchButton.insertAdjacentElement("afterend", currentLocationButton);
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

fetchWeatherData = (url) => {
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