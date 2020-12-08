const getElementID = (id) => document.getElementById(id);

const queryElement = (element) => document.querySelector(element);

/* UPDATE WHEN SUBMIT */
getElementID("searchLocation").addEventListener("submit", (e) => {
  getWeatherData();
  e.preventDefault();
  getElementID("searchLocation").reset();
});

/* Change tab Today/Week */
const today = getElementID("today");
const week = getElementID("week");
const todaySlide = getElementID("todaySlide");
const weekDayWeather = getElementID("weekDayWeather");
const weekSlide = getElementID("weekSlide");
today.onclick = (e) => {
  setTimeout(() => {
    swiperHour.update();
  }, 1);

  week.classList.remove("active");
  today.classList.add("active");

  todaySlide.classList.add("today__slide--open");
  weekDayWeather.classList.remove("week__detail--open");
  weekSlide.classList.add("week__slide--hide");

  e.preventDefault();
};
week.onclick = (e) => {
  setTimeout(() => {
    swiperDay.update();
  }, 1);

  week.classList.add("active");
  today.classList.remove("active");

  todaySlide.classList.remove("today__slide--open");
  weekDayWeather.classList.add("week__detail--open");
  weekSlide.classList.remove("week__slide--hide");

  e.preventDefault();
};

/* Change temperature */
let typeTemperature = true;
getElementID("celsius").onclick = () => {
  if (typeTemperature) {
    return;
  }
  typeTemperature = true;
  getElementID("fahrenheit").classList.remove("active");
  getElementID("fahrenheit__xs").classList.remove("active");
  getElementID("celsius").classList.add("active");
  getElementID("celsius__xs").classList.add("active");
  changeTemperature(typeTemperature);
};
getElementID("fahrenheit").onclick = () => {
  if (!typeTemperature) {
    return;
  }
  typeTemperature = false;
  getElementID("celsius").classList.remove("active");
  getElementID("celsius__xs").classList.remove("active");
  getElementID("fahrenheit").classList.add("active");
  getElementID("fahrenheit__xs").classList.add("active");
  changeTemperature(typeTemperature);
};
getElementID("celsius__xs").onclick = () => {
  if (typeTemperature) {
    return;
  }
  typeTemperature = true;
  getElementID("fahrenheit__xs").classList.remove("active");
  getElementID("fahrenheit").classList.remove("active");
  getElementID("celsius__xs").classList.add("active");
  getElementID("celsius").classList.add("active");
  changeTemperature(typeTemperature);
};
getElementID("fahrenheit__xs").onclick = () => {
  if (!typeTemperature) {
    return;
  }
  typeTemperature = false;
  getElementID("celsius__xs").classList.remove("active");
  getElementID("celsius").classList.remove("active");
  getElementID("fahrenheit__xs").classList.add("active");
  getElementID("fahrenheit").classList.add("active");
  changeTemperature(typeTemperature);
};

/* Toggle navbar xs */
let scrollOffset = "";
let offset = "";
getElementID("navbar__toggle__button").onclick = () => {
  // Add delete opening effect after toggle navbar
  getElementID("navbar__xs").classList.add("effect");

  getElementID("navbar__xs").classList.toggle("open");

  const offset = scrollOffset;
  scrollOffset = window.scrollY;
  queryElement("body").style.top = `-${scrollOffset}px`;

  queryElement("body").classList.toggle("no-scroll");

  // Scroll to previous location
  window.scrollTo(0, offset);

  setTimeout(() => {
    getElementID("weather").classList.toggle("blur");
  }, 50);

  // Delete delete opening effect after toggle navbar
  setTimeout(() => {
    getElementID("navbar__xs").classList.remove("effect");
  }, 500);
};

/* Fixed navbar XS position */
const windowHeight = window.innerHeight;
getElementID("navbar__xs").style.top = `${windowHeight - 56}px`;
window.onresize = () => {
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  getElementID("navbar__xs").style.top = `${windowHeight - 56}px`;
  if (windowWidth >= 768 && windowWidth < 1200) {
    if (windowHeight > windowWidth) {
      getElementID("today-feature").style.height = "100vh";
      getElementID("weather__detail").style.height = "100vh";
    } else {
      getElementID("today-feature").style.height = "unset";
      getElementID("weather__detail").style.height = "unset";
    }
  } else if (windowWidth >= 1200) {
    if (windowHeight >= 800) {
      getElementID("today-feature").style.height = "100vh";
      getElementID("weather__detail").style.height = "100vh";
    } else {
      getElementID("today-feature").style.height = "unset";
      getElementID("weather__detail").style.height = "unset";
    }
  }
};

