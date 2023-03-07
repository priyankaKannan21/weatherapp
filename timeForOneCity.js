const { timeForOneCity } = require("my_project_priya21");
process.on("message", (city_name) => {
    process.send(timeForOneCity(city_name));
});
