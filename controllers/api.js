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
        $(".title").each(function (i, element) {
            var count = i;
            var result = {};
            result.title = $(this).children("a").text();
            result.link = $(this).children("a").attr("href");

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

module.exports = router;