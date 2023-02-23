// fetch data from API link


fetch("http://localhost:5000/allweatherdata")
  .then((data) => data.text())
  .then((data)=> data.replace(/�/g, "°"))
  .then((data2)=> JSON.parse(data2))
  .then((result) => {
    let jsonData ={};
    for (const e of result) {
      jsonData[e.cityName.toLowerCase()]=e;
    }
    console.log(jsonData);
    let dataObject = new weatherData(jsonData);
    dataObject.weatherDatas();
    dataObject.weather();
    dataObject.selectCitiesBasedOnWeather();
    dataObject.onclickFunc1();
    dataObject.print12Cities("continent");
    console.log(dataObject)
    setInterval(dataObject.timeFormart.bind(dataObject,dataObject.selectedCity), 1000);
  });

  // window.setTimeout(function () {
  //     window.location.reload();
  // }, 60000);
/**
 * @description class that has a constructur function and methods
 * @class weatherData
 */
class weatherData {
  constructor(data) {
    this.weatherData = data;
    this.keys = Object.keys(this.weatherData);
    this.weatherString;
    this.sunnyCities = {};
    this.winterCities = {};
    this.rainyCities = {};
    this.countNum = 3;
    this.contVar = false;
    this.tempVar = false;
    this.tempData, this.contData;
    this.timeZoneCity = [];
    this.selectedCity="anadyr";
  }

  /**
   * @description this display the drop down options and has event listeners for buttons
   * @memberof weatherData
   */
  weatherDatas() {
    let option = ``;
    for (let index = 0; index < this.keys.length; index++) {
      option += `<option value=${this.keys[index].charAt(0).toUpperCase() + this.keys[index].slice(1)}></option>`;
    }
    document.querySelector("#city_name").innerHTML = option;
    document
      .getElementById("city")
      .addEventListener("change", this.weather.bind(this));
    document
      .getElementById("sunny")
      .addEventListener("click", this.onclickFunc1.bind(this));
    document
      .getElementById("winter")
      .addEventListener("click", this.onclick_func2.bind(this));
    document
      .getElementById("rainy")
      .addEventListener("click", this.onclick_func3.bind(this));
    document
      .getElementById("top_cities_num")
      .addEventListener("input", this.displayTopCity.bind(this));
    document
      .getElementById("left_button")
      .addEventListener("click", this.moveLeft.bind(this));
    document
      .getElementById("right_button")
      .addEventListener("click", this.moveRight.bind(this));
    document
      .getElementById("print_based_continent")
      .addEventListener("click", this.print12Cities.bind(this, "continent"));
    document
      .getElementById("print_based_temperature")
      .addEventListener("click", this.print12Cities.bind(this, "temperature"));
  }

