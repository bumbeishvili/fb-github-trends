var express = require('express');
var router = express.Router();


var Trending = require("github-trend");
var scraper = new Trending.Scraper();

const configs = [
    {
        lang: ""  // Empty string means 'all languages'
    },
    {
        lang: "csharp"
    },
    {
        lang: "javascript"
    }
];

const trendingTypes = {
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY'
}



router.get('/', function (req, res, next) {
    var data = [];
    var langs = configs.map(c => c.lang);

    fetchTrendingRepos(langs, data)
        .then(processRepos.bind(this, res, data))
        .catch(function (err) {
            console.log(err.message);
        });

});


function processRepos(res, data) {
    data.forEach(trendingRepo => {
        trendingRepo.scrapeTime = new Date();
        trendingRepo.postTime = new Date();
    });



    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(data))

}




function fetchTrendingRepos(languageArray, data) {
    return languageArray.reduce((promise, language) => {
        return promise.then(() => {
            return scraper.scrapeTrendingReposFullInfo(language)
                .then(repos => {
                    var extended = repos.map(repo => {
                        repo.langCode = language;
                        repo.type = trendingTypes.DAILY;
                        return repo;
                    });
                    data.push.apply(data, extended);
                });
        });
    }, Promise.resolve());
}

module.exports = router;