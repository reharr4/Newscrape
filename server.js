var express = require("express");
var mongoose = require("mongoose");
var logger = require("morgan");

// scraping tools
var axios = require("axios");
var cheerio = require("cheerio");

// require all models
var db = require("./models");

var PORT = 3030;
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
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
mongoose.connect(MONGODB_URI, { useNewUrlParser: true});

// create new User document
db.User.create({name: ""})
.then(function(dbUser){
    console.log(dbUser);
})
.catch(function(err){
    console.log(err.message);
});

// Routes

// GET route for scraping
app.get("/scrape", (req,res) =>{
    axios.get("https://www.nytimes.com/section/arts").then(function(response){
        var $ = cheerio.load(response.data);

        // grab whatchu gonna grab from website
    $(".story-body").each(function(i, element){

        var result = {};

        // add text and href of every link and save as properties of result object
        result.title = $(this).children(".headline").text().trim();
        result.link = $(".headline").children("a").attr("href");
        result.lead = $(this).children(".summary").text().trim();
        result.byline = $(this).children(".byline").text().trim();

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

// get all Notes
app.get("/notes", function(req, res){
    // find all Notes
    db.Note.find({})
    .then(function(dbNote){
        // if all Notes are successfully found, return to client
        res.json(dbNote);
    })
    .catch(function(err){
        // return error if one occurs
        console.log(err);
    });
});

// get all Users
app.get("/user", function(req, res){
    // find all Users
    dbUser.find({})
    .then(function(dbUser){
        // if all Users are successfully found, return to client
        res.json(dbUser);
    })
    .catch(function(err){
        // return error if one occurs
        console.log(err);
    });
});

// Route to get all User's and populate them with their notes
app.get("/populateduser", function(req, res) {
    // Find all users
    db.User.find({})
      // Specify that we want to populate the retrieved users with any associated notes
      .populate("notes")
      .then(function(dbUser) {
        // If able to successfully find and associate all Users and Notes, send them back to the client
        res.json(dbUser);
      })
      .catch(function(err) {
        // If an error occurs, send it back to the client
        res.json(err);
      });
  });

// start the server
app.listen(PORT, function(){
    console.log("App is running on port " + PORT + "!");
});