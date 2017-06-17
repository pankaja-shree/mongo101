//require http module to create a web server
var http = require('http');

//createServer returns a Server obj
var server = http.createServer(function(req, res) {
	
	//writeHead method is used to set the response HTTP headers. 
  res.writeHead(200, {
    'Content-Type': 'html/plain'
  });
  
  //end method is used to finalize the response.
  //end() takes a single string argument that it will use as the HTTP response body. 
  res.end('Hello World');
  
  //another way - use write() method before end() 
})

server.listen(8000); //server listens to port 3000

console.log('Server running at http://localhost:8000/');