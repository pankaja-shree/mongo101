var express = require('express'),
    app = express(),
    engines = require('consolidate');

app.get('/', (req, res) => {
    res.send('Hello express');
});

//any route not handled - default handler

app.use( (req, res) => {
    res.sendStatus(404);
});

//set up a server to listen to client connections 
//specify what port to listen on and what callback when connected

var server = app.listen(3000, function(){
    var port = server.address().port;
    console.log('Express server listening on port %s', port);
});