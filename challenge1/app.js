var express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    engines = require('consolidate'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');


app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error', { error: err });
}

MongoClient.connect('mongodb://localhost:27017/sample', function(err, db) {

    assert.equal(null, err);
    console.log("Successfully connected to MongoDB.");

    app.get('/', function(req, res){
        res.render('movies', {} );
    });

    app.post('/movie', function(req, res, next) {
        let title = req.body.title;
        let year = req.body.year;
        let imdb = req.body.imdb;

        if(title == '' || year == '' || imdb == ''){
            next('Please fill all the fields');
        }

        db.collection('movies').insertOne(
            {
            'title':title, 'year':year, 'imdb':imdb
        },
        function(err,r){
            assert.equal(null,err);
            res.send('New movie added to Database: '+r);
        }
        );
           });

app.use(errorHandler);

var server = app.listen(3000, function() {
    var port = server.address().port;
    console.log('Express server listening on port %s.', port);
});
});

 


