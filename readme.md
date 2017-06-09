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

### Create 

* `db.movies.insertOne(object)` - inserts the object to movies collection. 

* `insertMany(objects)` - for multiple entries, prevents duplicate documents (those with same underscore id) by default and stops the insert operation after throwing `duplicate key error`.

* `insertMany(objects, {"ordered" : false})` - when duplicate documents are found, it skips them and completes the insert operation for the rest of the entries, instead of stopping once the error is encountered. 

### Read

* `db.movies.find().pretty or db.movies.find({}).pretty() or db.movies.find(query document).pretty()` - dealt with in week 1. 

* `db.movies.find(query document)` the query document can have more than 1 key: value pairs and they are all anded implicitly to find the match. Dot notations for keys need to be enclosed in quotes.

* `db.movies.find(query document).count()` - returns the number of documents matching the query. 





