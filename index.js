/* globals require, console */
const http = require('http'),
      fs = require('fs'),
      hostname = '0.0.0.0',
      portHttp = '8080';
      
const routeRequest = (req, res) => {
  res.statusCode = 200;
  let fileName = req.url, itemId = null;
  if (fileName === '/' || fileName === '/itineraries/') {
    fileName = '/index.html';
  }

  if (fileName.match(/\/api\/movies/) ) {
    let parts = fileName.split('/');
    itemId = parts.length === 4 ? fileName.split('/').pop() : null;
    fileName = '/api/movies/index.json';
  }

  let contentType = "text/html";

  if (fileName.match(/\.js/)) {
    contentType = "text/javascript";
  }

  if (fileName.match(/\.json/) || fileName.match(/\/api/)) {
    contentType = "application/json";
  }

  if (fileName.match(/\.css/)) {
    contentType = "text/css";
  }
  fs.readFile('.' + fileName, 'utf8', function (err, data) {
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
      if (itemId) {
        let obj = JSON.parse(data);
        res.write(
          JSON.stringify(obj.find(obj => obj.id === parseInt(itemId)))
        );  
      } else {
        res.write(data);  
      }
      
    }
    console.log(`${code} request: ${fileName}`);
    res.end();  
    
  });
  
};


const serverHttp = http.createServer(routeRequest);

serverHttp.listen(portHttp, hostname, () => {
  console.log(`Server running at http://${hostname}:${portHttp}/`); // eslint-disable-line no-console
});
