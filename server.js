var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var exphbs = require("express-handlebars");
// Port configuration for local/Heroku
var PORT = process.env.PORT || 8080;

// Initialize Express
var app = express();

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Configure middleware
// Handlebars
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Controllers
var router = require("./controllers/api");
app.use(router);

var syncOptions = {
    force: false
};

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "test") {
    syncOptions.force = true;
}
module.exports = app;

mongoose.set('useFindAndModify', false);
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
// mongoose.connect("mongodb://localhost/NPR", { useNewUrlParser: true });

// Set mongoose to leverage built in JavaScript ES6 Promises
// Connect to the Mongo DB
// mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);


// Make public a static folder
app.use(express.static("public"));


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
