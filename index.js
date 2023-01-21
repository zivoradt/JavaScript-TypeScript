// pre-bundled node modules
const http = require("http");
const fs = require("fs");
const url = require("url");

//3rd-party module
const mimeTypes = require("mime-types");
// alias
let lookup = mimeTypes.lookup;

const PORT = 3000;
const HOST = "localhost";

let server = http.createServer((req, res) => {
  let parseURL = new URL(req.url, "http://" + HOST + ":" + PORT);

  let path = parseURL.pathname.replace(/^\/+|\/+$/g, "");

  switch (path) {
    case "":
    case "home":
      path = "index.html";
      break;
    case "/about":
      path = "index.html";
      break;
    case "/services":
      path = "index.html";
      break;
    case "/contact":
      path = "index.html";
      break;
    case "/contact-list":
      path = "index.html";
      break;
    case "/projects":
      path = "index.html";
      break;
    case "/register":
      path = "index.html";
      break;
    case "/login":
      path = "index.html";
      break;
    case "/edit":
      path = "index.html";
      break;
  }

  let file = __dirname + "/" + path;

  fs.readFile(file, function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end("ERROR: Page is not found");
      return;
    }
    res.setHeader("X-Content-Type-Options", "nosniff"); //securtiy: avoids mime-sniffing
    let mime = lookup(path);
    res.writeHead(200, { "Content-type": mime });
    res.end(data);
  });
});

server.listen(PORT);

console.log("Server running at http://localhost:3000/");
