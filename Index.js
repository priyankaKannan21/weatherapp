// fetch data from json file
fetch("/files/data.json")
  .then((data) => data.json())
  .then((result) => {
    let data_object = new weather_data(result);
    console.log(result);
    data_object.weatherdatas();
    data_object.weather();
    data_object.select_cities_based_on_weather();
    data_object.onclick_func1();
    data_object.Print_12_cities("continent");
  });

//function which contains all global variables can be accessed by using this keyword
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
    setInterval(this.weather.bind(this), 1000);
  }
  //function for display content in drop box
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
  //function for display waether content based on city
  weather() {
    let selected_city = document.getElementById("city").value;
    if (!this.keys.includes(selected_city)) {
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
      let temperature = this.weatherdata[selected_city].temperature;
      let humidity = this.weatherdata[selected_city].humidity;
      let farenheit = Math.round(
        parseInt(this.weatherdata[selected_city].temperature) * (9 / 5) + 32
      );
      let precipitation = this.weatherdata[selected_city].precipitation;
      let date_time = this.weatherdata[selected_city].dateAndTime;
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
      ).src = `/Icons_for_cities/${selected_city}.svg`;
      this.weather_icon(selected_city);
      this.time_formart(selected_city);
      this.next_five_temperature(selected_city);
    }
  }
  //fucntion to change null values when city is not selected
  change_data() {
    let arr_temperature = ``;
    let arr_weather = ``;
    arr_nextfivehours = ``;
    for (let i = 0; i < 6; i++) {
      arr_temperature += `<span><p id="weather_next1">Nil</p></span>`;
      arr_weather += `<span><img id="weather_icon1" src="/General_Images_&_Icons/none.png" /></span><span></span>`;
      arr_nextfivehours += `<span><p id="now">Nil</p></span><span></span>`;
    }
    document.getElementById("grid-item-3_row1_list4").innerHTML = arr_temperature;
    document.getElementById("grid-item-3_row1_list3").innerHTML = arr_weather;
    document.getElementById("grid-item-3_row1_list1").innerHTML =
      arr_nextfivehours;
    document.getElementById("city").style.backgroundColor = "#c94c4c";
  }
  //function to format time
  time_formart(city) {
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
  //function to format date
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
  //function to display next five hours temperature
  next_five_temperature(city) {
    let arr1 = [];
    arr1.push(this.weatherdata[city].temperature);
    let arr = this.weatherdata[city].nextFiveHrs;
    arr1 = arr1.concat(arr);
    arr1.push(arr1[1]);
    let arr_temperature = ``;
    for (let i = 0; i < arr1.length; i++) {
      arr_temperature += `<span><p id="weather_next1">${arr1[i]}</p></span>`;
    }
    document.getElementById("grid-item-3_row1_list4").innerHTML = arr_temperature;
  }
  //function to display next five hours from original time
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
  //function to change weather icons based on temperature
  weather_icon(city) {
    let arr1 = [];
    arr1.push(this.weatherdata[city].temperature);
    let arr = this.weatherdata[city].nextFiveHrs;
    arr1 = arr1.concat(arr);
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
  //onclick function for sunny icon in top section
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
  //onclick function for winter icon in middle section
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
  //onclick function for rainy icon in middle section
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
  //sort function for cities based on teamperature
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
  //function to seperate cities based on weather
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
  //function to show cardview of cities of selected weather
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
      city_based_on_weather += `<div class="grid_boxes">
          <div id="city"><p>${weather_city[i]}</p></div>
          <div class="weather">
            <img src="/Weather_Icons/${icon_weather}.svg" />&nbsp
            <p>${this.weatherdata[weather_city[i]].temperature}</p>
          </div>
          <div class="weather_items">
            <div class="weather_items_child1">
              <p id="time_city">${current_time.split(" ")[0]}</p>
              <p id="date_city">${this.weatherdata[weather_city[i]].dateAndTime.split(",")[0]}</p>
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
  //display top cities function for middle section
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
  //function for scroll left button
  move_left() {
    document.querySelector(".grid_items_1").scrollBy(365, 0);
  }
  //function for scroll right button
  move_right() {
    document.querySelector(".grid_items_1").scrollBy(-365, 0);
  }
  //function to display top 12 cities in bottom section
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
      print_first_12_cities += `<div class="box1-ingrid">
        <div id="box1-ingrid_c1">
          <p id="p_1">${this.time_Zone_city[i][1]}</p>
          <p id="p_2">${this.time_Zone_city[i][0]}, ${current_time}</p>
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



















