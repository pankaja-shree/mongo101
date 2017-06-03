var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://localhost:27017/sample';

MongoClient.connect(url, (err,db) => {

    assert.equal(null, err);
    console.log('Successfully connected to server');

    db.collection('movies').find({}).toArray( (err,docs) => {

        docs.forEach((doc) => {
            console.log(doc.title);
        });

        db.close();
    });
    console.log('Called find()');
});