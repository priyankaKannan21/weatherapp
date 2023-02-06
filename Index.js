var weatherdata;
// fetch data from json file
fetch('/files/data.json')
.then((data) => data.json())
.then((result)=>{
    weatherdata=result;
    console.log(result);
    weatherdatas();
    weather_icon('Anadyr');
})

//function for display content in drop box

function weatherdatas(){   
    var keys=Object.keys(weatherdata);
    var option=``;
    for(var i=0;i<keys.length;i++){
        option += `<option>${keys[i]}</option>`;
    }
    console.log(option);
    document.querySelector(".city").innerHTML = option;
   
}

//function for display waether content based on city

function weather(){
    var keys=Object.keys(weatherdata);
    var city_name = document.querySelector(".city");
    var selected_city = city_name.options[city_name.selectedIndex].value;
    for(var i=0;i<keys.length;i++){
        if(selected_city === keys[i])
        {
            var temperature = weatherdata[keys[i]].temperature;
            var humidity = weatherdata[keys[i]].humidity;
            var farenheit = Math.round(((parseInt(weatherdata[keys[i]].temperature))*(9/5))+32);
            var precipitation = weatherdata[keys[i]].precipitation;
            var date_time = weatherdata[keys[i]].dateAndTime;
            var date_time_array = date_time.split(", ");
            var timezone = weatherdata[keys[i]].timezone;
            var date = date_time_array[0]
            new_date = date_format(date)
            break;
        }
    }
    document.querySelector("#temp_c").innerHTML = temperature;
    document.querySelector("#humidity").innerHTML = humidity;
    document.querySelector("#faren_f").innerHTML = farenheit;
    document.querySelector("#preci").innerHTML = precipitation;
    document.querySelector("#date").innerHTML = new_date;
    document.querySelector("#city_icon").src = (`/Icons_for_cities/${selected_city}.svg`); 
    weather_icon(selected_city); 

    var dates= new Date().toLocaleString("en-US",{
        timeZone: timezone,
        timeStyle: "medium",
        hourCycle: "h24",
    });
    console.log(dates);
}

//function to format date 
function date_format(date){
    var arr = date.split('/');
    var array_month=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    new_date = arr[1] + "-" + array_month[parseInt(arr[0])] + "-" + arr[2];
    return new_date;
}

//function to change weather icons based on temperature
function weather_icon(city){
    var arr1=[];
    arr1.push(weatherdata[city].temperature);
    var arr = weatherdata[city].nextFiveHrs;
    arr1 = arr1.concat(arr);
    var arr_weather=``;
    for(var i=0;i<arr1.length;i++){
        var temp=arr1[i].split('°')[0];
        // var st= "weather_icon"+ (i+1);
        if(parseInt(temp)>29){
            arr_weather += `<span><img id="weather_icon1" src="/Weather_Icons/sunnyIcon.svg" /></span
            ><span></span>`;
        }
        else if(parseInt(temp)>=23 && parseInt(temp)<=29){
            arr_weather += `<span><img id="weather_icon1" src="/Weather_Icons/cloudyIcon.svg" /></span
            ><span></span>`;
        }
        else if(parseInt(temp)>=18 && parseInt(temp)<=22){
            arr_weather += `<span><img id="weather_icon1" src="/Weather_Icons/windyIcon.svg" /></span
            ><span></span>`; 
        }
        else{
            arr_weather += `<span><img id="weather_icon1" src="/Weather_Icons/rainyIcon.svg" /></span
            ><span></span>`; 
        }
    }
    arr_weather += `<span><img id="weather_icon1" src="/Weather_Icons/windyIcon.svg" /></span
            ><span></span>`; 
    document.getElementById("grid-item-3_row1_list3").innerHTML = arr_weather;
}
