// pre-bundled node modules
import fs = require("fs");
import path = require('path');

//3rd-party module
import express = require('express');
import { ServerResponse } from "node:http";

// constructor function of express - create express app
const app = express(); 

const PORT = 3000;
const HOST = "localhost";

// static files (it set the path to node modules so in the index.html we can delete ./node_module path)
app.use(express.static(path.join(__dirname, 'node_modules')));
app.use(express.static(path.join(__dirname, "Client")));
app.use(express.static(path.join(__dirname, "Views")));

//Routhing
// default route
app.get('/', (req, res)=>{
      displaySPA(res);
})

// wild cart rout to check 404 error page
app.get('*', (req, res)=>{
  displaySPA(res);
})

// kick off server and listens on PORT
app.listen(PORT, ()=>
{
  console.log(`Example app listening at http://${HOST}:${PORT}`);
})

function displaySPA(res:any):void 
{
  fs.readFile("index.html", function (err, data) {
    if (err) {
      res.writeHead(404);
      res.end("ERROR: Page is not found");
      return;
    }
   
    res.writeHead(200);
    res.end(data);
  });
}




  


  

  