/* Toggle theme */
getElementID("darkmode__toggler").onclick = () => {
  queryElement("body").classList.toggle("darkmode");
  getElementID("darkmode__toggler__xs").checked = !getElementID(
    "darkmode__toggler__xs"
  ).checked
    ? true
    : false;
};
getElementID("darkmode__toggler__xs").onclick = () => {
  queryElement("body").classList.toggle("darkmode");
  getElementID("darkmode__toggler").checked = !getElementID("darkmode__toggler")
    .checked
    ? true
    : false;
};

/* GPS */
getElementID("gps").onclick = async () => {
  const coordinates = await new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      const location = navigator.geolocation.getCurrentPosition((position) => {
        resolve(position.coords);
      });
      return location;
    } else {
      reject("GPS is not supported by this browser!");
    }
  })
    .then((res) => {
      return { lat: res.latitude, lng: res.longitude };
    })
    .catch((err) => {
      alert(err);
    });

  try {
    const address = await getAddress(coordinates.lat, coordinates.lng);
    updateLocation(address);

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
    getCurrentWeather(weatherData.currently);
    getTodayWeather(weatherData);
    getDailyWeather(weatherData);
    updateHourlyWeather(weatherData);
  } catch (err) {
    console.log(err);
  }
};
getElementID("gps__xs").onclick = async () => {
  const coordinates = await new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      const location = navigator.geolocation.getCurrentPosition((position) => {
        resolve(position.coords);
      });
      return location;
    } else {
      reject("GPS is not supported by this browser!");
    }
  })
    .then((res) => {
      return { lat: res.latitude, lng: res.longitude };
    })
    .catch((err) => {
      alert(err);
    });

  try {
    const address = await getAddress(coordinates.lat, coordinates.lng);
    updateLocation(address);

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
    getCurrentWeather(weatherData.currently);
    getTodayWeather(weatherData);
    getDailyWeather(weatherData);
    updateHourlyWeather(weatherData);
  } catch (err) {
    console.log(err);
  }
};

/* Generate hourly card */
let todaySlideInner = ``;
for (let i = 0; i < 25; i++) {
  todaySlideInner += `
    <div class="weather__card swiper-slide" id="hour_${i}">
        <h4>00</h4>
        <img class="img-fluid" src="./assets/img/svg/clear-day.svg" alt="weather-icon">
        <p class="temperature__type">15<span class="degree">°</span></p>
    </div>
    `;
}
queryElement("#todaySlide .swiper-wrapper").innerHTML = todaySlideInner;

window.onload = () => {
  getElementID("gps").click();
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  getElementID("navbar__xs").style.top = `${windowHeight - 56}px`;
  if (windowWidth >= 768 && windowWidth < 1200) {
    if (windowHeight > windowWidth) {
      getElementID("today-feature").style.height = "100vh";
      getElementID("weather__detail").style.height = "100vh";
    } else {
      getElementID("today-feature").style.height = "unset";
      getElementID("weather__detail").style.height = "unset";
    }
  } else if (windowWidth >= 1200) {
    if (windowHeight >= 800) {
      getElementID("today-feature").style.height = "100vh";
      getElementID("weather__detail").style.height = "100vh";
    } else {
      getElementID("today-feature").style.height = "unset";
      getElementID("weather__detail").style.height = "unset";
    }
  }
};

/* SWIPER */
let swiperDay = new Swiper(".swiper-container-day", {
  spaceBetween: 20,
  centeredSlides: false,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: "2",
    },
    576: {
      slidesPerView: "3",
    },
    768: {
      slidesPerView: "3",
    },
    992: {
      slidesPerView: "4",
    },
  },
});

let swiperHour = new Swiper(".swiper-container-hour", {
  slidesPerView: "2",
  spaceBetween: 20,
  centeredSlides: false,
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    0: {
      slidesPerView: "2",
    },
    576: {
      slidesPerView: "3",
    },
    660: {
      slidesPerView: "4",
    },
    768: {
      slidesPerView: "3",
    },
    992: {
      slidesPerView: "4",
    },
    1100: {
      slidesPerView: "5",
    },
    1300: {
      slidesPerView: "6",
    },
    1600: {
      slidesPerView: "7",
    },
  },
});

/* Tooltip */
$('[data-toggle="tooltips"]').tooltip();
