var express = require('express');
var router = express.Router();


var Trending = require("github-trend");
var scraper = new Trending.Scraper();

var data = [];
var langs = ["", "csharp", "javascript"]; // Empty string means 'all languages'



router.get('/', function (req, res, next) {
    fetchTrendingRepos(langs)
        .then(function () {
            res.setHeader('Content-Type', 'application/json');
            res.send(JSON.stringify(data))
        })
        .catch(function (err) {
            console.log(err.message);
        });
});



function fetchTrendingRepos(languageArray) {
    return languageArray.reduce((promise, language) => {
        return promise.then(() => {
            return scraper.scrapeTrendingReposFullInfo(language)
                .then(repos => {
                    data = data.concat(repos);
                });
        });
    }, Promise.resolve());
}

module.exports = router;