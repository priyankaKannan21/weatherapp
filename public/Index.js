// fetch data from API link


fetch("http://localhost:5000/allweatherdata")
  .then((data) => data.text())
  .then((data)=> data.replace(/�/g, "°"))
  .then((data2)=> JSON.parse(data2))
  .then((result) => {
    let jsonData ={};
    for (const e of result) {
      jsonData[e.cityName]=e;
    }
    console.log(jsonData);
    let data_object = new weather_data(jsonData);
    data_object.weatherdatas();
    data_object.weather();
    data_object.select_cities_based_on_weather();
    data_object.onclick_func1();
    data_object.Print_12_cities("continent");
    console.log(data_object)
    setInterval(data_object.time_formart.bind(data_object,data_object.selected_city), 1000);
  });

  // window.setTimeout(function () {
  //     window.location.reload();
  // }, 60000);
/**
 * @description class that has a constructur function and methods
 * @class weather_data
 */
class weather_data {
  constructor(data) {
    this.weatherdata = data;
    this.keys = Object.keys(this.weatherdata);
    this.weather_string;
    this.sunny_cities = {};
    this.winter_cities = {};
    this.rainy_cities = {};
    this.count_num = 3;
    this.cont_var = false;
    this.temp_var = false;
    this.temp_data, this.cont_data;
    this.time_Zone_city = [];
    this.selected_city="Anadyr";
  }

  /**
   * @description this display the drop down options and has event listeners for buttons
   * @memberof weather_data
   */
  weatherdatas() {
    let option = ``;
    for (let i = 0; i < this.keys.length; i++) {
      option += `<option value=${this.keys[i]}></option>`;
    }
    document.querySelector("#city_name").innerHTML = option;
    document
      .getElementById("city")
      .addEventListener("input", this.weather.bind(this));
    document
      .getElementById("sunny")
      .addEventListener("click", this.onclick_func1.bind(this));
    document
      .getElementById("winter")
      .addEventListener("click", this.onclick_func2.bind(this));
    document
      .getElementById("rainy")
      .addEventListener("click", this.onclick_func3.bind(this));
    document
      .getElementById("top_cities_num")
      .addEventListener("input", this.display_top_city.bind(this));
    document
      .getElementById("left_button")
      .addEventListener("click", this.move_left.bind(this));
    document
      .getElementById("right_button")
      .addEventListener("click", this.move_right.bind(this));
    document
      .getElementById("print_based_continent")
      .addEventListener("click", this.Print_12_cities.bind(this, "continent"));
    document
      .getElementById("print_based_temperature")
      .addEventListener("click", this.Print_12_cities.bind(this, "temperature"));
  }

  /**
   * @description this function display all the elements in the top section
   * @memberof weather_data
   */
  weather() {
    this.selected_city = document.getElementById("city").value;
    if (!this.keys.includes(this.selected_city)) {
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
      let temperature = this.weatherdata[this.selected_city].temperature;
      let humidity = this.weatherdata[this.selected_city].humidity;
      let farenheit = Math.round(
        parseInt(this.weatherdata[this.selected_city].temperature) * (9 / 5) + 32
      );
      let precipitation = this.weatherdata[this.selected_city].precipitation;
      let date_time = this.weatherdata[this.selected_city].dateAndTime;
      let date_time_array = date_time.split(", ");
      let date = date_time_array[0];
      let new_date = this.date_format(date);

      document.querySelector("#temp_c").innerHTML = temperature;
      document.querySelector("#humidity").innerHTML = humidity;
      document.querySelector("#faren_f").innerHTML = farenheit + " F";
      document.querySelector("#preci").innerHTML = precipitation;
      document.querySelector("#date").innerHTML = new_date;
      document.querySelector(
        "#city_icon"
      ).src = `/Icons_for_cities/${this.selected_city}.svg`;
      this.weather_icon(this.selected_city);
      this.time_formart();
      this.next_five_temperature(this.selected_city);
    }
  }
  /**
   * @description change all the left part of top section to nil when no city is selected
   * @memberof weather_data
   */
  change_data() {
    let arr_temperature = ``;
    let arr_weather = ``;
    let arr_nextfivehours = ``;
    for (let i = 0; i < 6; i++) {
      arr_temperature += `<span><p id="weather_next1">Nil</p></span>`;
      arr_weather += `<span><img id="weather_icon1" src="/General_Images_&_Icons/none.png" /></span><span></span>`;
      arr_nextfivehours += `<span><p id="now">Nil</p></span><span></span>`;
    }
    document.getElementById("grid-item-3_row1_list4").innerHTML = arr_temperature;
    document.getElementById("grid-item-3_row1_list3").innerHTML = arr_weather;
    document.getElementById("grid-item-3_row1_list1").innerHTML = arr_nextfivehours;
    document.getElementById("city").style.backgroundColor = "#c94c4c";
  }
  /**
   * @description format the time fetched from API and place pmState and amState image 
   * @memberof weather_data
   */
  time_formart() {
    var city = this.selected_city;
    let current_time = new Date().toLocaleString("en-US", {
      timeZone: this.weatherdata[city].timeZone,
      timeStyle: "medium",
      hourCycle: "h12",
    });
    let morn_even = parseInt(current_time.slice(0, 2)) >= 12 ? "pmState" : "amState";
    document.getElementById("time").innerHTML = current_time.split(" ")[0];
    document.getElementById(
      "am_pm_state"
    ).src = `/General_Images_&_Icons/${morn_even}.svg`;
    this.next_five_hour(current_time);
  }

