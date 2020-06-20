var express = require("express");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
var db = require("../models");
const { response } = require("express");


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
                res.redirect('/');
                return
            }
            else if (error || response.statusCode != 200) {
                res.send("Error: Unable to Receive New Articles");
            }
        });
    });
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
module.exports = router;
