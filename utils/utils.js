var mongojs = require('mongojs');

var getClosestMonday = function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

var getRepoCompositeId = function getRepoCompositeId(trendingRepo) {
    var monday = getClosestMonday(trendingRepo.scrapeTime);
    var date = monday.getDate() + '/' + monday.getMonth();
    var result = trendingRepo.owner + trendingRepo.name + trendingRepo.type + date;
    return result;
}


var getDB = function getDB() {
    var db;
    if (process.env.PORT) {

    } else {
        var secret = require('./secretGitIgnore');
        db = mongojs(secret.mongoDBConnection);
    }
    return db;
}

var getRandomItem = function getRandomItem(items) {
    var item = items[Math.floor(Math.random() * items.length)];
    return item;
}

var getAccessTokenByRepo = function getAccessTokenByRepo(repo) {
    var secret;
    if (!process.env.PORT) {
        secret = require('./secretGitIgnore');
    }
    var langTokenMap = {
        "": process.env.port || secret.allLangAccessToken,
        "csharp": process.env.port || secret.cSharpAccessToken,
        "javascript": process.env.port || secret.jsAccessToken,
    };


    var accessToken = langTokenMap[repo.langCode];
    return accessToken;
}


module.exports.getClosestMonday = getClosestMonday;
module.exports.getRepoCompositeId = getRepoCompositeId;
module.exports.getDB = getDB;
module.exports.getRandomItem = getRandomItem;
module.exports.getAccessTokenByRepo = getAccessTokenByRepo;