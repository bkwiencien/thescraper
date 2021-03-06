 var express = require("express");
var request  = require('request');
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
var handlebars = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var db = require("./models");
var PORT= process.env.PORT ||9000;
var app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));

mongoose.Promise = Promise;
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/news"
var promise = mongoose.connect(MONGODB_URI, {
  useMongoClient: true
});

app.get("/scrape", function(req, res) {
 axios.get("https://news.google.com/news/?gl=US&ned=us&hl=en").then(function(response) {
   
    var $ = cheerio.load(response.data);

    $("c-wiz div div c-wiz").each(function(i, element) {
     
      var result = {};

      result.title = $(this)
        .children("a")
        .text();
      result.link = $(this)
        .children("a")
        .attr("href");

      db.Article
        .create(result)
        .then(function(dbArticle) {
          res.send("Scrape Complete");
        })
        .catch(function(err) {
          res.json(err);
        });
    });
  });
});

app.get("/articles", function(req, res) {
  db.Article
    .find({})
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article
    .findOne({ _id: req.params.id })
    .populate("note")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {
  console.log("here");
  db.Note
    .create(req.body)
    .then(function(dbNote) {
      
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});
app.delete("/articles/:id", function (req, res) {
  var id = req.params.id.toString();
  console.log("am right here");
  db.Note.deleteOne({
    "._id": id
  }).exec(function (error, doc) {
    if (error) {
      console.log(error);
    }
    else {
      console.log("note deleted");
      res.redirect("/" );
    }
  });
});

app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
