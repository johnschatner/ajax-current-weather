import config from "./config.js";

// Global variables
let apiKey = config; // Use your own OpenWeather API key here!
let requestLocation = new XMLHttpRequest(); // AJAX request
let requestWeather = new XMLHttpRequest(); // AJAX request

// Runs getWeather()
let coords = [59.3293, 18.0686]; // Coordinates for Stockholm, Sweden
getWeather(coords);

// // RUNS ONCE
// Get current weather data for the coords[]
function getWeather(coords, swedishName, lang = "sv") {
  let weatherApiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${apiKey}&lang=${lang}`; // variable holding API call url
  requestWeather.open("GET", weatherApiCall); // Open AJAX request for the weatherApiCAll variable
  requestWeather.send(); // Send AJAX request
  requestWeather.onload = () => {
    if (requestWeather.status === 200) {
      // The current weather in location
      let weatherResponse = JSON.parse(requestWeather.response);
      console.log(weatherResponse);
      // // Print the values
      // Prints the location
      let resultDiv = document.getElementById("result");
      if (swedishName) {
        resultDiv.innerHTML = `<span class="city-header">${swedishName}</span`;
      } else {
        resultDiv.innerHTML = `<span class="city-header">${weatherResponse.name}</span`;
      }
      // Prints the temperature in celsius
      let temps = document.getElementById("temps");
      temps.innerHTML = `
        <span class="bold">${(weatherResponse.main.temp - 273.15).toFixed(
          0
        )}°</span>
        <span class="">${(weatherResponse.main.temp_min - 273.15).toFixed(
          0
        )}°</span>
        `;
      // Prints the weather icon
      let weatherIcon = document.getElementById("weatherIcon");
      weatherIcon.src = `https://openweathermap.org/img/wn/${weatherResponse.weather[0].icon}@2x.png`;
      // Prints the weather description in chosen language (lang)
      let weatherDesc = document.getElementById("weatherDesc");
      weatherDesc.innerHTML = weatherResponse.weather[0].description;
      // Prints the weather rain in mm
      let weatherRain = document.getElementById("weatherRain");
      if (weatherResponse.rain !== undefined) {
        let rain = Object.values(weatherResponse.rain);
        weatherRain.innerHTML = rain[0] + " mm";
      } else {
        weatherRain.innerHTML = "0 mm";
      }
      // Prints the weather wind in m/s
      let weatherWind = document.getElementById("weatherWind");
      weatherWind.innerHTML = `${weatherResponse.wind.speed} m/s`;

      // Prints the sunrise/sunset in local time
      let sunriseSpan = document.getElementById("sysSunrise");
      let sunsetSpan = document.getElementById("sysSunset");
      // Convert unix, UTC to local time
      let secSunrise = weatherResponse.sys.sunrise;
      let secSunset = weatherResponse.sys.sunset;
      let sunriseDate = new Date(secSunrise * 1000);
      let sunsetDate = new Date(secSunset * 1000);
      let sunriseHours = sunriseDate.getHours();
      let sunsetHours = sunsetDate.getHours();
      let sunriseMinutes = sunsetDate.getMinutes();
      let sunsetMinutes = sunsetDate.getMinutes();

      // dateFormatter function a bug where sometimes the date could be printed as
      // 6:3 instead of 6:30. The function checks if the minutes is a single digit
      // add a "0"
      function dateFormatter() {
        function isDoubleDigit(num) {
          return num > 9 && num < 100;
        }
        if (!isDoubleDigit(sunriseMinutes)) {
          sunriseMinutes += "0";
        }
        if (!isDoubleDigit(sunsetMinutes)) {
          sunsetMinutes += "0";
        }
      }
      dateFormatter();

      let formattedSunrise = sunriseHours + ":" + sunriseMinutes;
      let formattedSunset = sunsetHours + ":" + sunsetMinutes;

      // InnerHTML the values
      sunriseSpan.innerHTML = formattedSunrise;
      sunsetSpan.innerHTML = formattedSunset;

      // Forecast Credibility score
      let credibilityScore = document.getElementById("credibilityScore");
      let randNum = Math.floor(Math.random() * 100) + 1;
      if (randNum <= 99) {
        credibilityScore.innerHTML = "Säker";
      } else {
        credibilityScore.innerHTML = "Osäker";
      }
    } else {
      console.log(
        `error ${requestWeather.status} ${requestWeather.statusText} C`
      );
    }
  };
}

// // RUNS WHENEVER BTN CLICK
// Get weather data when button click from <input> value
let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", (e) => {
  e.preventDefault(); // prevents form submission & page reload

  let cityName = document.getElementById("userInputLocation").value; // ex: Helsingborg, London
  let stateCode; // (only for the US)
  let countryCode; // ISO 3166 country codes.
  let limit = 1; // Number of the locations in the API response (up to 5 results can be returned in the API response)
  let geocodingApiCall = `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;

  // GeoCoding API Call
  requestLocation.open("GET", geocodingApiCall);
  requestLocation.send();
  requestLocation.onload = () => {
    if (requestLocation.status === 200) {
      // Run following if API call is successful
      let geoCoding = JSON.parse(requestLocation.response)[0];
      console.log(geoCoding);

      // Weather API Call
      let coords = []; // Create empty array
      coords.push(geoCoding.lat); // Add latitude to coords[0]
      coords.push(geoCoding.lon); // Add longitude to coords[1]
      let weatherApiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${apiKey}`;

      getWeather(coords, geoCoding.local_names.sv); // get weather data for the current geocoding data
      setInterval(getWeather, 60000, coords); // refreshes weather data for current city every minute
    } else {
      // Add error message if API call fails
      console.log(
        `error ${requestLocation.status} ${requestLocation.statusText}`
      );
    }
  };
});
