const apiKey = "7ed95d45757d80e19ad8d9d6c951a2aa";
const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}`;

fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("Error fetching the forecast data:", error);
  });
