var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Require all models
var db = require("./models");

// Port configuration for local/Heroku
var PORT = process.env.PORT || process.argv[2] || 8080;

// Initialize Express
var app = express();

// Configure middleware
// Handlebars
const exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));
// Controllers
const router = require("./controllers/api");
app.use(router);
// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });
// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));



// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});
