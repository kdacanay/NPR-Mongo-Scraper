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
            // var count = i;
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
                        red.json(err);
                    });
            }
        });
        res.redirect('/');
    }).catch(function (err) {
        res.json(err)
    })
    // res.send("scraped");
});

router.get("/", (req, res) => {
    db.Article.find({}, null, { sort: { teaser: -1 } }).limit(-30).lean()
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            const retrievedArticles = dbArticle;
            let hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            if (dbArticle.length === 0) {
                res.render("placeholder", { message: "click scrape for NPR news" });
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
        .populate({ path: 'note', model: "Note" })
        .then(function (data) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(data);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });;
});

router.post("/remove/:id", function (req, res) {
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
    db.Article.findByIdAndUpdate({ _id: req.params.id })
        // ..and populate all of the notes associated with it
        .populate({ path: 'note', model: 'Note' })
        .then(function (dbArticle) {
            // If we were able to successfully find an Article with the given id, send it back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {

            res.json(err);
        });
});

// Route for saving/updating an Article's associated Note
router.put("/articles/notes/:id", function (req, res) {
    console.log(req.body);
    db.Note.create(req.body)
        .then(function (dbNote) {
            // console.log(req.body);
            // console.log(" THIS IS RES +++++++++++++++++++++++++++++++++++++ " + res);
            console.log(dbNote);
            var note = "";
            var note = dbNote.body;
            return db.Article.findByIdAndUpdate({ _id: req.params.id }, ({ note: dbNote._id, body: note }), { new: true });
        })
        .then(function (dbArticle) {
            console.log(dbArticle);
            res.json(dbArticle);
        })
        .catch(function (err) {
            console.log(err);
            // If an error occurred, send it to the client
            res.json(err);
        });
});
router.delete("/articles/:id", function (req, res) {
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

router.delete("/articles/:id", function (req, res) {
    db.Article.findByIdAndRemove({ _id: req.params.id })
        .then(function (data) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(data);
            // window.reload();
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
            res.redirect('/');
        });;
});
module.exports = router;
