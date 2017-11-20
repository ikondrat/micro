/* globals require, console */
const http = require('http'),
      fs = require('fs'),
      hostname = '0.0.0.0',
      portHttp = '80';
      
const routeRequest = (req, res) => {
  res.statusCode = 200;
  let fileName = req.url;
  if (fileName === '/' || fileName === '/itineraries/') {
    fileName = '/index.html';
  }
  
  let contentType = "text/html";

  if (fileName.match(/\.js/)) {
    contentType = "text/javascript";
  }

  if (fileName.match(/\.json/)) {
    contentType = "application/json";
  }

  if (fileName.match(/\.css/)) {
    contentType = "text/css";
  }
  fs.readFile('.' + fileName, function (err, html) {
    const code = err ? 404 : 200;
    if (err) {
        // throw err; 
        res.writeHeader(code, {"Content-Type": contentType});  
        res.write('not found');  
    } else {
      res.writeHeader(code, {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*"
      });  
      res.write(html);  
    }
    console.log(`${code} request: ${fileName}`);
    res.end();  
    
  });
  
};


const serverHttp = http.createServer(routeRequest);

serverHttp.listen(portHttp, hostname, () => {
  console.log(`Server running at http://${hostname}:${portHttp}/`); // eslint-disable-line no-console
});
