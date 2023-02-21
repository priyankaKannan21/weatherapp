const http = require("http");
const path = require("path");
const fs = require("fs");

const server = http.createServer((req,res) => {
    const file_path = path.join(req.url === '/'? "Index.html": req.url.slice(1));
    console.log(file_path);
    const extension = path.extname(file_path);
    let content_type = "text/html";
    switch(extension){
        case ".css": content_type="text/css";break;
        case ".js": content_type="text/js";break;
        case ".svg": content_type="image/svg+xml";break;
        case ".png": content_type = "image/x-png";break;
    }
    if(extension === '.ico'){
        res.end();
        return;
    }
    
    res.writeHead(200,{"Content-Type":content_type});
    var stream=fs.createReadStream(file_path)
    stream.pipe(res);
    stream.on("close",function(){
        res.end()
    }); 
});

server.listen(5000, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Server is running successfully");
    }
})