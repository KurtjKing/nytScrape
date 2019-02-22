
var express = require("express");
 bodyParser = require("body-parser");
 logger     = require("morgan");
 mongoose   = require("mongoose");
 path       = require("path");

// Requiring Note and Article models
var note    = require("./models/note.js");
var article = require("./models/article.js");

// Scraping tools
var request = require("request");
var cheerio = require("cheerio");

// Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//Define port
var port = process.env.PORT || 3000

// Initialize Express
var app = express();