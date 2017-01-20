var utils = require('../utils/utils');
var express = require('express');
var mongojs = require('mongojs');
var router = express.Router();


var Trending = require("github-trend");
var scraper = new Trending.Scraper();

var db = utils.getDB();

const configs = utils.supportedLanguages;

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
    console.log('------------------------  FETCHED FROM GITHUB ---------------------');
    utils.logReposByLang(data);

    data.forEach(trendingRepo => {
        trendingRepo.scrapeTime = new Date();
        trendingRepo.postTime = new Date();
        trendingRepo.compositeId = utils.getRepoCompositeId(trendingRepo);
    });

    /* IF DATA IS MUDDLED, THE UNCOMMENT */
    // //remove all first
    // db.repos.remove({}, (err, repos) => {
    //     console.log('removed');
    // })


    //load all
    db.repos.find(function (err, repos) {
        if (err) {
            resp.send(err);
        }

        console.log('------------------------  LOADED FROM DB ---------------------');
        utils.logReposByLang(repos);

        var newData = [];
        var ids = repos.map(repo => repo.compositeId);

        // add repos,which are new, or was not added more than one week
        data.forEach(newRepo => {
            if (ids.indexOf(newRepo.compositeId) == -1) {
                newData.push(newRepo);
            };
        });

        console.log('------------------------  NEW  ---------------------');
        utils.logReposByLang(newData);
        if (newData.length) {
            db.repos.insert(newData, () => {
                removeOldAndDuplicates();
            })
        } else {
            removeOldAndDuplicates();
        }


        var toBePostedRepos = newData.concat(repos).filter(r => !r.posted);

        console.log('------------------------  WILL BE POSTED ON FB ---------------------');
        utils.logReposByLang(toBePostedRepos);


        res.json(toBePostedRepos);
    })

}


function removeOldAndDuplicates() {
    console.log(' removing duplicates ...');
    db.repos.find(function (err, repos) {
        if (err) {
            resp.send(err);
        }
        repos.sort((a, b) => (a.compositeId > b.compositeId) ? 1 : ((b.compositeId > a.compositeId) ? -1 : 0));



        //remove duplicates
        if (repos.length > 1) {
            for (var i = 1; i < repos.length; i++) {
                if (repos[i].compositeId == repos[i - 1].compositeId) {

                    console.log('removing duplicate ' + repos[i].name);
                    db.repos.remove({ _id: repos[i]._id });
                }
            }
        }

        //remove old
        var date = new Date();
        date.setMonth(date.getMonth() - 1);
        db.repos.remove({ scrapeTime: { $lte: date } }, () => {
            console.log('Done');
        });


    })

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