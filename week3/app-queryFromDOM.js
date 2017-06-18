var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

//get query from browser form. 
var options = constructOptions();

MongoClient.connect('mongodb://localhost:27017/crunchbase', function(err, db) {

    assert.equal(err, null);
    console.log("Successfully connected to MongoDB.");

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
