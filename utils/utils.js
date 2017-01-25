var mongojs = require('mongojs');

var supportedLanguages = [
    {
        lang: ""  // Empty string means 'all languages'
    },
    {
        lang: "csharp"
    },
    {
        lang: "javascript"
    },
    {
        lang: "css"
    },
    {
        lang: "html"
    },
    {
        lang: "java"
    },
    {
        lang: "php"
    },
    {
        lang: "swift"
    },
    {
        lang: "python"
    }
];

var getClosestMonday = function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
    return new Date(d.setDate(diff));
};

var getRepoCompositeId = function getRepoCompositeId(trendingRepo) {
    var monday = getClosestMonday(trendingRepo.scrapeTime);
    var date = monday.getDate() + '/' + monday.getMonth();
    var result = trendingRepo.owner + trendingRepo.name + trendingRepo.langCode + trendingRepo.type + date;
    return result;
}


var getDB = function getDB() {
    var db;
    if (process.env.mongoDBConnection) {
        db = mongojs(process.env.mongoDBConnection);
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
    
    var prefix = repo.langCode || "allLang";
    var accessToken = process.env[prefix + "AccessToken"] || secret[prefix + "AccessToken"];
    return accessToken;
}


var removeByAttr = function removeByAttr(arr, attr, value) {
    var i = arr.length;
    while (i--) {
        if (arr[i]
            && arr[i].hasOwnProperty(attr)
            && (arguments.length > 2 && arr[i][attr] === value)) {

            arr.splice(i, 1);

        }
    }
    return arr;
}

var logReposByLang = function logReposByLang(repos) {
    var langCodes = repos.map(repo => repo.langCode);
    var countPerLang = langCodes.reduce((counts, item) => {
        if (item in counts) {
            counts[item]++;
        }
        else {
            counts[item] = 1;
        }
        return counts;
    }, {});

    var distinctLangs = Object.keys(countPerLang);
    distinctLangs.forEach((lang) => {
        console.log(' ', countPerLang[lang], lang || 'top');
    });
    console.log(' ', 'TOTAL ', repos.length);
    return countPerLang;
}

module.exports.getClosestMonday = getClosestMonday;
module.exports.getRepoCompositeId = getRepoCompositeId;
module.exports.getDB = getDB;
module.exports.getRandomItem = getRandomItem;
module.exports.getAccessTokenByRepo = getAccessTokenByRepo;
module.exports.removeByAttr = getAccessTokenByRepo;
module.exports.logReposByLang = logReposByLang;
module.exports.supportedLanguages = supportedLanguages;
