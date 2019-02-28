var express = require("express");
var axios = require("axios");

var router = express.Router();

var db = require("../models");

mongoose.connect("mongodb://localhost/mongoosescraper", { useNewUrlParser: true });

// Create all our routes and set up logic within those routes where required.
router.get("/", function(req, res) {
    db.Article.find({})
    .then(function(dbArticle) {
        var hbsObject = {
            articles:  dbArticle
          };
          console.log(hbsObject);
          res.render("home", hbsObject);
    })
    .catch(function(err) {
      // If an error occurred, send it to the client
      res.json(err);
    });
    });

//   routes
// A GET route for scraping the echoJS website
router.get("/scrape", function(req, res) {
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

  // This will get the articles we scraped from the mongoDB
router.get("/articles", function(req, res) {
  // Grab every doc in the Articles array
  Article.find({}, function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    // Or send the doc to the browser as a json object
    else {
      res.json(doc);
    }
  });
});

// Grab an article by it's ObjectId
router.get("/articles/:id", function(req, res) {
  Article.findOne({ "_id": req.params.id })
  .populate("note")
  .exec(function(error, doc) {
    // Log any errors
    if (error) {
      console.log(error);
    }
    else {
      res.json(doc);
    }
  });
});


// Save an article
router.post("/articles/save/:id", function(req, res) {
  // Use the article id to find and update its saved boolean
  Article.findOneAndUpdate({ "_id": req.params.id }, { "saved": true})
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    else {
      // Or send the document to the browser
      res.send(doc);
    }
  });
});

// Delete an article
router.post("/articles/delete/:id", function(req, res) {
  // Use the article id to find and update its saved boolean
  Article.findOneAndUpdate({ "_id": req.params.id }, {"saved": false, "notes": []})
  // Execute the above query
  .exec(function(err, doc) {
    // Log any errors
    if (err) {
      console.log(err);
    }
    else {
      // Or send the document to the browser
      res.send(doc);
    }
  });
});


// Create a new note
router.post("/notes/save/:id", function(req, res) {
// Create a new note and pass the req.body to the entry
var newNote = new Note({
body: req.body.text,
article: req.params.id
});
console.log(req.body)
// And save the new note the db
newNote.save(function(error, note) {
// Log any errors
if (error) {
  console.log(error);
}
// Otherwise
else {
  // Use the article id to find and update it's notes
  Article.findOneAndUpdate({ "_id": req.params.id }, {$push: { "notes": note } })
  // Execute the above query
  .exec(function(err) {
    // Log any errors
    if (err) {
      console.log(err);
      res.send(err);
    }
    else {
      // Or send the note to the browser
      res.send(note);
    }
  });
}
});
});

// Delete a note
router.delete("/notes/delete/:note_id/:article_id", function(req, res) {
// Use the note id to find and delete it
Note.findOneAndRemove({ "_id": req.params.note_id }, function(err) {
// Log any errors
if (err) {
  console.log(err);
  res.send(err);
}
else {
  Article.findOneAndUpdate({ "_id": req.params.article_id }, {$pull: {"notes": req.params.note_id}})
   // Execute the above query
    .exec(function(err) {
      // Log any errors
      if (err) {
        console.log(err);
        res.send(err);
      }
      else {
        // Or send the note to the browser
        res.send("Note Deleted");
      }
    });
}
});
});

// Export routes for server.js to use.
module.exports = router;