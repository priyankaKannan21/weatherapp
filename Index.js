var weatherdata;
// fetch data from json file
fetch("/files/data.json")
  .then((data) => data.json())
  .then((result) => {
    weatherdata = result;
    console.log(result);
    weatherdatas();
    weather_icon("Anadyr");
    time_formart("Anadyr");
    select_cities_based_on_weather();
    onclick_func1();
    Print_12_cities("continent");
  });

//function for display content in drop box
function weatherdatas(){   
    var keys=Object.keys(weatherdata);
    var option=``;
    for(var index=0;index<keys.length;index++){
        option += `<option value=${keys[index]}></option>`;
    }
    document.querySelector("#city_name").innerHTML = option;
}

setInterval(weather, 1000);
//function for display waether content based on city
function weather() {
  var keys = Object.keys(weatherdata);
  var selected_city = document.getElementById("city").value;

  if (!keys.includes(selected_city)) {
    document.querySelector("#temp_c").innerHTML = "Nil";
    document.querySelector("#humidity").innerHTML = "Nil";
    document.querySelector("#faren_f").innerHTML = "Nil";
    document.querySelector("#preci").innerHTML = "Nil";
    document.querySelector("#date").innerHTML = "Nil";
    document.querySelector("#city_icon").src =
      "/General_Images_&_Icons/none.png";
    document.getElementById("time").innerHTML = "Nil";
    document.getElementById("am_pm_state").style.visibility = "hidden";
    change_data();
  } else {
    document.getElementById("am_pm_state").style.visibility = "visible";
    document.getElementById("city").style.backgroundColor =
      "rgba(0, 0, 0, 0.5)";
    var temperature = weatherdata[selected_city].temperature;
    var humidity = weatherdata[selected_city].humidity;
    var farenheit = Math.round(
      parseInt(weatherdata[selected_city].temperature) * (9 / 5) + 32
    );
    var precipitation = weatherdata[selected_city].precipitation;
    var date_time = weatherdata[selected_city].dateAndTime;
    var date_time_array = date_time.split(", ");
    var date = date_time_array[0];
    new_date = date_format(date);

    document.querySelector("#temp_c").innerHTML = temperature;
    document.querySelector("#humidity").innerHTML = humidity;
    document.querySelector("#faren_f").innerHTML = farenheit + " F";
    document.querySelector("#preci").innerHTML = precipitation;
    document.querySelector("#date").innerHTML = new_date;
    document.querySelector(
      "#city_icon"
    ).src = `/Icons_for_cities/${selected_city}.svg`;
    weather_icon(selected_city);
    time_formart(selected_city);
    next_five_temperature(selected_city);
  }
}

//fucntion to change null values when city is not selected
function change_data(){    
    var arr_temperature=``;
    var arr_weather=``;
    arr_nextfivehours=``;
    for(var index=0;index<6;index++){
        arr_temperature += `<span><p id="weather_next1">Nil</p></span>`;
        arr_weather += `<span><img id="weather_icon1" src="/General_Images_&_Icons/none.png" /></span><span></span>`;
        arr_nextfivehours += `<span><p id="now">Nil</p></span><span></span>`;
        
    }
    document.getElementById("grid-item-3_row1_list4").innerHTML = arr_temperature;
    document.getElementById("grid-item-3_row1_list3").innerHTML = arr_weather;
    document.getElementById("grid-item-3_row1_list1").innerHTML = arr_nextfivehours; 
    document.getElementById("city").style.backgroundColor = "#c94c4c";
}

//function to format time
function time_formart(city) {
  var timezone = weatherdata[city].timeZone;
  var current_time = new Date().toLocaleString("en-US", {
    timeZone: timezone,
    timeStyle: "medium",
    hourCycle: "h12",
  });
  var morn_even =
    parseInt(current_time.slice(0, 2)) >= 12 ? "pmState" : "amState";
  document.getElementById("time").innerHTML = current_time.split(" ")[0];
  document.getElementById(
    "am_pm_state"
  ).src = `/General_Images_&_Icons/${morn_even}.svg`;
  next_five_hour(current_time);
}

