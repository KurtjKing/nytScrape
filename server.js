
var express = require("express");
 bodyParser = require("body-parser");
 logger     = require("morgan");
 mongoose   = require("mongoose");
 path       = require("path");

// Requiring Note and Article models
var Note    = require("./models/Note.js");
var Article = require("./models/Article.js");

// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//Define port
var port = process.env.PORT || 3000

// Initialize Express
var app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({
    extended:false
}));

// make public static
app.use(express.static("public"));


var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({
   defaultLayout: "main"}));

app.set("view engine","handlebars");


mongoose.connect("mongodb://localhost/mongoscraper");
var db = mongoose.connection;

db.on("error", function(error){
    console.log("error:", error);
});

db.once("open", function() {
    console.log("Mongoose connection successful.");
  });


