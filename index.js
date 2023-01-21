// pre-bundled node modules
const fs = require("fs");

//3rd-party module
const express = require('express');

// constructor function of express - create express app
const app = express(); 

const PORT = 3000;
const HOST = "localhost";

app.get('/', (req, res)=>{
  res.end('Hello World!')
})

app.listen(PORT, ()=>
{
  console.log(`Example app listening at http://${HOST}:${PORT}`);
})


/*let server = http.createServer((req, res) => {

  


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
}); */