//function to format date
function date_format(date) {
  var arr = date.split("/");
  var array_month = [
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
  new_date = arr[1] + "-" + array_month[parseInt(arr[0])] + "-" + arr[2];
  return new_date;
}

//function to display next five hours temperature
function next_five_temperature(city){
    var arr1=[];
    arr1.push(weatherdata[city].temperature);
    var arr = weatherdata[city].nextFiveHrs;
    arr1 = arr1.concat(arr);
    arr1.push(arr1[1]);
    var arr_temperature=``;
    for(var index=0;index<arr1.length;index++){
        arr_temperature += (`<span><p id="weather_next1">${arr1[index]}</p></span>`);
    }
    document.getElementById("grid-item-3_row1_list4").innerHTML = arr_temperature;
}

//function to display next five hours from original time
function next_five_hour(current_time){
    var arr_nextfivehours=``;
    var hour = parseInt(current_time.slice(0,2));
    arr_nextfivehours += (`<span><p id="now">Now</p></span><span></span>`);
    for(var index=0; index<5 ;index++){
        if(current_time.split(' ')[1] == 'PM'){
            if(hour+1+index >12){
                arr_nextfivehours += (`<span><p id="now">${hour+index+1-12}PM</p></span><span></span>`);
            }
            else{
                arr_nextfivehours += (`<span><p id="now">${hour+index+1}PM</p></span><span></span>`);
            }
        }
        else{
            if(hour+1+index >12){
                arr_nextfivehours += (`<span><p id="now">${hour+index+1-12}AM</p></span><span></span>`);
            }
            else{
                arr_nextfivehours += (`<span><p id="now">${hour+index+1}AM</p></span><span></span>`);
            }        
        }
    }
    document.getElementById("grid-item-3_row1_list1").innerHTML = arr_nextfivehours;
}

//function to change weather icons based on temperature
function weather_icon(city){
    var arr1=[];
    arr1.push(weatherdata[city].temperature);
    var arr = weatherdata[city].nextFiveHrs;
    arr1 = arr1.concat(arr);
    arr1.push(arr1[1])
    var arr_weather=``;
    for(var index=0;index<arr1.length;index++){
        var temp=arr1[index].split('°')[0];
        // var st= "weather_icon"+ (i+1);
        if(parseInt(temp)>29){
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

var weather_string;

//onclick function for sunny icon in middle section
function onclick_func1() {
  weather_string = "sunny";
  document.getElementById("sunny").style.borderBottom = "2px solid blue";
  document.getElementById("winter").style.borderBottom = "none";
  document.getElementById("rainy").style.borderBottom = "none";
  select_cities_based_on_weather();

  city_based_weather_cardview(sort_func(sunny_cities), "sunnyIcon");
}

//onclick function for winter icon in middle section
function onclick_func2() {
  weather_string = "winter";
  document.getElementById("sunny").style.borderBottom = "none";
  document.getElementById("winter").style.borderBottom = "2px solid blue";
  document.getElementById("rainy").style.borderBottom = "none";
  select_cities_based_on_weather();
  city_based_weather_cardview(sort_func(winter_cities), "snowflakeIcon");
}

//onclick function for rainy icon in middle section
function onclick_func3() {
  weather_string = "rainy";
  document.getElementById("sunny").style.borderBottom = "none";
  document.getElementById("winter").style.borderBottom = "none";
  document.getElementById("rainy").style.borderBottom = "2px solid blue";
  select_cities_based_on_weather();
  city_based_weather_cardview(sort_func(rainy_cities), "rainyIcon");
}

//sort function for cities based on teamperature
function sort_func(cities_data){
    var cities_data_1 = cities_data;
    var city_temp = new Array();
    city_temp = Object.values(cities_data_1);
    city_temp.sort(function(a, b){return a-b});
    console.log(city_temp);
    var city_name = [];
    for(var index=0;index<city_temp.length;index++){
        var cityname = Object.keys(cities_data).find(key => cities_data_1[key] === city_temp[index])
        city_name.push(cityname);
        delete cities_data_1[cityname];
    }
    console.log(city_name);
    return city_name;
}
//global declaration of cities array based on weather
var sunny_cities = {};
var winter_cities = {};
var rainy_cities = {};

//function to seperate cities based on weather
function select_cities_based_on_weather(){
    var keys = Object.keys(weatherdata);
    for(var index=0;index<keys.length;index++){
        var t = parseInt(weatherdata[keys[index]].temperature);
        var h = parseInt(weatherdata[keys[index]].humidity);
        var p = parseInt(weatherdata[keys[index]].precipitation);
        if((t > 29) && (h < 50) && (p >= 50)){
            sunny_cities[keys[index]] =t;
        }
        if((t >= 20 && t <= 28) && (h > 50) && (p <50)){
            winter_cities[keys[index]] = h;
        }
        if((t < 20) && (h >= 50)){
            rainy_cities[keys[index]] = p;
        }
    }
}

//function to show cardview of cities of selected weather 
function city_based_weather_cardview(weather_city,icon_weather){
    city_based_on_weather = ``;
    count_num = document.getElementById("top_cities_num").value;
    // if(count_num>weather_city.length)
    //     count_num=weather_city.length;
    console.log(count_num);
    for(var index=0;index<Math.min(count_num, weather_city.length) ;index++)
    {
        var timezone = weatherdata[weather_city[index]].timeZone;
        var current_time= new Date().toLocaleString("en-US",{
            timeZone: timezone,
            timeStyle: "medium",
            hourCycle: "h12",
        });
        city_based_on_weather +=  `<div class="grid_boxes">
        <div id="city"><p>${weather_city[index]}</p></div>
        <div class="weather">
          <img src="/Weather_Icons/${icon_weather}.svg" />&nbsp
          <p>${weatherdata[weather_city[index]].temperature}</p>
        </div>
        <div class="weather_items">
          <div class="weather_items_child1">
            <p id="time_city">${current_time.split(' ')[0]}</p>
            <p id="date_city">${(weatherdata[weather_city[index]].dateAndTime).split(',')[0]}</p>
          </div>
          <div class="weather_items_child">
            <img src="/Weather_Icons/humidityIcon.svg" />&nbsp
            <p id="city_humidity">${weatherdata[weather_city[index]].humidity}</p>
          </div>
          <div class="weather_items_child">
            <img src="/Weather_Icons/precipitationIcon.svg" />&nbsp
            <p id="city_precipitation">${weatherdata[weather_city[index]].precipitation}</p>
          </div>
        </div>
        <div class="city_img"><img src="/Icons_for_cities/${weather_city[index]}.svg"></div>
      </div>`
    }
    document.querySelector(".grid_items_1").innerHTML = city_based_on_weather;
    if(count_num <= 4){
        document.getElementById("left_button").style.visibility="hidden";
        document.getElementById("right_button").style.visibility="hidden";    
    }
    else{
        document.getElementById("left_button").style.visibility="visible";
        document.getElementById("right_button").style.visibility="visible"; 
    }
}

//function for scroll left button
function move_left() {
  document.querySelector(".grid_items_1").scrollBy(365, 0);
}
//function for scroll right button
function move_right() {
  document.querySelector(".grid_items_1").scrollBy(-365, 0);
}

var count_num;

//display top cities function for middle section
function display_top_city(){
    count_num = document.getElementById("top_cities_num").value;
    if(weather_string === "sunny")
        onclick_func1();
    if(weather_string === "winter")
        onclick_func2();
    if(weather_string === "rainy")
        onclick_func3();
}
