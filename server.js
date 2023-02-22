var express = require("express");
var app = express();
app.use(express.static('./public'));
app.use(express.json());

const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone");

app.get("/allweatherdata", (req,res) => {
  res.send(JSON.stringify(allTimeZones()));
})
app.get("/citydata/:id", (req,res) => {
  let city_name = req.params.id;
  res.send(JSON.stringify(timeForOneCity(city_name)));
});
app.post("/next5hrs", (req,res) => {
  var city_data = req.body;
  console.log(city_data);
  res.send(JSON.stringify(nextNhoursWeather(city_data.city_Date_Time_Name,city_data.hours,allTimeZones())));
});

app.listen(5000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running successfully");
  }
});
