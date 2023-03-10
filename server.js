const hostname = "127.0.0.1";
const port = 1337;
const http = require("http");
const url = require("url");
const path = require("path");
const fs = require("fs"); //filesystem module
const mimeType = {
  html: "text/html",
  jpeg: "image/jpeg",
  jpg: "image/jpg",
  png: "image/png",
  js: "text/javascript",
  css: "text/css",
};

http
  .createServer((req, res) => {
    var uri = url.parse(req.url).pathname;
    var fileName = path.join(process.cwd(), decodeURI(uri)); //current directory and decode uri
    console.log("loading" + uri);
    try {
      var stats = fs.lstatSync(fileName);
    } catch (e) {
      res.writeHead(404, { "Content-type": "text/plain" });
      res.write("404 Not Found\n");
      res.end();
      return;
    }
    if (stats.isFile()) {
      //ext name will get .jpg, split by dilemeter (.) will bring an array,
      //reverse will make extension first value in the array and [0] selects first value
      var contentType =
        mimeType[path.extname(fileName).split(".").reverse()[0]];
      res.writeHead(200, { "Content-type": contentType });

      var fileStream = fs.createReadStream(fileName);
      fileStream.pipe(res);
    } else if (stats.isDirectory()) {
      res.writeHead(302, {
        Location: "index.html",
      });
      res.end();
    } else {
      res.writeHead(500, { "Content-type": "text/plain" });
      res.write("500 Internal Error\n");
      res.end();
    }
  })
  .listen(port);
