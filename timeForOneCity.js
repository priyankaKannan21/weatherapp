const { timeForOneCity } = require("./timeZone");
process.on("message", (city_name) => {
    process.send(timeForOneCity(city_name));
});
