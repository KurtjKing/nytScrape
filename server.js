
var express = require("express");
 bodyParser = require("body-parser");
 logger     = require("morgan");
 mongoose   = require("mongoose");
  path       = require("path");
 axios      = require("axios");

// Requiring Note and Article models
var Note    = require("./models");
var Article = require("./models");

// Scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//Define port
var port = process.env.PORT || 3000

// Initialize Express
var app = express();

var db = require("./models");

app.use(logger("dev"));


app.use(express.static("public"));

mongoose.connect("mongodb://localhost/mongoosescraper", { useNewUrlParser: true });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

var exphbs = require("express-handlebars");

// app.set('views', path.join(__dirname, './views'));

// console.log( path.join(__dirname, './views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// make public static

// Import routes and give the server access to them.
var routes = require("./controllers/htmlRoutes.js");

app.use(routes);


// var db = mongoose.connection;

//   routes
// A GET route for scraping the echoJS website
app.get("/scrape", function(req, res) {
    // First, we grab the body of the html with axios
    axios.get("https://www.nytimes.com/").then(function(response) {
      // Then, we load that into cheerio and save it to $ for a shorthand selector
      var $ = cheerio.load(response.data);
  
      // Now, we grab every h2 within an article tag, and do the following:
      $("article a").each(function(i, element) {
        // Save an empty result object
        var result = {};
  
        // Add the text and href of every link, and save them as properties of the result object
        result.title = $(element)
          // .children("h2")
          .text();
        // result.summary = $(this).children(".summary").text();  
        result.link = $(element)
          // .children("a")
          .attr("href");
  console.log("title" + result.title +" link:"+ result.link);

        // Create a new Article using the `result` object built from scraping
        db.Article.create(result)
          .then(function(dbArticle) {
            // View the added result in the console
            console.log(dbArticle);
          })
          .catch(function(err) {
            // If an error occurred, log it
            console.log("error");
          });
      });
  
      // Send a message to the client
      res.send("Scrape Complete");
    });
  });



// Listen on port
app.listen(port, function() {
    console.log("App running on port " + port);
  });