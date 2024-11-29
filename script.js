const apiKey = "7ed95d45757d80e19ad8d9d6c951a2aa";
const lat = 51.4545; // Latitude for Bristol
const lon = -2.5879; // Longitude for Bristol
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    const forecast = processForecastData(data);
    displayForecast(forecast);
    console.log(forecast);
  })
  .catch((error) => {
    console.error("Error fetching the forecast data:", error);
  });

// 5 day forecast
function processForecastData(data) {
  const forecast = [];
  const dailyData = {};

  data.list.forEach((entry) => {
    const date = entry.dt_txt.split(" ")[0];
    if (!dailyData[date]) {
      dailyData[date] = [];
    }
    dailyData[date].push(entry);
  });

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
    .slice(1, 6)
    .forEach((date) => {
      const dayData = dailyData[date];
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

      // Convert date to Date object and get day of the week
      const dateObj = new Date(date);
      const dayName = dayNames[dateObj.getDay()];

      // Extract precipitation information
      const precipitation = dayData[0].rain
        ? dayData[0].rain["3h"]
        : dayData[0].snow
        ? dayData[0].snow["3h"]
        : 0;

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

  return forecast;
}

function displayForecast(forecast) {
  const list = document.getElementById("forecast-list");
  if (!list) {
    console.error("Element with id 'forecast-list' not found");
    return;
  }

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
    console.log(
      `Date: ${day.date}, Avg Temp: ${day.avgTemp} °C, Weather: ${day.weather}`
    );
  });
}
