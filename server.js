const http = require("http");
const path = require("path");
const fs = require("fs");

const {
  allTimeZones,
  timeForOneCity,
  nextNhoursWeather,
} = require("./timeZone");
const server = http.createServer((req, res) => {
  const file_path = path.join(
    req.url === "/" ? "Index.html" : req.url.slice(1)
  );
  console.log(file_path);
  const extension = path.extname(file_path);
  let content_type = "text/html";
  switch (extension) {
    case ".css":
      content_type = "text/css";
      break;
    case ".js":
      content_type = "text/js";
      break;
    case ".svg":
      content_type = "image/svg+xml";
      break;
    case ".png":
      content_type = "image/x-png";
      break;
  }
  if (extension === ".ico") {
    res.end();
    return;
  }
  if (req.url === "/allweatherdata") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(allTimeZones()));
    res.end();
  } else if (req.url.startsWith("/citydata")) {
    var cityName = req.url.split("/")[2];
    res.writeHead(200, { "Content-Type": "application/json" });
    res.write(JSON.stringify(timeForOneCity(cityName)));
    res.end();
  } else if (req.url === "/next5hrs") {
    let body = "";
    req.on("data", (data) => {
      body += data;
    });
    req.on("end", () => {
      let city_data = JSON.parse(body);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.write(
        JSON.stringify(
          nextNhoursWeather(
            city_data.city_Date_Time_Name,
            city_data.hours,
            allTimeZones()
          )
        )
      );
      res.end();
    });
  } else {
    res.writeHead(200, { "Content-Type": content_type });
    var stream = fs.createReadStream(file_path);
    stream.pipe(res);
    stream.on("close", function () {
      res.end();
    });
  }
});

server.listen(5000, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Server is running successfully");
  }
});
