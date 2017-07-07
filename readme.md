# MongoDB Class notes

## Week 1:

### Mongo Shell

* First start the mongo shell using mongo command at command prompt

* `help` shows a list of commands

* `show dbs` - see the list of existing dbs

* `use [dbname]` - will create a new db, if the db doesnt already exist

Eg: `use videos`
Creates a db named videos.

* `use companies`
  `db.dropDatabase()` will delete the companies database

* `db.movies.insertOne(JSON obj)` - creates a collection named movies inside a db and inserts a document

* `db.movies.drop` - delete collection

* `db.movies.remove({_id:23245},{justOne:true})` - removes a document, if there are duplicates. justOne is optional.

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

* Documents in MongoDB do not need to have same set of fields.

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

## Week 2: CRUD operations in mongo shell

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
3. `$elemMatch` - Match a single element within an array field. `db.movies.find({boxoffice : { $elemMatch: {country: "UK", revenue: { $gt: 15}}} })` - returns the pair where country is UK and the revenue for UK is gt 15.

### 3. Update

#### updateOne

* `updateOne({field1}, { updateOperator : {field2, field3 ...}})` - Finds the first document matching the field1 (the filter) and updates it with field2, field3, etc by applying the updateOperator.  

#### Field Update Operators

* Operate on fields inside documents. 

Eg - `db.movies.updateOne({title: "Martian"}, { $set : {review: "My review"}})`
`db.movies.updateOne({title: "Martian"}, { $inc : {"tomato.review": 3}})`

#### Updating Arrays

* Add 1 element to an array:
`$push: {fieldname: {arrayelement}}`

* Add many elements to an array - use modifiers. 
Eg:
```javascript
db.movies.updateOne({title: "Martian"}, {$push: {reviews:
                                                    {$each: [
                                                        {element1},
                                                        {element2},
                                                        ...
                                                    ],
                                                    $position: 0,
                                                    $slice: 5
                                                    }}})
```
* `$position` used with `$each` indicates where the element has to be pushed in the array.

* `$slice` modifier is used with `$each` to limit the size of the array. For keeping first 5, use 5; last five, use -5. 

#### updateMany