  /**
   * @description this function display all the elements in the top section
   * @memberof weatherData
   */
  weather() {
    this.selectedCity = document.getElementById("city").value.toLowerCase();
    let keysCities = this.keys;
    for(let index=0;index<keysCities.length;index++){
      keysCities[index] = keysCities[index].toLowerCase();
    }
    if (!keysCities.includes(this.selectedCity.toLowerCase())) {
      document.querySelector("#temp_c").innerHTML = "Nil";
      document.querySelector("#humidity").innerHTML = "Nil";
      document.querySelector("#faren_f").innerHTML = "Nil";
      document.querySelector("#preci").innerHTML = "Nil";
      document.querySelector("#date").innerHTML = "Nil";
      document.querySelector("#city_icon").src =
        "/General_Images_&_Icons/none.png";
      document.getElementById("time").innerHTML = "Nil";
      document.getElementById("am_pm_state").style.visibility = "hidden";
      this.change_data();
    } else {
      document.getElementById("am_pm_state").style.visibility = "visible";
      document.getElementById("city").style.backgroundColor =
        "rgba(0, 0, 0, 0.5)";
      let temperature = this.weatherData[this.selectedCity].temperature;
      let humidity = this.weatherData[this.selectedCity].humidity;
      let farenheit = Math.round(
        parseInt(this.weatherData[this.selectedCity].temperature) * (9 / 5) + 32
      );
      let precipitation = this.weatherData[this.selectedCity].precipitation;
      let dateTime = this.weatherData[this.selectedCity].dateAndTime;
      let dateTimeArray = dateTime.split(", ");
      let date = dateTimeArray[0];
      let newDate = this.dateFormat(date);

      document.querySelector("#temp_c").innerHTML = temperature;
      document.querySelector("#humidity").innerHTML = humidity;
      document.querySelector("#faren_f").innerHTML = farenheit + " F";
      document.querySelector("#preci").innerHTML = precipitation;
      document.querySelector("#date").innerHTML = newDate;
      document.querySelector(
        "#city_icon"
      ).src = `/Icons_for_cities/${this.selectedCity}.svg`;
      this.weatherIcon(this.selectedCity);
      this.timeFormart();
      this.nextFiveTemperature(this.selectedCity);
    }
  }
  /**
   * @description change all the left part of top section to nil when no city is selected
   * @memberof weatherData
   */
  change_data() {
    let arrTemperature = ``;
    let arrWeather = ``;
    let arrNextFiveHours = ``;
    for (let iterator = 0; iterator < iterator; i++) {
      arrTemperature += `<span><p id="weather_next1">Nil</p></span>`;
      arrWeather += `<span><img id="weather_icon1" src="/General_Images_&_Icons/none.png" /></span><span></span>`;
      arrNextFiveHours += `<span><p id="now">Nil</p></span><span></span>`;
    }
    document.getElementById("grid-item-3_row1_list4").innerHTML = arrTemperature;
    document.getElementById("grid-item-3_row1_list3").innerHTML = arrWeather;
    document.getElementById("grid-item-3_row1_list1").innerHTML = arrNextFiveHours;
    document.getElementById("city").style.backgroundColor = "#c94c4c";
  }
  /**
   * @description format the time fetched from API and place pmState and amState image 
   * @memberof weatherData
   */
  timeFormart() {
    var city = this.selectedCity;
    let currentTime = new Date().toLocaleString("en-US", {
      timeZone: this.weatherData[city].timeZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
    let mornEven = parseInt(currentTime.slice(0, 2)) >= 12 ? "pmState" : "amState";
    document.getElementById("time").innerHTML = currentTime.split(" ")[0];
    document.getElementById(
      "am_pm_state"
    ).src = `/General_Images_&_Icons/${mornEven}.svg`;
    this.nextFiveHour(currentTime);
  }

  /**
   * @description function to format date based on the required format
   * @param {string} date
   * @return {string} newDate in this format (day-month(first 3letter)-year)
   * @memberof weatherData
   */
  dateFormat(date) {
    let arr = date.split("/");
    let arrayMonth = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    let newDate = arr[1] + "-" + arrayMonth[parseInt(arr[0])] + "-" + arr[2];
    return newDate;
  }

  /**
   * @description function is a async function used to get next 5 temperature of the city selected
   * @param {string} city selected in drop down option 
   * @memberof weatherData
   */
  async nextFiveTemperature(city) {
    let value = await fetch(`http://localhost:5000/citydata/${city.charAt(0).toUpperCase()+city.slice(1)}`)
    .then(data => data.json())
    let nxt = await fetch('http://localhost:5000/next5hrs',{
      method:"POST",
      headers:{
        "Content-type":"application/json",
      },
      body:JSON.stringify({
        ...value,
        "hours":5
      })
    })
    .then((nxt) => nxt.text())
  .then((nxt)=> nxt.replace(/�/g, "°"))
    let arr =await JSON.parse(nxt)
    let arr1 = arr.temperature;
    arr1.push(arr1[1]);
    let arrTemperature = ``;
    for (let index = 0; index < arr1.length; index++) {
      arrTemperature += `<span><p id="weather_next1">${arr1[index]}</p></span>`;
    }
    document.getElementById("grid-item-3_row1_list4").innerHTML = arrTemperature;
  }

  /**
   * @description function that gives next five hours from the selected city current time
   * @param {string} currentTime of the selected city
   * @memberof weatherData
   */
  nextFiveHour(currentTime) {
    let arrNextFiveHours = ``;
    let hour = parseInt(currentTime.slice(0, 2));
    arrNextFiveHours += `<span><p id="now">Now</p></span><span></span>`;
    for (let index = 0; index < 5; index++) {
      if (currentTime.split(" ")[1] == "PM") {
        if (hour + 1 + index > 12) {
          arrNextFiveHours += `<span><p id="now">${hour + index + 1 - 12}PM</p></span><span></span>`;
        } else {
          arrNextFiveHours += `<span><p id="now">${hour + index + 1}PM</p></span><span></span>`;
        }
      } else {
        if (hour + 1 + index > 12) {
          arrNextFiveHours += `<span><p id="now">${hour + index + 1 - 12}AM</p></span><span></span>`;
        } else {
          arrNextFiveHours += `<span><p id="now">${hour + index + 1}AM</p></span><span></span>`;
        }
      }
    }
    document.getElementById("grid-item-3_row1_list1").innerHTML =
      arrNextFiveHours;
  }

  /**
   * @description function is an async function that displays the icons based on the temperature
   * @param {string} city s the selected option in drop down
   * @memberof weatherData
   */
  async weatherIcon(city) {
    let value = await fetch(`http://localhost:5000/citydata/${city.charAt(0).toUpperCase()+city.slice(1)}`)
    .then(data => data.json())
    let nxt = await fetch('http://localhost:5000/next5hrs',{
      method:"POST",
      headers:{
        "Content-type":"application/json",
      },
      body:JSON.stringify({
        ...value,
        "hours":5
      })
    })
    let arr =await nxt.json()
     let arr1 = arr.temperature;
    arr1.push(arr1[1]);
    let arrWeather = ``;
    for (let index = 0; index < arr1.length; index++) {
      let temp = arr1[index].split("°")[0];
      if (parseInt(temp) > 29) {
        arrWeather += `<span><img id="weather_icon1" src="/Weather_Icons/sunnyIcon.svg" /></span
              ><span></span>`;
      } else if (parseInt(temp) >= 23 && parseInt(temp) <= 29) {
        arrWeather += `<span><img id="weather_icon1" src="/Weather_Icons/cloudyIcon.svg" /></span
              ><span></span>`;
      } else if (parseInt(temp) >= 18 && parseInt(temp) <= 22) {
        arrWeather += `<span><img id="weather_icon1" src="/Weather_Icons/windyIcon.svg" /></span
              ><span></span>`;
      } else {
        arrWeather += `<span><img id="weather_icon1" src="/Weather_Icons/rainyIcon.svg" /></span
              ><span></span>`;
      }
    }
    document.getElementById("grid-item-3_row1_list3").innerHTML = arrWeather;
  }

  /**
   * @description onclick function for sunny cities to be displayed
   * @memberof weatherData
   */
  onclickFunc1() {
    this.weatherString = "sunny";
    document.getElementById("sunny").style.borderBottom = "2px solid blue";
    document.getElementById("winter").style.borderBottom = "none";
    document.getElementById("rainy").style.borderBottom = "none";
    this.selectCitiesBasedOnWeather();
    this.cityBasedWeatherCardview(
      this.sortFunc(this.sunnyCities),
      "sunnyIcon"
    );
  }

  /**
   * @description onclick function for winter cities to be displayed
   * @memberof weatherData
   */
  onclick_func2() {
    this.weatherString = "winter";
    document.getElementById("sunny").style.borderBottom = "none";
    document.getElementById("winter").style.borderBottom = "2px solid blue";
    document.getElementById("rainy").style.borderBottom = "none";
    this.selectCitiesBasedOnWeather();
    this.cityBasedWeatherCardview(
      this.sortFunc(this.winterCities),
      "snowflakeIcon"
    );
  }

  /**
   * @description onclick function for rainy cities to be displayed
   * @memberof weatherData
   */
  onclick_func3() {
    this.weatherString = "rainy";
    document.getElementById("sunny").style.borderBottom = "none";
    document.getElementById("winter").style.borderBottom = "none";
    document.getElementById("rainy").style.borderBottom = "2px solid blue";
    this.selectCitiesBasedOnWeather();
    this.cityBasedWeatherCardview(
      this.sortFunc(this.rainyCities),
      "rainyIcon"
    );
  }

  /**
   * @description function to sort cities based on the temperature 
   * @param {object} citiesData is the citynames classified based on the weather
   * @return {object} return cityName object which is sorted based on temperature
   * @memberof weatherData
   */
  sortFunc(citiesData) {
    var citiesData1 = citiesData;
    var cityTemp = new Array();
    cityTemp = Object.values(citiesData1);
    cityTemp.sort(function (a, b) {
      return a - b;
    });
    var cityName = [];
    for (var index = 0; index < cityTemp.length; index++) {
      var cityname = Object.keys(citiesData).find(
        (key) => citiesData1[key] === cityTemp[index]
      );
      cityName.push(cityname);
      delete citiesData1[cityname];
    }
    return cityName;
  }

  /**
   * @description function to classify sunny, winter and rainy cities
   * @memberof weatherData
   */
  selectCitiesBasedOnWeather() {
    for (var index = 0; index < this.keys.length; index++) {
      var t = parseInt(this.weatherData[this.keys[index]].temperature);
      var h = parseInt(this.weatherData[this.keys[index]].humidity);
      var p = parseInt(this.weatherData[this.keys[index]].precipitation);
      if (t > 29 && h < 50 && p >= 50) {
        this.sunnyCities[this.keys[index]] = t;
      }
      if (t >= 20 && t <= 28 && h > 50 && p < 50) {
        this.winterCities[this.keys[index]] = h;
      }
      if (t < 20 && h >= 50) {
        this.rainyCities[this.keys[index]] = p;
      }
    }
  }

  /**
   * @description function to display the card view of the cities based on weather
   * @param {object} weatherCity is an object has cityname(key) and temperature(value) 
   * @param {string} iconWeather is string 
   * @memberof weatherData
   */
  cityBasedWeatherCardview(weatherCity,
    iconWeather) {
    let cityBasedOnWeather = ``;
    this.countNum = document.getElementById("top_cities_num").value;
    for (var index = 0; index < Math.min(this.countNum, weatherCity.length); index++) {
      var currentTime = new Date().toLocaleString("en-US", {
        timeZone: this.weatherData[weatherCity[index]].timeZone,
        timeStyle: "medium",
        hourCycle: "h12",
      });
      currentTime = currentTime.split(" ")[0].split(':');
      let mornEven = parseInt(currentTime.slice(0, 2)) >= 12 ? "PM" : "AM";
      let dateTime = this.weatherData[weatherCity[index]].dateAndTime;
      let dateTimeArray = dateTime.split(", ");
      let date = dateTimeArray[0];
      let newDate = this.dateFormat(date);
      let cityName = weatherCity[index].charAt(0).toUpperCase()+weatherCity[index].slice(1);
      cityBasedOnWeather += `<div class="grid_boxes">
          <div id="city"><p>${cityName}</p></div>
          <div class="weather">
            <img src="/Weather_Icons/${iconWeather}.svg" />&nbsp
            <p>${this.weatherData[weatherCity[index]].temperature}</p>
          </div>
          <div class="weather_items">
            <div class="weather_items_child1">
              <p id="time_city">${ currentTime[0]+":"+currentTime[1]+ " " + mornEven}</p>
              <p id="date_city">${newDate}</p>
            </div>
            <div class="weather_items_child">
              <img src="/Weather_Icons/humidityIcon.svg" />&nbsp
              <p id="city_humidity">${this.weatherData[weatherCity[index]].humidity}</p>
            </div>
            <div class="weather_items_child">
              <img src="/Weather_Icons/precipitationIcon.svg" />&nbsp
              <p id="city_precipitation">${this.weatherData[weatherCity[index]].precipitation}</p>
            </div>
          </div>
          <div class="city_img"><img src="/Icons_for_cities/${weatherCity[index]}.svg"></div>
        </div>`;
    }
    document.querySelector(".grid_items_1").innerHTML = cityBasedOnWeather;
    if (this.countNum <= 4) {
      document.getElementById("left_button").style.visibility = "hidden";
      document.getElementById("right_button").style.visibility = "hidden";
    } else {
      document.getElementById("left_button").style.visibility = "visible";
      document.getElementById("right_button").style.visibility = "visible";
    }
  }

  /**
   * @description function to call inclick functions based on the onclick value
   * @memberof weatherData
   */
  displayTopCity() {
    this.countNum = document.getElementById("top_cities_num").value;
    if (this.weatherString === "sunny") {
      this.onclickFunc1();
    }
    if (this.weatherString === "winter") {
      this.onclick_func2();
    }
    if (this.weatherString === "rainy") {
      this.onclick_func3();
    }
  }

  /**
   * @description function to move the card view of cities to left
   * @memberof weatherData
   */
  moveLeft() {
    document.querySelector(".grid_items_1").scrollBy(365, 0);
  }

  /**
   * @description function to move the card view of cities to right
   * @memberof weatherData
   */  
  moveRight() {
    document.querySelector(".grid_items_1").scrollBy(-365, 0);
  }

  /**
   * @description function to print top 12 cities based on continent or temperature
   * @param {string} item can either continent are temperature
   * @memberof weatherData
   */
  print12Cities(item) {
    this.timeZoneCity = [];
    if (item === "temperature") {
      this.tempVar = !this.tempVar;
      if (this.tempVar) {
        document.getElementById(
          "temp_arrow"
        ).src = `/General_Images_&_Icons/arrowup.svg`;
      } else {
        document.getElementById(
          "temp_arrow"
        ).src = `/General_Images_&_Icons/arrowdown.svg`;
      }
      this.tempData = this.tempVar ? -1 : 1;
    } else {
      this.contVar = !this.contVar;
      if (this.contVar) {
        document.getElementById(
          "con_arrow"
        ).src = `/General_Images_&_Icons/arrowup.svg`;
      } else {
        document.getElementById(
          "con_arrow"
        ).src = `/General_Images_&_Icons/arrowdown.svg`;
      }
      this.contData = this.contVar ? -1 : 1;
    }
    var printFirst12Cities = ``;
    for (var index = 0; index < this.keys.length; index++) {
      this.timeZoneCity.push([
        this.keys[index],
        this.weatherData[this.keys[index]].timeZone.split("/")[0],
        this.weatherData[this.keys[index]].temperature,
      ]);
    }

    this.timeZoneCity = this.timeZoneCity.sort(
      (a, b) => this.contData * a[1].localeCompare(b[1]) ||
        this.tempData * (parseInt(a[2]) - parseInt(b[2]))
    );
    for (var index = 0; index < 12; index++) {
      var currentTime = new Date().toLocaleString("en-US", {
        timeZone: this.weatherData[this.timeZoneCity[index][0]].timeZone,
        timeStyle: "medium",
        hourCycle: "h12",
      });
      currentTime = currentTime.split(" ")[0].split(':');
      let mornEven = parseInt(currentTime.slice(0, 2)) >= 12 ? "PM" : "AM";
      let cityName = this.timeZoneCity[index][0].charAt(0).toUpperCase()+this.timeZoneCity[index][0].slice(1);
      printFirst12Cities += `<div class="box1-ingrid">
        <div id="box1-ingrid_c1">
          <p id="p_1">${this.timeZoneCity[index][1]}</p>
          <p id="p_2">${cityName}, ${currentTime[0] + ":" +currentTime[1] + " " + mornEven}</p>
        </div>
        <div id="box1-ingrid_c2">
          <p id="p2_1">${this.weatherData[this.timeZoneCity[index][0]].temperature}</p>
          <p id="p2_2"><img src="/Weather_Icons/humidityIcon.svg" />${this.weatherData[this.timeZoneCity[index][0]].humidity}</p>
        </div>
      </div>`;
    }
    document.querySelector(".grid_boxes_1").innerHTML = print_first_12_cities;
    console.log(this.time_Zone_city);
  }
}



















