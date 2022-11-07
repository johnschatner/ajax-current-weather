// Global variables
let apiKey = "f5880d530c725df7497057aab9437145"; // OpenWeather API key
let requestLocation = new XMLHttpRequest(); // AJAX request
let requestWeather = new XMLHttpRequest(); // AJAX request

// Runs getWeather()
let coords = [59.3293, 18.0686]; // Coordinates for Stockholm, Sweden
getWeather(coords);

// Get current weather data for the coords[]
function getWeather(coords) {
  let weatherApiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${apiKey}`; // variable holding API call url
  requestWeather.open("GET", weatherApiCall); // Open AJAX request for the weatherApiCAll variable
  requestWeather.send(); // Send AJAX request
  requestWeather.onload = () => {
    if (requestWeather.status === 200) {
      // The current weather in location
      let weatherResponse = JSON.parse(requestWeather.response);
      console.log(weatherResponse);
      // Print the values
      let resultDiv = document.getElementById("result");
      resultDiv.innerHTML = `<span class="city-header">${weatherResponse.name}</span`;
      let temps = document.getElementById("temps");
      temps.innerHTML = `
        <span class="bold">${(weatherResponse.main.temp - 273.15).toFixed(
          0
        )}°</span>
        <span class="">${(weatherResponse.main.temp_min - 273.15).toFixed(
          0
        )}°</span>
        `;
    } else {
      console.log(
        `error ${requestWeather.status} ${requestWeather.statusText} C`
      );
    }
  };
}
// // Backup works with 2 variables (lat, lon)
// function getWeather(lat, lon) {
//   let weatherApiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;
//   requestWeather.open("GET", weatherApiCall);
//   requestWeather.send();
//   requestWeather.onload = () => {
//     if (requestWeather.status === 200) {
//       // The current weather in location
//       let weatherResponse = JSON.parse(requestWeather.response);
//       console.log(weatherResponse);
//       // Print the values
//       let resultDiv = document.getElementById("result");
//       resultDiv.innerHTML = `<span class="city-header">${weatherResponse.name}</span`;
//       let temps = document.getElementById("temps");
//       temps.innerHTML = `
//       <span class="bold">${(weatherResponse.main.temp - 273.15).toFixed(
//         0
//       )}°</span>
//       <span class="">${(weatherResponse.main.temp_min - 273.15).toFixed(
//         0
//       )}°</span>
//       `;
//     } else {
//       console.log(
//         `error ${requestWeather.status} ${requestWeather.statusText} C`
//       );
//     }
//   };
// }

// NOT WORKING /////////////////////////////////////////////////////////////////
//Create GeoCoding function
function getCoords(cityName, limit = 1) {
  let stateCode; // (only for the US)
  let countryCode; // ISO 3166 country codes.
  let geocodingApiCall = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;

  // GeoCoding API Call
  requestLocation.open("GET", geocodingApiCall);
  requestLocation.send();
  requestLocation.onload = () => {
    if (requestLocation.status === 200) {
      let geoCoding = JSON.parse(requestLocation.response)[0];

      // Weather API Call
      let location = [];
      location.push(geoCoding.lat);
      location.push(geoCoding.lon);

      console.log(location);
    } else {
      console.log(
        `error ${requestLocation.status} ${requestLocation.statusText}`
      );
    }
  };
}
getCoords("Helsingborg");
// NOT WORKING //////////////////////////////////////////////////////////////////

// Get weather data when button click from <input> value
let searchBtn = document.getElementById("searchBtn");
searchBtn.addEventListener("click", (e) => {
  let cityName = document.getElementById("userInputLocation").value; // ex: Helsingborg, London
  let stateCode; // (only for the US)
  let countryCode; // ISO 3166 country codes.
  let limit = 1; // Number of the locations in the API response (up to 5 results can be returned in the API response)
  let geocodingApiCall = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;

  // GeoCoding API Call
  requestLocation.open("GET", geocodingApiCall);
  requestLocation.send();
  requestLocation.onload = () => {
    if (requestLocation.status === 200) {
      // Run following if API call is successful
      let geoCoding = JSON.parse(requestLocation.response)[0];
      console.log(geoCoding);
      console.log(
        `The current latitude is ${geoCoding.lat} and longitude ${geoCoding.lon} in ${geoCoding.country}`
      );

      // Weather API Call
      let coords = []; // Create empty array
      coords.push(geoCoding.lat); // Add latitude to coords[0]
      coords.push(geoCoding.lon); // Add longitude to coords[1]
      let weatherApiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${coords[0]}&lon=${coords[1]}&appid=${apiKey}`;

      getWeather(coords); // get weather data for the current geocoding data
      setInterval(getWeather, 60000, coords); // refreshes weather data for current city every minute
    } else {
      // Add error message if API call fails
      console.log(
        `error ${requestLocation.status} ${requestLocation.statusText}`
      );
    }
  };
});
// Backup works with 2 variables (lat, lon)
// // Get weather updates
// let searchBtn = document.getElementById("searchBtn");
// searchBtn.addEventListener("click", (e) => {
//   let cityName = document.getElementById("userInputLocation").value; // ex: Helsingborg, London
//   let stateCode; // (only for the US)
//   let countryCode; // ISO 3166 country codes.
//   let limit = 1; // Number of the locations in the API response (up to 5 results can be returned in the API response)
//   let geocodingApiCall = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`;

//   // GeoCoding API Call
//   requestLocation.open("GET", geocodingApiCall);
//   requestLocation.send();
//   requestLocation.onload = () => {
//     if (requestLocation.status === 200) {
//       let geoCoding = JSON.parse(requestLocation.response)[0];
//       console.log(geoCoding);
//       console.log(
//         `The current latitude is ${geoCoding.lat} and longitude ${geoCoding.lon} in ${geoCoding.country}`
//       );

//       // Weather API Call
//       let lat = geoCoding.lat;
//       let lon = geoCoding.lon;
//       let weatherApiCall = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

//       getWeather(lat, lon);
//     } else {
//       console.log(
//         `error ${requestLocation.status} ${requestLocation.statusText}`
//       );
//     }
//   };
// });
