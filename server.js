const express = require("express");
const app = express();
const {fork} = require("child_process");
app.use(express.static('./public'));
app.use(express.json())
const path = require("path");
const port = 5000;

app.get("/allweatherdata", (req,res) => {
  const child = fork("./allTimeZones.js");
  child.on("message",val=>{
    res.send(val);
    child.kill();
  });
})

app.get("/citydata/:id", (req,res) => {
  const child = fork("./timeForOneCity.js");
  let city_name = req.params.id;
  child.send(city_name);
  child.on("message",val=>{
    res.send(val);
    child.kill();
  });
});

app.post("/next5hrs", (req,res) => {
  const child = fork("./next5hrs.js");
  var city_data = req.body;
  child.send(city_data);
  child.on("message",val=>{
    res.send(val);
    child.kill();
  });
});

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running successfully");
  }
});