  /**
   * @description function to format date based on the required format
   * @param {string} date
   * @return {string} new_date in this format (day-month(first 3letter)-year)
   * @memberof weather_data
   */
  date_format(date) {
    let arr = date.split("/");
    let array_month = [
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
    let new_date = arr[1] + "-" + array_month[parseInt(arr[0])] + "-" + arr[2];
    return new_date;
  }

  /**
   * @description function is a async function used to get next 5 temperature of the city selected
   * @param {string} city selected in drop down option 
   * @memberof weather_data
   */
  async next_five_temperature(city) {
    let value = await fetch(`http://localhost:5000/citydata/${city}`)
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
    let arr_temperature = ``;
    for (let i = 0; i < arr1.length; i++) {
      arr_temperature += `<span><p id="weather_next1">${arr1[i]}</p></span>`;
    }
    document.getElementById("grid-item-3_row1_list4").innerHTML = arr_temperature;
  }

  /**
   * @description function that gives next five hours from the selected city current time
   * @param {string} current_time of the selected city
   * @memberof weather_data
   */
  next_five_hour(current_time) {
    let arr_nextfivehours = ``;
    let hour = parseInt(current_time.slice(0, 2));
    arr_nextfivehours += `<span><p id="now">Now</p></span><span></span>`;
    for (let i = 0; i < 5; i++) {
      if (current_time.split(" ")[1] == "PM") {
        if (hour + 1 + i > 12) {
          arr_nextfivehours += `<span><p id="now">${hour + i + 1 - 12}PM</p></span><span></span>`;
        } else {
          arr_nextfivehours += `<span><p id="now">${hour + i + 1}PM</p></span><span></span>`;
        }
      } else {
        if (hour + 1 + i > 12) {
          arr_nextfivehours += `<span><p id="now">${hour + i + 1 - 12}AM</p></span><span></span>`;
        } else {
          arr_nextfivehours += `<span><p id="now">${hour + i + 1}AM</p></span><span></span>`;
        }
      }
    }
    document.getElementById("grid-item-3_row1_list1").innerHTML =
      arr_nextfivehours;
  }

  /**
   * @description function is an async function that displays the icons based on the temperature
   * @param {string} city s the selected option in drop down
   * @memberof weather_data
   */
  async weather_icon(city) {
    let value = await fetch(`http://localhost:5000/citydata/${city}`)
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
    let arr_weather = ``;
    for (let i = 0; i < arr1.length; i++) {
      let temp = arr1[i].split("°")[0];
      if (parseInt(temp) > 29) {
        arr_weather += `<span><img id="weather_icon1" src="/Weather_Icons/sunnyIcon.svg" /></span
              ><span></span>`;
      } else if (parseInt(temp) >= 23 && parseInt(temp) <= 29) {
        arr_weather += `<span><img id="weather_icon1" src="/Weather_Icons/cloudyIcon.svg" /></span
              ><span></span>`;
      } else if (parseInt(temp) >= 18 && parseInt(temp) <= 22) {
        arr_weather += `<span><img id="weather_icon1" src="/Weather_Icons/windyIcon.svg" /></span
              ><span></span>`;
      } else {
        arr_weather += `<span><img id="weather_icon1" src="/Weather_Icons/rainyIcon.svg" /></span
              ><span></span>`;
      }
    }
    document.getElementById("grid-item-3_row1_list3").innerHTML = arr_weather;
  }

  /**
   * @description onclick function for sunny cities to be displayed
   * @memberof weather_data
   */
  onclick_func1() {
    this.weather_string = "sunny";
    document.getElementById("sunny").style.borderBottom = "2px solid blue";
    document.getElementById("winter").style.borderBottom = "none";
    document.getElementById("rainy").style.borderBottom = "none";
    this.select_cities_based_on_weather();
    this.city_based_weather_cardview(
      this.sort_func(this.sunny_cities),
      "sunnyIcon"
    );
  }

  /**
   * @description onclick function for winter cities to be displayed
   * @memberof weather_data
   */
  onclick_func2() {
    this.weather_string = "winter";
    document.getElementById("sunny").style.borderBottom = "none";
    document.getElementById("winter").style.borderBottom = "2px solid blue";
    document.getElementById("rainy").style.borderBottom = "none";
    this.select_cities_based_on_weather();
    this.city_based_weather_cardview(
      this.sort_func(this.winter_cities),
      "snowflakeIcon"
    );
  }

  /**
   * @description onclick function for rainy cities to be displayed
   * @memberof weather_data
   */
  onclick_func3() {
    this.weather_string = "rainy";
    document.getElementById("sunny").style.borderBottom = "none";
    document.getElementById("winter").style.borderBottom = "none";
    document.getElementById("rainy").style.borderBottom = "2px solid blue";
    this.select_cities_based_on_weather();
    this.city_based_weather_cardview(
      this.sort_func(this.rainy_cities),
      "rainyIcon"
    );
  }

  /**
   * @description function to sort cities based on the temperature 
   * @param {object} cities_data is the citynames classified based on the weather
   * @return {object} return city_name object which is sorted based on temperature
   * @memberof weather_data
   */
  sort_func(cities_data) {
    var cities_data_1 = cities_data;
    var city_temp = new Array();
    city_temp = Object.values(cities_data_1);
    city_temp.sort(function (a, b) {
      return a - b;
    });
    var city_name = [];
    for (var i = 0; i < city_temp.length; i++) {
      var cityname = Object.keys(cities_data).find(
        (key) => cities_data_1[key] === city_temp[i]
      );
      city_name.push(cityname);
      delete cities_data_1[cityname];
    }
    return city_name;
  }

  /**
   * @description function to classify sunny, winter and rainy cities
   * @memberof weather_data
   */
  select_cities_based_on_weather() {
    for (var i = 0; i < this.keys.length; i++) {
      var t = parseInt(this.weatherdata[this.keys[i]].temperature);
      var h = parseInt(this.weatherdata[this.keys[i]].humidity);
      var p = parseInt(this.weatherdata[this.keys[i]].precipitation);
      if (t > 29 && h < 50 && p >= 50) {
        this.sunny_cities[this.keys[i]] = t;
      }
      if (t >= 20 && t <= 28 && h > 50 && p < 50) {
        this.winter_cities[this.keys[i]] = h;
      }
      if (t < 20 && h >= 50) {
        this.rainy_cities[this.keys[i]] = p;
      }
    }
  }

  /**
   * @description function to display the card view of the cities based on weather
   * @param {object} weather_city is an object has cityname(key) and temperature(value) 
   * @param {string} icon_weather is string 
   * @memberof weather_data
   */
  city_based_weather_cardview(weather_city,
    icon_weather) {
    let city_based_on_weather = ``;
    this.count_num = document.getElementById("top_cities_num").value;
    for (var i = 0; i < Math.min(this.count_num, weather_city.length); i++) {
      var current_time = new Date().toLocaleString("en-US", {
        timeZone: this.weatherdata[weather_city[i]].timeZone,
        timeStyle: "medium",
        hourCycle: "h12",
      });
      current_time = current_time.split(" ")[0].split(':');
      let morn_even = parseInt(current_time.slice(0, 2)) >= 12 ? "PM" : "AM";
      let date_time = this.weatherdata[weather_city[i]].dateAndTime;
      let date_time_array = date_time.split(", ");
      let date = date_time_array[0];
      let new_date = this.date_format(date);
  
      city_based_on_weather += `<div class="grid_boxes">
          <div id="city"><p>${weather_city[i]}</p></div>
          <div class="weather">
            <img src="/Weather_Icons/${icon_weather}.svg" />&nbsp
            <p>${this.weatherdata[weather_city[i]].temperature}</p>
          </div>
          <div class="weather_items">
            <div class="weather_items_child1">
              <p id="time_city">${ current_time[0]+":"+current_time[1]+ " " + morn_even}</p>
              <p id="date_city">${new_date}</p>
            </div>
            <div class="weather_items_child">
              <img src="/Weather_Icons/humidityIcon.svg" />&nbsp
              <p id="city_humidity">${this.weatherdata[weather_city[i]].humidity}</p>
            </div>
            <div class="weather_items_child">
              <img src="/Weather_Icons/precipitationIcon.svg" />&nbsp
              <p id="city_precipitation">${this.weatherdata[weather_city[i]].precipitation}</p>
            </div>
          </div>
          <div class="city_img"><img src="/Icons_for_cities/${weather_city[i]}.svg"></div>
        </div>`;
    }
    document.querySelector(".grid_items_1").innerHTML = city_based_on_weather;
    if (this.count_num <= 4) {
      document.getElementById("left_button").style.visibility = "hidden";
      document.getElementById("right_button").style.visibility = "hidden";
    } else {
      document.getElementById("left_button").style.visibility = "visible";
      document.getElementById("right_button").style.visibility = "visible";
    }
  }

  /**
   * @description function to call inclick functions based on the onclick value
   * @memberof weather_data
   */
  display_top_city() {
    this.count_num = document.getElementById("top_cities_num").value;
    if (this.weather_string == "sunny") {
      this.onclick_func1();
    }
    if (this.weather_string == "winter") {
      this.onclick_func2();
    }
    if (this.weather_string == "rainy") {
      this.onclick_func3();
    }
  }

  /**
   * @description function to move the card view of cities to left
   * @memberof weather_data
   */
  move_left() {
    document.querySelector(".grid_items_1").scrollBy(365, 0);
  }

  /**
   * @description function to move the card view of cities to right
   * @memberof weather_data
   */  
  move_right() {
    document.querySelector(".grid_items_1").scrollBy(-365, 0);
  }

  /**
   * @description function to print top 12 cities based on continent or temperature
   * @param {string} item can either continent are temperature
   * @memberof weather_data
   */
  Print_12_cities(item) {
    this.time_Zone_city = [];
    if (item == "temperature") {
      this.temp_var = !this.temp_var;
      if (this.temp_var) {
        document.getElementById(
          "temp_arrow"
        ).src = `/General_Images_&_Icons/arrowup.svg`;
      } else {
        document.getElementById(
          "temp_arrow"
        ).src = `/General_Images_&_Icons/arrowdown.svg`;
      }
      this.temp_data = this.temp_var ? -1 : 1;
    } else {
      this.cont_var = !this.cont_var;
      if (this.cont_var) {
        document.getElementById(
          "con_arrow"
        ).src = `/General_Images_&_Icons/arrowup.svg`;
      } else {
        document.getElementById(
          "con_arrow"
        ).src = `/General_Images_&_Icons/arrowdown.svg`;
      }
      this.cont_data = this.cont_var ? -1 : 1;
    }
    var print_first_12_cities = ``;
    for (var i = 0; i < this.keys.length; i++) {
      this.time_Zone_city.push([
        this.keys[i],
        this.weatherdata[this.keys[i]].timeZone.split("/")[0],
        this.weatherdata[this.keys[i]].temperature,
      ]);
    }

    this.time_Zone_city = this.time_Zone_city.sort(
      (a, b) => this.cont_data * a[1].localeCompare(b[1]) ||
        this.temp_data * (parseInt(a[2]) - parseInt(b[2]))
    );
    for (var i = 0; i < 12; i++) {
      var current_time = new Date().toLocaleString("en-US", {
        timeZone: this.weatherdata[this.time_Zone_city[i][0]].timeZone,
        timeStyle: "medium",
        hourCycle: "h12",
      });
      current_time = current_time.split(" ")[0].split(':');
      let morn_even = parseInt(current_time.slice(0, 2)) >= 12 ? "PM" : "AM";
      print_first_12_cities += `<div class="box1-ingrid">
        <div id="box1-ingrid_c1">
          <p id="p_1">${this.time_Zone_city[i][1]}</p>
          <p id="p_2">${this.time_Zone_city[i][0]}, ${current_time[0] + ":" +current_time[1] + " " + morn_even}</p>
        </div>
        <div id="box1-ingrid_c2">
          <p id="p2_1">${this.weatherdata[this.time_Zone_city[i][0]].temperature}</p>
          <p id="p2_2"><img src="/Weather_Icons/humidityIcon.svg" />${this.weatherdata[this.time_Zone_city[i][0]].humidity}</p>
        </div>
      </div>`;
    }
    document.querySelector(".grid_boxes_1").innerHTML = print_first_12_cities;
    console.log(this.time_Zone_city);
  }
}



















