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
    .slice(1, 8)
    .forEach((date) => {
      const dayData = dailyData[date];
      const tempSum = dayData.reduce((sum, entry) => sum + entry.main.temp, 0);
      const avgTemp = tempSum / dayData.length;

      // Convert temperature from Kelvin to Celsius
      const avgTempCelsius = avgTemp - 273.15;

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
        avgTemp: avgTempCelsius.toFixed(2), // Round to 2 decimal places
        weather: dayData[0].weather[0].description,
        icon: dayData[0].weather[0].icon,
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
      <div>
        <p>${day.day}</p>
        <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="${day.weather} icon" />
      </div>
      <div>
        <p>${day.weather}</p>
        <p>${day.avgTemp}°C</p>
        <p>${day.date}</p>
      </div>`;
    list.appendChild(listItem);
    console.log(
      `Date: ${day.date}, Avg Temp: ${day.avgTemp} °C, Weather: ${day.weather}`
    );
  });
}
