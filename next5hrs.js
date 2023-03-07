const {   allTimeZones, nextNhoursWeather } = require("my_project_priya21");

process.on("message", (city_data) => {
    process.send(nextNhoursWeather(city_data.city_Date_Time_Name,city_data.hours,allTimeZones()));
});