* Updates all documents matching the filter. 
Eg: `db.movies.updateMany( {rated: null}, { $unset: {rated: " "}})

#### Upserts:

* When no document is found matching the filter, insert a new document. 
* Use a third argument in updateOne as {upsert: true}

#### replaceOne

## Week 3: Node Driver

* Use  `mongoimport` to import from human readable json file. `mongorestore` dumps only bson data.
* In `MongoClient.connect` function, the connection url contains - host:portnumber/database 
* Default port is 27017. To connect to different port, use `mongod --port [portname]`
* To pass query, first store the query document in `query` object. 
* Similarly store the projection in another object. 

### Using cursors in node driver

* Result of find operation returns a cursor object. 
* Use the data only when required. In `var cursor = db.collection('companies').find(query)`, without callback in find, the statement only describes the query. In this case find creates a cursor object but doesnt perform the operation unless a request to any document is made (through cursor.forEach). Data is streamed through cursor only when asked for. Whereas using toArray with find returns all the documents in one go. 
* For including projection, chain a call to project on the cursor. This adds additional detail to the query. 
Eg: `cursor.project(projection)` or `find(query, projection)`
* In cursor.forEach method, there are 2 callbacks as arguments. In the 1st argument, the callback is called for each document returned by it. When cursor is exhausted with all documents in all the batches or when there's an error, the 2nd callback is executed.  
* In case of massive docs, using forEach with cursor, only batch of documents are returned at a time. Results in faster operation and reduced bandwidth consumption. 
* Stringifying the `_id` is different in mongo shell and node driver. In mongo shell, the `_id` is of type `ObjectId` whereas in node, its just a hex number. 

### `$regex` with Node 

* `"$options" : "1"` is used with `$regex` to indicate case insensitive regex expression. 

### Skip, limit, sort in Node driver

* MongoDB always executes curosr operations in this order- Sort, skip and limit - regardless of the order which we mention in the program. 

* These are cursor methods like `project`. It adds to the query representation, and is executed only when we pass args to the function (forEach).

* Sorting on single fields: 
`sort({fieldname: 1 or -1})` 1 - ascending order, -1 - descending order

* For sorting on multiple fields: Include the fields in an array
Eg: `cursor.sort([["founded_year", 1], ["number_of_employees", -1]]);` 
This sorts in the same order of fields as given: First, cmpanies are sorted by year in asc. order and within an individual year, the companies are sorted by employee number. 

* Skip: Tells how many search results to skip starting from first. Eg: `skip(30)` skips first 30 documents. Useful in displaying results page by page. 

* Limit: To limit the size of search result.

### CommandLineArgs module

* To pass command line arguments.

* Single letter labels start with `-` and string labels with `--`

## Week 4: MongoDB Schema Design

* Relational DBs design - using 3rd normal form.

* MongoDB design - Application driven schema

* MongoDB supports rich documents - can store array, objects, embedded docs

* No primary keys, foreign keys, etc - embedded docs solve the constraint problem

* Model of a blog on RDBs - a table of columns:
Postid   title    body    author    authoremail

* Model of a blog on MongoDB: 
``` javascript
posts = {
  _id: "",
  title: "",
  author: "",
  content: "",
  comments: [{author:"",content:"",date:""},...],
  tags: [""],
  date
}
authors = {
  _id:"",
  name:"",
  email: "",
  password
}
```
* MongoDB does not provide transactions but provides atomic operations within a single document - like - update, findAndModify, addToSet, push, etc. Transaction-like operations can be accomplished using atomic operations since mongoDB has embedded docs which are prejoined.a

* Atomic operations - When one document is being changed others wont be able to see it until all changes are complete. 

### 1:1 Relation in MongoDB

* Example: Employee: Resume - one employee has one resume corresponding to him.

Ways of modelling this:

Method 1: Link resume in employee collection

Employee collection : 
_id:
name:
resume: 30

Resume collection:
_id:30
jobs: []
education: []

Method 2: Link employee in the resume collection

Employee collection : 
_id: 10
name:

Resume collection:
_id:30
jobs: []
education: []
employee: 10

Method 3: Embed one doc into another

Employee inside Resume or vice versa.
Employee:
_id
name
resume: {}

* Cons for embedding docs - 

1. Cant embed documents that are more than 16mb.
2. If the embeded doc is not frequently used, it is waste of space. 
3. Atomicity of data - If you want to change both resume and employee info at the same time using atomic operations, embed on inside the other.

## Week 5: Indexes and Performance

### Storage Engines

* Mongo 3.0 onwards offer pluggable storage engine.
* A storage engine is an interface between the disk (persistant storage) and the DB. Mongodb server talks to the disk using storage engine. 
* All CRUD operations are done through storage engines.

Node driver --> Mongo server --> Storage Engine --> Persistant storage

* Handling of memory of the server and the disk is done by storage engine
* Pluggable storage engine - can use multiple engines  
* 2 storage engines - MMAP and WiredTiger
* Mongo 3.2 onwards WiredTiger is the default engine.
* Storage engine doesn't affect - 
 1. Communication between different mongodb servers in clusters
 2. API offered by the database

 #### MMAPv1

 * OS manages the memory used by each mapped file, deciding which parts to swap to disk. Virtual memory is 100GB and actual memory is 100 GB in a 64 bit system.

 * Collection level locking - In mongodb, each collection is a file. While doing multiple operations on the same collection, only one write can happen at a time, so operations must wait one by one. 

 * Allows in place update of data - 

 * Power of 2 sizes for documents - update docs without moving

 #### WiredTiger

 * Easier and faster
 * Offers Document level Concurrency - When two writes are at the same doc, one write has to wait
 * Offers compression of data and indexes.
 * WiredTiger manages the memory used by each mapped file, deciding which parts to swap to disk.
 * Append only storage engine - no in place update. For updates, they create new space. Regularly cache out data that is not frequently used. Advantage - Operate without locks , offers concurrency. So we can perform more than 1 operation on a doc.
 * To start WT manually:
 `mongod [-dbpath W]` --storageEngine wiredTiger
 `db.foo.stats()` - to find out which storage engine is used 

### Indexes

* Prevents scanning the entire collection to find a doc.
* using WiredTiger, as of MongoDB 3.0, indexes are implemented in b+trees. 
* Indexes are used for ordering the collection
Eg: If there is an index (a,b,c) :
Can search on a, (a,b), (a,c) and (a,b,c)
but not c, (c,b) , (b,a)
* Updates, writes using index will be slower
* Reads are much faster with indexes
* But combination operations, such as update and deletion operations will benefit from the index in the query stage, and then may be slowed by the index during the write. It is still better off having an index, but there are some special cases where this may not be true.

#### Creating Indexes

* Creating index takes time. 
* findOne is faster than find - because after finding one doc it quits.
* `db.students.createIndex({student_id:1})` - Index created for student_id, in ascending order.
* Multiple indexes: `db.students.createIndex({student_id:1, class_id:-1})`

#### Discovering Indexes

* `db.students.getIndexes()` - MongoDB 3.0 onwards
* By default _id index is present

#### Deleting Indexes

* `db.students.dropIndex({student_id:1})`
* Provide same signature used when created.

#### Multikey Indexes

* Indexes when the keys are arrays
* Only one key in a compound index can be array

#### Dot notation in multikey indexes

* Dot notation is used to create indexes on elements of an array
Eg:  `db.students.createIndex({'scores.score':1})` 

#### Unique Indexes

* Prevents duplicate entries
* The index should appear in all documents.
* `db.stuff.createIndex({thing:1}, {unique:true})`

#### Sparse Indexes

* Allows using indexes when the index key is missing in some documents.
* Only the documents having the specified key will be indexed.
* `db.stuff.createIndex({thing:1}, {unique:true, sparse:true})`Also prevents duplicate entries for the sparse index. 
* Sparse index cannot be used for sorting since some docs will be missing. So server will perform complete collection scan.
* Sparse index advantages - size of index will be smaller, flexibility in creating unique indexes

#### Foreground Index creation

* Default, Faster
* Blocks writers and readers in the database where the collection is, at the time of index creation. 

#### Background

* Slower
* Doesnt block readers and writers
 `db.stuff.createIndex({thing:1}, {background:true})`

### Explain 

* Simulation of performance of the query, without actually bringing the data from the database 
* Returns an explainable object.
* `db.foo.explain().find({query doc})` - to explain the method find.
* `db.foo.explain(true).find({query doc})` - to explain the method find after execution is completed.
* Works on - find(), update(), aggregate(), remove
* Doesn't work on insert.
* explain().help() - gives a helper interfae for explain 
* older version of explain worked only when the method returned cursor. Eg: remove({query}).explain didnt work because remove doesn't return a cursor. 
* New ersion - explain().remove({query}) - works since the explainable object is first created and then the method is called on it.  

#### Modes of Explain 

1. queryPlanner - default, tells which index will be used.
2. executionStats - db.foo.explain("executionStats").find({query doc})`. It will also include queryPlanner info
3. allPlansExecution - does what query planner does periodically. More information for all index possibilities and why the winningPlan was chosen.

