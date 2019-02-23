
// var express = require("express");
//  bodyParser = require("body-parser");
//  logger     = require("morgan");
//  mongoose   = require("mongoose");
//  path       = require("path");
//  axios      = require("axios");

// // Requiring Note and Article models
// var Note    = require("./models/Note.js");
// var Article = require("./models/Article.js");

// // Scraping tools
// var axios = require("axios");
// var cheerio = require("cheerio");

// // Set mongoose to leverage built in JavaScript ES6 Promises
// mongoose.Promise = Promise;

// //Define port
// var port = process.env.PORT || 3000

// // Initialize Express
// var app = express();

// var db = require("./models");

// app.use(logger("dev"));
// app.use(bodyParser.urlencoded({
//     extended:false
// }));

// // make public static
// app.use(express.static("public"));


// var exphbs = require("express-handlebars");

// app.engine("handlebars", exphbs({
//    defaultLayout: "main"}));

// app.set("view engine","handlebars");


// mongoose.connect("mongodb://localhost/mongoosescraper", { useNewUrlParser: true });
// // var db = mongoose.connection;


// db.on("error", function(error){
//     console.log("error:", error);
// });

// db.once("open", function() {
//     console.log("Mongoose connection successful.");
//   });



// //   routes


  
//     // A GET route for scraping the echoJS website
// app.get("/scrape", function(req, res) {
//     // First, we grab the body of the html with axios
//     axios.get("https://www.nytimes.com/").then(function(response) {
//       // Then, we load that into cheerio and save it to $ for a shorthand selector
//       var $ = cheerio.load(response.data);
  
//       // Now, we grab every h2 within an article tag, and do the following:
//       $("article").each(function(i, element) {
//         // Save an empty result object
//         var result = {};
  
//         // Add the text and href of every link, and save them as properties of the result object
//         result.title = $(this)
//           .children("h2")
//           .text();
//         result.summary = $(this).children(".summary").text();  
//         result.link = $(this)
//           .children("h2")
//           .children("a")
//           .attr("href");
  
//         // Create a new Article using the `result` object built from scraping
//         db.Article.create(result)
//           .then(function(dbArticle) {
//             // View the added result in the console
//             console.log(dbArticle);
//           })
//           .catch(function(err) {
//             // If an error occurred, log it
//             console.log(err);
//           });
//       });
  
//       // Send a message to the client
//       res.send("Scrape Complete");
//     });
//   });



// // Listen on port
// app.listen(port, function() {
//     console.log("App running on port " + port);
//   });


var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/unit18Populater", { useNewUrlParser: true });

// Routes

// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
  // First, we grab the body of the html with axios
  axios.get("http://www.echojs.com/").then(function(response) {
    // Then, we load that into cheerio and save it to $ for a shorthand selector
    var $ = cheerio.load(response.data);

    // Now, we grab every h2 within an article tag, and do the following:
    $("article h2").each(function(i, element) {
      // Save an empty result object
      var result = {};

      // Add the text and href of every link, and save them as properties of the result object
      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      // Create a new Article using the `result` object built from scraping
      db.Article.create(result)
        .then(function(dbArticle) {
          // View the added result in the console
          console.log(dbArticle);
        })
        .catch(function(err) {
          // If an error occurred, log it
          console.log(err);
        });
    });

    // Send a message to the client
    res.send("Scrape Complete");
  });
});