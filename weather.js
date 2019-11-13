$(document).ready(function() {
  var cardBodies = document.getElementsByClassName("card-body");
  apiKey = "a35408144a5c190a5dad6b16befef222";
  fiveDayForecast("Chicago");
  currentWeather("Chicago");

  function currentWeather(city) {
    var queryUrl =
      "//api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&units=imperial&APPID=" +
      apiKey;
    $.ajax({
      url: queryUrl,
      method: "GET"
    }).then(function(response) {
      $("#cityName").text(response.name);
      $("#temp").text(`Temperature: ` + response.main.temp + " °F");
      $("#humidity").text(`Humidity: ` + response.main.humidity + "%");
      $("#windSpeed").text(`Wind Speed: ` + response.wind.speed + " MPH");
      // Create UV index URL query
      // Pull coordinates from the returned OBJ and pass coordinates into UV index API call

      var queryUrlUV =
        "//api.openweathermap.org/data/2.5/uvi?appid=" +
        apiKey +
        "&lat=" +
        response.coord.lat +
        "&lon=" +
        response.coord.lon;

      // Create ajax call to UV index URL

      $.ajax({
        url: queryUrlUV,
        method: "GET"
      }).then(function(responseUV) {
        $("#uvIndex").text(responseUV.value);
        console.log(responseUV);
      });
    });
  }

  // Setup call for 5 day forecast

  function fiveDayForecast(city) {
    var queryUrl5day =
      "//api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&units=imperial&appid=" +
      apiKey;
    $.ajax({
      url: queryUrl5day,
      method: "GET"
    }).then(function(response) {
      //console.log(response);
      updateCards(response.list);
    });
  }

  function updateCards(responseObj) {
    //console.log(responseObj);
    console.log(responseObj);
    var dateIndex = 0;

    for (i = 0; i < cardBodies.length; i++) {
      var cardBody = cardBodies[i];
      var weatherObj = responseObj[dateIndex];
      var dateStr = weatherObj.dt_txt.split(" ")[0]; // This splits the datetime string into date and time.

      cardBody.children[0].innerText = dateStr;
      cardBody.children[1].innerText = capitalizeFirstLetter(
        weatherObj.weather[0].description
      );
      cardBody.children[2].innerText =
        "Max: " + weatherObj.main.temp_max + " F";
      cardBody.children[3].innerText =
        "Min: " + weatherObj.main.temp_min + " F";

      dateIndex += 8;
    }
  }

  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  $("#button-addon2").on("click", function() {
    cityName = $("#citySearch").val();
    currentWeather(cityName);
    fiveDayForecast(cityName);
  });
  $("li").on("click", function() {
    cityName = $(this).text();
    currentWeather(cityName);
    fiveDayForecast(cityName);
  });
});
