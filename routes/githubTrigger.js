var express = require('express');
var router = express.Router();

var Trending = require("github-trend");
var scraper = new Trending.Scraper();


router.get('/', function (req, res, next) {


    // Empty string means 'all languages'
    scraper.scrapeTrendingReposFullInfo("csharp").then(function (repos) {
        repos.forEach(function (repo) {
            console.log(repo.owner);
            console.log(repo.name);
        });
        res.setHeader('Content-Type', 'application/json');
        res.send({ repos: repos });
    }).catch(function (err) {
        console.log(err.message);
    });

});



module.exports = router;