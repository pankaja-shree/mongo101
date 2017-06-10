# MongoDB Class notes

## Week 1:

### Mongo Shell

* First start the mongo shell using mongo command at command prompt

* `help` shows a list of commands

* `show dbs` - see the list of existing dbs

* `use [dbname]` - will create a new db, if the db doesnt already exist

Eg: `use videos`
Creates a db named videos.

* `db.movies.insertOne(JSON obj)` - creates a collection named movies inside a db and inserts a document

* `db.movies.drop` - delete documents

* `db.movies.find()` - lists the documents inside movies

* `db.movies.find().pretty()` - proper visualisation for `find()`

* `db.movies.find({})` - same as `find()`

* `db.movies.find({key: value})` - returns a cursor object with matching key:value pair in the movies collection

Eg: `db.movies.find({"year":1981})`

* Cursor operations:

```javascript
var c = db.movies.find({"year":1981})
c.hasNext() //returns true there is a  next entry yet to be visited.
c.next() //shows the next object - 1 at a time
```

### Node Driver

* NodeJS driver is a driver written in JS, used to communicate between the server and mongodb - managing connections, handle requests and errors.

* NodeJS driver for mongods is mongodb module. Do `npm install mongodb` or include it in package.json.

* In NodeJS, db related functions such as connect, find, etc are asynchronous. 

* Normally for find() operations, toArray() is used to convert the cursor object to array object so that array methods can be used.

### Express

* Used for handling http requests and routes. 

* Use templating engines for dynamically loading web pages instead of static strings.

* `consolidate` module provides wrappers for templates. 

* While using `consolidate`, certain app settings need to be done - provide name of the template engine, associate it with html type, provide location of views folder that contains the templates.

### GET Request with Express, Req Parameters and route names

* Colon in routes - used to store the route names

Eg: /:name - get the value after the colon and store it in a variable called name.
use `var name = req.params.name` - to access the name variable

* GET parameters - the parameters after `?` in routes

Eg: /:name?var1=value
`var param1 = req.query.var1`

### POST Request with Express

* POST request is handled by accessing the parameters in req.body.

* `express.bodyParser()` - middleware in express - used before `app.router` - bodyParser processing happens before the next route loads. It will parse the body of request and populates req.body so that the next route below the current route can use req.body. 

* `errorHandler()` has 4 args - err obj, req obj, res obj, next callback

* `next` is a function passed in by the Express with req and res objs to handle errors. 

* `next` is called with error obj, it Looks for `errorHandler()` middleware registered in the code and runs it.  

## Week 2: CRUD

### 1. Create 

* `db.movies.insertOne(object)` - inserts the object to movies collection. 

* `insertMany(objects)` - for multiple entries, prevents duplicate documents (those with same underscore id) by default and stops the insert operation after throwing `duplicate key error`.

* `insertMany(objects, {"ordered" : false})` - when duplicate documents are found, it skips them and completes the insert operation for the rest of the entries, instead of stopping once the error is encountered. 

### 2. Read

* `db.movies.find().pretty or db.movies.find({}).pretty() or db.movies.find(query document).pretty()` - dealt with in week 1. 

* `db.movies.find(query document)` the query document can have more than 1 key: value pairs and they are all anded implicitly to find the match. Dot notations for keys need to be enclosed in quotes.

* `db.movies.find(query document).count()` - returns the number of documents matching the query. 

#### Equality matches on arrays

* Exact match - enclose the value inside square bracket, it will look for the exact match in the same order as those inside the square brackets. 
Eg : `db.movies.find({writers: ["Ethan Coel"]})` - Returns the document in which the writers array should have only 1 element - Ethan Coel. 
`db.movies.find({writers: ["Ethan Coel", "John Coel"]})` - Returns the document in which the writers array should have only 2 elements - Ethan Coel and John Coel - in the same order. 

* Any element in the array matches the value - use normal scalar notation
Eg : `db.movies.find({writers: "Ethan Coel"})` - Returns the document in which the writers array contains one of its elements as - Ethan Coel. 

* An element of specific position - use dot notation
Eg : `db.movies.find({"writers.0": "Ethan Coel"})` - Returns the document in which the writers array should have only 1 element - Ethan Coel. 

#### Cursors

* Read operations return a cursor object. 

```javascript
var c = db.movies.find();
//function to iterate the results batch. 1 batch typically contains about 101 documents.
var doc = function() {
c.hasNext() ? c.next() : null;
};
doc();
c.objsLeftInBatch();
```

#### Projections

* Used to limit the fields that are returned on a query.

1. Including Fields: fieldname: 1 includes the fieldname
Eg : `db.movies.find({writers": "Ethan Coel"}, { title: 1 }).pretty()` - returns only the titles and `_id` matching the query
`db.movies.find({writers": "Ethan Coel"}, { title: 1, _id: 0 }).pretty()` - returns only the titles matching the query

2. Excluding fields: fieldname: 0 excludes the fieldname
Eg `db.movies.find({writers": "Ethan Coel"}, { title: 0, year: 0, screenplay: 0 }).pretty()`

#### Comparison Operators 

* Comparison operations such as greater, lesser, etc.

Examples:
`db.movies.find({runtime: {$gt:90}}).pretty()` 
`db.movies.find({runtime: {$gt:90 , $lt: 120}}).pretty()` 
`db.movies.find({runtime: {$gte:90}}).pretty()` 
`db.movies.find({rated: {$ne: "UNRATED"}}).prretty()` - ne - not equal to - returns even the documents not having the rated field.
`rated: {$in: ["P", "PG"]}` - matching range of values

* Can work with many fields, chain operators

#### Element Operators

* `$exists` - To check whether an element exists 
Eg: `db.movies.find({ "tomato.meter" : {$exists: true} })`

* `$type` - returns documents of the specified type
Eg: `db.movies.find({ "_id" : {$type : "string"} })`

#### Logical Operators

* Operations - AND, OR, NOT and NOR (opposite of OR)

Eg:
`db.movies.find({ $or: [ {"tomato.meter": {$gt:95} }, {"metacritic":{ $gt: 88 } } ] })`

* AND operation. 
Eg:
`db.movies.find({ $and: [ {"tomato.meter": {$gt:95} }, {"metacritic":{ $gt: 88 } } ] })` 
is same as :
`db.movies.find( {"tomato.meter": {$gt:95} }, {"metacritic":{ $gt: 88 } } )` 

* AND operation allows us to specify constraints for the same field. 

`db.movies.find({ $and: [ {"metacritic": {$ne:null} }, {"metacritic":{ $exists: true } } ] })` - this cannot be done using normal queries because duplicate fields in a json object are not allowed.

#### Regex Operators

Eg: `db.movies.find({"awards.text": { $regex: /^Won\s.*/} })`

#### Array Operators

* Work with array value fields.

Eg:
1. `$all` - All elements should match the elements in the query array. `db.movies.find({genres : { $all: ["Comedy", "Drama" , "Crime"]} })`
2. `$size` - Length of the array. `db.movies.find({genres : { $size: 1} })`
3. `$elemMatch` - Match a single element within an array field. `db.movies.find({boxoffice : { $elemMatch: {country: "UK", revenue: { $gt: 15}}} })`


