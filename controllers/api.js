var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");
var router = express.Router();
var axios = require("axios");
var cheerio = require("cheerio");
var app = express();

// Require all models
var db = require("../models");


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

            db.Article.create(result).then(function (dbArticle) {
                console.log(dbArticle);
            })
                .catch(function (err) {
                    console.log(err);
                });
        });
        //send message client
        res.send("Scrape Complete");
    })
});

router.get("/", (req, res) => {
    db.Article.find({}, null, { sort: { title: -1 } }).lean()
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            const retrievedArticles = dbArticle;
            let hbsObject;
            hbsObject = {
                articles: dbArticle
            };
            res.render("index", hbsObject);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});
// Route for getting all Articles from the db
router.get("/articles", function (req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
        .then(function (dbArticle) {
            // If we were able to successfully find Articles, send them back to the client
            res.json(dbArticle);
        })
        .catch(function (err) {
            // If an error occurred, send it to the client
            res.json(err);
        });
});
module.exports = router;