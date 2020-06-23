var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");


// Require all models
var db = require("../models");
// const { response } = require("express");


//get route for npr website
router.get("/scrape", function (req, res) {
    axios.get("https://www.npr.org/sections/news/").then(function (response) {
        console.log("Scraped");
        var $ = cheerio.load(response.data);
        // console.log(req);
        // console.log(res);
        $(".item-info").each(function (i, element) {
            var count = i;
            var result = {};
            result.title = $(this).children(".title").children("a").text();
            result.link = $(this).children(".title").children("a").attr("href");
            result.teaser = $(this).children(".teaser").text();
            if (result.title && result.link && result.teaser) {
                db.Article.create(result).then(function (dbArticle) {
                    console.log(dbArticle);
                })
                    .catch(function (err) {
                        console.log(err);
                    });
            }
        });
        res.redirect('/');
    }).catch(function (err) {
        console.log(err);
    }
    );
});

router.get("/", (req, res) => {
    db.Article.find({}, null, { sort: { teaser: -1 } }).limit(-50).lean()
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            const retrievedArticles = dbArticle;
            let hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            if (dbArticle.length === 0) {
                alert("No new articles");
            } else {
                res.render("index", hbsObject);
            }
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});
router.get("/saved", (req, res) => {
    db.Article.find({ saved: true }, null, { sort: { teaser: -1 } }).lean()
        .then(function (retrievedArticles) {
            // If we were able to successfully find Articles, send them back to the client
            let hbsObject;
            hbsObject = {
                articles: retrievedArticles
            };
            res.render("savedArticles", hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({}).limit(-50)
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});


router.put("/save/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: true })
        .then(function (data) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(data);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });;
});

router.put("/remove/:id", function (req, res) {
    db.Article.findOneAndUpdate({ _id: req.params.id }, { saved: false })
        .then(function (data) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(data)
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});
// Route for grabbing a specific Article by id, populate it with it's note
router.get("/articles/:id", function (req, res) {
    // Using the id passed in the id parameter, prepare a query that finds the matching one in our db...
    db.Article.findOne({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate({ path: 'note', model: 'Note' })
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
router.post("/articles/:id", function (req, res) {
    console.log(req.body);
    // var result = {};
    // console.log(result);
    // Create a new note and pass the req.body to the entry
    db.Note.create(req.body)
        .then(function (dbNote) {
            // console.log(req.body);
            // console.log(" THIS IS RES +++++++++++++++++++++++++++++++++++++ " + res);
            console.log(dbNote);
            // If a Note was created successfully, find one Article with an `_id` equal to `req.params.id`. Update the Article to be associated with the new Note
            // { new: true } tells the query that we want it to return the updated User -- it returns the original by default
            // Since our mongoose query returns a promise, we can chain another `.then` which receives the result of the query
            return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
        })
        .then(function (dbArticle) {
            console.log(dbArticle);
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
            // If an error occurred, send it to the client
            res.json(err);
        });
});
router.delete("/note/:id", function (req, res) {
    // Create a new note and pass the req.body to the entry
    db.Note.findByIdAndRemove({ _id: req.params.id })
        .then(function (dbNote) {

            return db.Article.findOneAndUpdate({ note: req.params.id }, { $pullAll: [{ note: req.params.id }] });
        })
        .then(function (dbArticle) {
            // If we were able to successfully update an Article, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});
module.exports = router;