### Covered Query

* When query is same as index, it is covered entirely by index and thus no documents need to be scanned. 
* In projection, only project the index keys and suppress others. 
Eg: `db.foo.find({i:45, j:56},{_id:0, i:1, j:1})`

### Choosing an Index

* When there are a number of suitable indexes, virtually, mongodb will issue a query in 3 parallel processes, like a race to reach the goal state (returning all results, or a threshold number of sorted results).
*  The winning query plan will be stored in a cache, to use the same index for a similar query.
* Cache needs to be changed, when the collection is modified. 
* Cache is refreshed in these cases: 
1. After a threshold number of writes.
2. When u rebuild the index
3. If any index is added or deleted
4. If db is restarted.

### Index size

* Index size is much less than actual data.
* Index is stored in the working set, in the memory. 
* It is important that index fits in working memory so that it need not be pulled from disk everytime, which would make it slow.
* `db.students.stats()` gives statistics about the indices like number of indexes, total index size, etc.
* `db.students.totalIndexSize()` - shortcut to get total index size in mb.
* Key features of WiredTiger Storage Engine - supports compression - prefix compression - allows to have smaller indexes.
* Eg of running db with prefix compression - `mongod --storageEngine wiredTiger --wiredTigerIndexPrefixCompression true`

### Index cardinality: No. of index : No. of docs

* Regular index - 1:1 
* Sparse index - <= docs
* Multikey index - > docs

### Geospatial Indexes

* Allow finding things based on location.

#### 2D index

* `db.places.createIndex({location: '2d', type:1})`- type:1 means ascending order
* Eg: `db.places.find({location: {$near: [74,140]}}).limit(3)`
* $near prints closest to farthest places.

#### Spherical

* Indexing Latitude and longitude coordinates
* MongoDB takes (Longitude,latitude)
* MongoDB uses GeoJSON specification for location data. 
* `db.places.createIndex({location: '2dsphere'})`
* Eg: ```javascript
db.places.find({
  location: {
    $near: {
      $geometry: { //required operator
       type: "Point",
       coordinates: [74,140]
       },
       $maxDistance: 1000
       }
  }
}).pretty()```

### Text Index

* To search for words. 
eg- db.sentences.createIndex({'words':'text'})
db.sentences.find({$text:{$search:'dog'}}) - case insensitive search

* Text score - how similar the word is to the actual one. Useful for finding the best match in the search.
Eg : db.sentences.find({$text:{$search:'dog'}}, {score: {$meta:'textScore'}}).sort({score: {$meta:'textScore'}})

### Efficiency of Index use



### Profiling

* Write entries (documents) to system.profile when query takes longer than specified time.
* 3 levels: 
1. 0 - off
2. 1 - log slow queries
3. 2 - log all queries - general debugging feature - to see database traffic

* Procedure to log profile level 1 anything above 2ms - 
`mongod --profile 1 --slowms 2`

* To see the profile log - `db.system.profile.find().pretty()`

* Seeing profile level in mongo shell - 
`db.getProfilingLevel()`  - 0, 1 or 2
`db.getProfilingStatus()` - to see --slowms value also

* Setting profile level in mongo shell - 
`db.setProfilingLevel(1,4)`

* Turn off Profiling - 
`db.setProfilingLevel(0)`

### Mongotop and mongostat

* High level view of where mongo is spending its time.



