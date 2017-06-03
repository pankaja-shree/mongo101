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