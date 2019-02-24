var express = require("express");

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

// Export routes for server.js to use.
module.exports = router;