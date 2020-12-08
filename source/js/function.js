const getWeatherData = async () => {
  try {
    const address = getElementID("inputSearch").value;

    /* Get geocode */
    const geocode = await getGeocode(address);
    updateLocation(geocode);
    const { lat, lng } = geocode.geometry.location;
    const coordinates = { lat, lng };

    /* Update time */
    const time = await updateTime(coordinates.lat, coordinates.lng);
    const date = new Date(time.date_time_txt);
    const minute = String(date.getMinutes()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    getElementID("updateTime").innerHTML = `${changeDate(
      date.getDay()
    )}, <span>${hour}:${minute}</span>`;

    /* Update time's described image */
    if (hour >= 6 && hour < 15) {
      getElementID(
        "locationName"
      ).style.background = `url("./assets/img/day-sky.jpg") no-repeat center`;
      getElementID("locationName").style.backgroundSize = "cover";
    } else if (hour >= 15 && hour < 18) {
      getElementID(
        "locationName"
      ).style.background = `url("./assets/img/afternoon-sky.jpg") no-repeat center`;
      getElementID("locationName").style.backgroundSize = "cover";
    } else {
      getElementID(
        "locationName"
      ).style.background = `url("./assets/img/night-sky.jpg") no-repeat center`;
      getElementID("locationName").style.backgroundSize = "cover";
    }

    /* Update air quality */
    const air = await getAirQuality(coordinates.lat, coordinates.lng);
    getElementID("airQuality").innerHTML = air;
    getElementID(
      "percentage__circle__air"
    ).style.transform = `translateX(-50%) translateY(-${(air / 300) * 200}%)`;
    if (air >= 51 && air <= 100) {
      getElementID(
        "airEvaluate"
      ).innerHTML = `Normal<img class="img-fluid" src="./assets/img/svg/normal.svg" alt="emoji">`;
    } else if (air < 51) {
      getElementID(
        "airEvaluate"
      ).innerHTML = `Healthy<img class="img-fluid" src="./assets/img/svg/healthy.svg" alt="emoji">`;
    } else {
      getElementID(
        "airEvaluate"
      ).innerHTML = `Unhealthy<img class="img-fluid" src="./assets/img/svg/unhealthy.svg" alt="emoji">`;
    }

    /* Get weather data */
    const weatherData = await getWeather(coordinates.lat, coordinates.lng);
    // console.log(weatherData);
    getCurrentWeather(weatherData.currently);
    getTodayWeather(weatherData);
    getDailyWeather(weatherData);
    updateHourlyWeather(weatherData);
  } catch (err) {
    console.log(err);
  }
};

const getGeocode = (address) => {
  return axios({
    url: `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDBunJ4GXNEC3KJlpoGJO-iB--CjPv4o-s&address=${address}&language=en`,
    method: "GET",
  })
    .then((res) => {
      return res.data.results[0];
    })
    .catch((err) => console.log(err));
};

const getAddress = (lat, lng) => {
  return axios({
    url: `https://maps.googleapis.com/maps/api/geocode/json?key=AIzaSyDBunJ4GXNEC3KJlpoGJO-iB--CjPv4o-s&latlng=${lat},${lng}&language=en`,
    method: "GET",
  })
    .then((res) => {
      return res.data.results[0];
    })
    .catch((err) => console.log(err));
};

const updateLocation = (addressArray) => {
  const length = addressArray.address_components.length;
  let address = "";
  if (length >= 3) {
    address = `
      ${addressArray.address_components[length - 3].short_name}, ${
      addressArray.address_components[length - 2].short_name
    }, ${addressArray.address_components[length - 1].short_name}
      `;
  } else {
    address = addressArray.formatted_address;
  }

  getElementID("locationName").innerHTML = address;
};

const getWeather = (lat, lng) => {
  return axios({
    url: `https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/7bbecca28cbc31d7c6739e70baa64e46/${lat},${lng}`,
    method: "GET",
  })
    .then((res) => {
      // console.log(res);
      return res.data;
    })
    .catch((err) => {
      alert(err);
      console.log(err);
    });
};

const updateTime = (lat, lng) => {
  return (date = axios({
    url: `https://api.ipgeolocation.io/timezone?apiKey=12cb339cefaf441db0055c2eea3e8a8e&lat=${lat}&long=${lng}&lang=en`,
    method: "GET",
  })
    .then((res) => {
      return res.data;
    })
    .catch((err) => console.log(err)));
};

const changeDate = (date) => {
  switch (date) {
    case 0: {
      return "Sunday";
    }
    case 1: {
      return "Monday";
    }
    case 2: {
      return "Tuesday";
    }
    case 3: {
      return "Wednesday";
    }
    case 4: {
      return "Thursday";
    }
    case 5: {
      return "Friday";
    }
    case 6: {
      return "Saturday";
    }
    default:
      return "";
  }
};

const getCurrentWeather = (res) => {
  /* Update temperature */
  let temperature = res.temperature;
  if (typeTemperature) {
    getElementID("currentTemp").firstChild.nodeValue = (
      (temperature - 32) /
      1.8
    ).toFixed(0);
  } else {
    getElementID("currentTemp").firstChild.nodeValue = temperature.toFixed(0);
  }

  /* Update current weather icon */
  getElementID("currentIcon").setAttribute(
    "src",
    `./assets/img/svg/${res.icon}.svg`
  );

  /* Update feature state */
  getElementID(
    "featureState1"
  ).innerHTML = `<img src="./assets/img/svg/${res.icon}.svg" alt="weather-icon">${res.summary}`;

  switch (res.precipType) {
    case "rain": {
      getElementID(
        "featureState2"
      ).innerHTML = `<img src="./assets/img/svg/${res.precipType}.svg" alt="weather-icon">Type: Rain`;
      break;
    }
    case "sleet": {
      getElementID(
        "featureState2"
      ).innerHTML = `<img src="./assets/img/svg/${res.precipType}.svg" alt="weather-icon">Type: Sleet`;
      break;
    }
    case "hail": {
      getElementID(
        "featureState2"
      ).innerHTML = `<img src="./assets/img/svg/${res.precipType}.svg" alt="weather-icon">Type: Hail`;
      break;
    }
    default: {
      getElementID(
        "featureState2"
      ).innerHTML = `<img src="./assets/img/svg/rain.svg" alt="weather-icon">No rain`;
    }
  }
};

const getTodayWeather = (res) => {
  const today = res.daily.data[0];

  /* Update UV index */
  getElementID("uvToday").innerHTML = today.uvIndex;
  const rotateMeterDeg = (today.uvIndex / 15) * 180;
  queryElement(".uv__meter").style.transform = `rotate(${rotateMeterDeg}deg)`;

  /* Update win status */
  getElementID("windVelocity").firstChild.nodeValue = today.windSpeed.toFixed(
    2
  );
  getElementID("windDirection").lastChild.nodeValue = `${detectWindDirection(
    today.windBearing
  )}`;
  queryElement("#windDirection i").style.transform = `rotate(${
    today.windBearing - 180
  }deg)`;

  /* Update sunrise sunset time */
  // const sunrise = getLocalTime(today.sunriseTime, res.offset, 7);
  const sunrise = convertTime(today.sunriseTime, res.offset);
  getElementID("sunriseTime").innerHTML = `${String(sunrise.hour).padStart(
    2,
    "0"
  )}:${String(sunrise.min).padStart(2, "0")} AM`;

  const sunset = convertTime(today.sunsetTime, res.offset);
  getElementID("sunsetTime").innerHTML = `${String(sunset.hour - 12).padStart(
    2,
    "0"
  )}:${String(sunset.min).padStart(2, "0")} PM`;

  /* Update humidity */
  const humidity = today.humidity * 100;
  getElementID("humidity").firstChild.nodeValue = humidity.toFixed(0);
  getElementID(
    "percentage__circle__hud"
  ).style.transform = `translateX(-50%) translateY(-${humidity * 2}%)`;
  if (humidity >= 40 && humidity <= 55) {
    getElementID(
      "humidityEvaluate"
    ).innerHTML = `Normal<img class="img-fluid" src="./assets/img/svg/normal.svg" alt="emoji">`;
  } else if (humidity > 55 && humidity < 80) {
    getElementID(
      "humidityEvaluate"
    ).innerHTML = `Healthy<img class="img-fluid" src="./assets/img/svg/healthy.svg" alt="emoji">`;
  } else {
    getElementID(
      "humidityEvaluate"
    ).innerHTML = `Unhealthy<img class="img-fluid" src="./assets/img/svg/unhealthy.svg" alt="emoji">`;
  }
  /* Update visibility */
  const visibility = today.visibility;
  getElementID("visibility").firstChild.nodeValue = visibility.toFixed(1);
  if (visibility >= 5 && visibility <= 8) {
    getElementID(
      "visibilityEvaluate"
    ).innerHTML = `Average<img class="img-fluid" src="./assets/img/svg/average.svg" alt="emoji">`;
  } else if (visibility > 8) {
    getElementID(
      "visibilityEvaluate"
    ).innerHTML = `Good<img class="img-fluid" src="./assets/img/svg/good.svg" alt="emoji">`;
  } else {
    getElementID(
      "visibilityEvaluate"
    ).innerHTML = `Bad<img class="img-fluid" src="./assets/img/svg/bad.svg" alt="emoji">`;
  }
};

const getAirQuality = (lat, lng) => {
  return axios({
    url: `https://cors-anywhere.herokuapp.com/https://api.airvisual.com/v2/nearest_city?lat=${lat}&lon=${lng}&key=9dca3732-a263-4d54-ab01-f1158281e7cd`,
    method: "GET",
  })
    .then((res) => {
      return res.data.data.current.pollution.aqius;
    })
    .catch((err) => {
      console.log(err);
    });
};

const detectWindDirection = (angle) => {
  if (angle >= 348.75 || angle < 11.25) {
    return "N";
  } else if (angle >= 11.25 && angle < 33.75) {
    return "NNE";
  } else if (angle >= 33.75 && angle < 56.25) {
    return "NE";
  } else if (angle >= 56.25 && angle < 78.75) {
    return "ENE";
  } else if (angle >= 78.75 && angle < 101.25) {
    return "E";
  } else if (angle >= 101.25 && angle < 123.75) {
    return "ESE";
  } else if (angle >= 123.75 && angle < 146.25) {
    return "SE";
  } else if (angle >= 146.25 && angle < 168.75) {
    return "SSE";
  } else if (angle >= 168.75 && angle < 191.25) {
    return "S";
  } else if (angle >= 191.25 && angle < 213.75) {
    return "SSW";
  } else if (angle >= 213.75 && angle < 236.25) {
    return "SW";
  } else if (angle >= 236.25 && angle < 258.75) {
    return "WSW";
  } else if (angle >= 258.75 && angle < 281.25) {
    return "W";
  } else if (angle >= 281.25 && angle < 303.75) {
    return "WNW";
  } else if (angle >= 303.75 && angle < 326.25) {
    return "NW";
  } else if (angle >= 326.25 && angle < 348.75) {
    return "NNW";
  }
};

const changeTemperature = (typeTemperature) => {
  let temp = document.querySelectorAll(".temperature__type");
  if (typeTemperature) {
    temp.forEach((element) => {
      element.firstChild.nodeValue = (
        (element.firstChild.nodeValue - 32) /
        1.8
      ).toFixed(0);
    });
    getElementID("temperature__sign").innerHTML = "°C";
  } else {
    temp.forEach((element) => {
      element.firstChild.nodeValue = (
        element.firstChild.nodeValue * 1.8 +
        32
      ).toFixed(0);
    });
    getElementID("temperature__sign").innerHTML = "°F";
  }
};

const getDailyWeather = (res) => {
  const dailyWeather = res.daily.data;
  let weekDay = document.querySelectorAll(
    ".weather__week__detail .weather__card"
  );
  let weekDayXS = document.querySelectorAll(
    ".weather__week__slide .weather__card"
  );
  for (let i = 0; i < weekDay.length; i++) {
    let maxTemp = dailyWeather[i].temperatureMax;
    let minTemp = dailyWeather[i].temperatureMin;
    if (typeTemperature) {
      maxTemp = (maxTemp - 32) / 1.8;
      minTemp = (minTemp - 32) / 1.8;
    }
    const date = convertTime(dailyWeather[i].time, res.offset);
    const day = changeDate(date.day).slice(0, 3);
    updateWeekDayWeather(
      weekDay[i],
      maxTemp.toFixed(0),
      minTemp.toFixed(0),
      dailyWeather[i].icon,
      day
    );
  }
  for (let i = 0; i < weekDayXS.length; i++) {
    let maxTemp = dailyWeather[i].temperatureMax;
    let minTemp = dailyWeather[i].temperatureMin;
    if (typeTemperature) {
      maxTemp = (maxTemp - 32) / 1.8;
      minTemp = (minTemp - 32) / 1.8;
    }
    const date = convertTime(dailyWeather[i].time, res.offset);
    const day = changeDate(date.day).slice(0, 3);
    updateWeekDayWeather(
      weekDayXS[i],
      maxTemp.toFixed(0),
      minTemp.toFixed(0),
      dailyWeather[i].icon,
      day
    );
  }
  queryElement("#today h4").innerHTML = "Today";
  queryElement("#today__xs h4").innerHTML = "Today";
};

const updateWeekDayWeather = (element, maxTemp, minTemp, icon, day) => {
  element.innerHTML = `
    <h4>${day}</h4>
    <img class="img-fluid" src="./assets/img/svg/${icon}.svg" alt="weather-icon">
    <p class="temperature__type">${maxTemp}<span>°</span> <span class="temperature__type">${minTemp}<span>°</span></span></p>
  `;
};

/* Get sunrise, sunset time matched to timezone manually */
const getLocalTime = (localTime, timezoneOffset, currentTZ) => {
  const date = new Date(localTime * 1000);
  const dateArr = date.toString().split(" ");
  const timeArr = dateArr[4].split(":");
  let localHour = Number(timeArr[0]) - currentTZ + timezoneOffset;
  localHour = localHour >= 24 ? localHour - 24 : localHour;
  localHour = localHour <= 0 ? 24 + localHour : localHour;
  const time = { hour: localHour, min: timeArr[1] };
  return time;
};

/* Moment js - convert time to another timezone */
const convertTime = (unixTime, timezoneOffset) => {
  const time = moment.unix(unixTime);
  const utcTime = moment.utc(time.format());
  const localTime = utcTime.add(timezoneOffset, "hours");
  const hour = localTime.hour();
  const min = localTime.minute();
  const day = localTime.day();
  return { hour: hour, min: min, day: day };
};

/* Update hourly weather data */
const updateTodayCardTemperature = (array, res) => {
  let data = res.hourly.data;
  for (let i = 0; i < array.length; i++) {
    let temp = data[i].temperature;
    if (typeTemperature) {
      temp = (temp - 32) / 1.8;
    }
    const time = convertTime(data[i].time, res.offset);
    let hour = "";
    if (i === 0) {
      hour = "Now";
    } else {
      hour = String(time.hour);
    }
    array[i].innerHTML = `
    <h4>${hour.padStart(2, "0")}</h4>
    <img class="img-fluid" src="./assets/img/svg/${
      data[i].icon
    }.svg" alt="weather-icon">
    <p class="temperature__type">${temp.toFixed(
      0
    )}<span class="degree">°</span></p>
  `;
  }
};
const updateHourlyWeather = (res) => {
  let todaySlide = document.querySelectorAll("#todaySlide .weather__card");
  updateTodayCardTemperature(todaySlide, res);
};
