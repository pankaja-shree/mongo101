var express = require('express'),
    app = express(),
    engines = require('consolidate'),
    bodyParser = require('body-parser'),
    MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var options = {};

//load template
app.engine('html', engines.nunjucks);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: true })); 

// Handler for internal server errors
function errorHandler(err, req, res, next) {
    console.error(err.message);
    console.error(err.stack);
    res.status(500).render('error_template', { error: err });
}

MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

    app.get('/', function(req, res, next) {
        res.render('query_db', {});
    });

    app.post('/query_db', function(req, res, next) {
        //get query from browser form. 
       options.firstYear = req.body.fy;
        options.lastYear = req.body.ly;
        options.employees = req.body.num;
   

    var query = queryDocument(options);
    var projection = {"name" : 1, "_id" : 0,
                        "founded_year" : 1, "number_of_employees" : 1, "crunchbase_url" :1};

    var cursor = db.collection('companies').find(query, projection);
    var numMatches = 0;

    cursor.forEach(
        function(doc) {
            numMatches++;
            console.log(doc);
        },
        function(err) {
            assert.equal(err, null);
            console.log("Query: "+ JSON.stringify(query));
            console.log("Matching Docs: " + numMatches);
            return db.close();
        }
    );
 });

 app.use(errorHandler);
    
    var server = app.listen(3000, function() {
        var port = server.address().port;
        console.log('Express server listening on port %s.', port);
    });
});

function queryDocument(options){
    console.log(options);

    let query = {
        "founded_year" : {
            "$gte" : options.firstYear,
            "$lte" : options.lastYear
        }
    };

    if("employees" in options){
        query.number_of_employees = {"$gte" : options.employees};
    }
    return query;
}
