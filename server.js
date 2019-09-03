var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require all models
var db = require("./models");

var PORT = 3000;

// initialize express
var app = express();

// middleware config
// use morgan logger for logging requests
app.use(logger("dev"));
// parse request body as JSON
app.use(express.urlencoded({ extended: true}));
app.use(express.json());
// make public static folder
app.use(express.static("public"));

// connect to Mongo DB
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true});

// Routes

// GET route for scraping
app.get("/scrape", (req,res) =>{
    axios.get("https://www.livescience.com/strange-news").then(function(response){
        const $ = cheerio.load(response.data);

        // grab whatchu gonna grab from website
    $(".article-name").each(function(i, element){
        const result = {};

        // add text and href of every link and save as properties of result object
        result.title = $(this)
        .children("synopsis")
        .text();
        result.link = $(this)
        .children("a")
        .attr("href");

        // create new article using 'result' object built from scraping
        db.Article.create(result)
        .then(function(dbArticle){
            // view added result in console
            console.log(dbArticle);
        })
        .catch(function(err){
            // log error if occured
            console.log(err);
        });
    });

    // send message to user
    res.send("Scrape Complete");
});
});

// route for getting all articles from the db
app.get("/articles", function(req,res){
    // FINISH ROUTE TO GRAB ALL ARTICLES
    db.Article.find({})
    .then(function(dbArticle){
        // if Article finds successful, send back to client
        res.json(dbArticle);
    })
    .catch(function(err){
        // send error if error occured
        res.json(err);
    });
});

// route for grabbing specific Article by id
app.get("/articles/:id", function(req, res){
    // use id passed to query for same id in database
    db.Article.findOne({_id: req.params.id})
    // popuate all notes associated with queried id
    .populate("note")
    .then(function(dbArticle){
        // if found Article with id, send back to user
        res.json(dbArticle);
    })
    .catch(function(err){
        // if error, send error to user
        res.json(err);
    });
});

// route for saving/updating Articles associated Note
app.post("/articles/:id", function(req,res){
    // create notes and pass req.body to entry
    db.Note.create(req.body)
    .then(function(dbNote){
        // if note successfully created, find one Article with id equal to req.params.id
        // Update Article to be associated with new Note
        // {new: true} tells query that we want to return updated (returns original by default)
        // mongoose returns a promise, we can chain another '.then' to receive result of query
    return db.Article.findOneAndUpdate({_id: req.params.id}, {note: dbNote._id}, {new: true});
    })
    .then(function(dbArticle){
        // successfully update Article, send back to client
        res.json(dbArticle);
    })
    .catch(function(err){
        // unsuccessful in update, send error to client
        res.json(err);
    });
});

// start the server
app.listen(PORT, function(){
    console.log("App is running on port " + PORT + "!");
});