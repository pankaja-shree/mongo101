# Mongo101 JS Final Project

## Lab 0 Instructions:

* Download the MongoMart application from the handout.
* Install the dependencies.
* Make sure you have a mongod running version 3.2.x of MongoDB.
* Import the "item" collection: mongoimport --drop -d mongomart -c item data/items.json
* Import the "cart" collection: mongoimport --drop -d mongomart -c cart data/cart.json
* Run the application by typing "node mongomart.js" in the mongomart directory.
* In your browser, visit http://localhost:3000.

## Lab 1: 

* The items.js file implements data access for the item collection. The item collection contains the product catalog for the MongoMart application.

* The mongomart.js application instantiates an item data access object (DAO) with this call:

```javascript
var items = new ItemDAO(db);
```
* The DAO, items, is used throughout mongomart.js to implement several of the routes in this application.

* In this lab, you will implement the methods in items.js necessary to support the root route or "/". This route is implemented in mongomart.js in the function that begins with this line:

`router.get("/", function(req, res) {`

* The methods you will implement in items.js are: getCategories(), getItems(), and getNumItems(). The comments in each of these methods describe in detail what you need to do to implement each method. When you believe you are finished, restart the mongomart.js application and evaluate your application to see whether it matches the following description.

* If you have completed this lab correctly, the landing page for Mongomart should now show the following five products: Gray Hooded Sweatshirt, Coffee Mug, Stress Ball, Track Jacket, and Women's T-shirt. On the left side of the page you should see nine product categories listed, beginning with "All" and ending with "Umbrellas". At the bottom of the page you should see tabs for pages 1-5 with the statement "23 Products" immediately underneath.

## Lab 2: 

* In this lab, you will implement the methods in items.js necessary to support the route for text search or "/search". This route is implemented in mongomart.js in the function that begins with this line:

`router.get("/search", function(req, res) {`

* The methods you will implement in items.js are: searchItems(), and getNumSearchItems(). 

## Lab 3: 

* In this lab, you will implement the method in items.js necessary to support the route for viewing a single item. This route is implemented in mongomart.js in the function that begins with this line:

`router.get("/item/:itemId", function(req, res) {`

* This route is implemented using a parameter for the item as part of the url. In Express, you may define a route with url parameters by placing a ":" before each portion of the url path that should be interpreted by Express as a variable. In this case, :itemId indicates that our callback for this route expects to use the value found in this portion of the url to do its job. You may access url parameters via the params property of the request object passed as the first parameter to our route callback function as we do here:

` var itemId = parseInt(req.params.itemId);`

* To complete the functionality to support the single item view, you will need to implement the getItem() method in items.js.

## Lab 4: 

* In this lab, you will implement the method in items.js necessary to support the route for adding a review to a single item. This route is implemented in mongomart.js in the function that begins with this line:

`router.post("/item/:itemId/reviews", function(req, res) {`

* Note that this route uses a url parameter much like that used in the route for the single item view. However, this route supports POST rather than GET requests. To access the form values passed in the POST request, we use the "body" property of the request object passed to the callback function for this route.

* To complete the functionality to support adding reviews, you will need to implement the addReview() method in items.js. The comments in this method describe what you need to do to implement it.

* If you have completed this problem successfully, you should be able to add reviews to products. To test your code, experiment with adding reviews to the Leaf Sticker. To add a review, complete the "Add a Review" form on any individual product's page and click "Submit Review". You should see the review appear beneath the "Latest Reviews" heading. When correctly created, reviews will contain the following information: - The reviewer name - The date and time the review was made - The number of stars provided by the reviewer - The reviewer comments

## Lab 5: 

The cart.js file implements data access for the cart collection. The cart collection contains the shopping carts for users of the MongoMart application.

The mongomart.js application instantiates a cart data access object (DAO) with this call:

var cart = new CartDAO(db);
The DAO, cart, is used throughout mongomart.js to implement several of the routes in this application.

In this lab, you will implement the method in cart.js necessary to support the route for viewing a shopping cart. This route is implemented in mongomart.js in the function that begins with this line:

router.get("/cart", function(req, res) {
The method you will implement in cart.js is: getCart(). The comments in this method describe what you need to do to implement it.

## Lab 6: 

## Lab 7: 