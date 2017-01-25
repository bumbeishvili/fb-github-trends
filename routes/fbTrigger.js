var utils = require('../utils/utils');
var express = require('express');
var router = express.Router();
var FB = require('fb');

var db = utils.getDB();


router.get('/extendAccessToken/:appId/:appSecret/:token', function (req, nodeRes, next) {

  const client_id = req.params.appId;
  const client_secret = req.params.appSecret;
  const existing_access_token = req.params.token;

  FB.api('oauth/access_token', {
    client_id: client_id,
    client_secret: client_secret,
    grant_type: 'fb_exchange_token',
    fb_exchange_token: existing_access_token
  }, function (res) {
    if (!res || res.error) {
      console.log(!res ? 'error occurred' : res.error);
      nodeRes.send('error + ' + res.error.message);
      return;
    }
    nodeRes.send('success - ' + res.access_token);
    var accessToken = res.access_token;
    var expires = res.expires ? res.expires : 0;
  });
});



router.get('/', function (req, res, next) {

  res.send('Processing started');

  //load unposted
  db.repos.find({ posted: { $ne: true } }, (err, repos) => {

    if (err) {
      console.log(err);
    }

    console.log('------------------------  LOADED UNPOSTED FROM DB ---------------------');
    utils.logReposByLang(repos);


    var interval = setInterval(() => {
      //get repo, which was not posted yet
      db.repos.findOne({ posted: { $ne: true },langCode:{$ne:"csharp"} }, (err, repo) => {
        console.log('Trying to post ', repo.name,repo.langCode)
        if (err) {
          console.log(err);
          clearInterval(interval);
          return;
        }
        if (!repo) {
          console.log('Done!');
          clearInterval(interval);
          return;
        }

        postToFB(repo, res, interval);
      });



    }, 60000)

  });


});

function postToFB(repo, res, interval) {

  FB.setAccessToken(utils.getAccessTokenByRepo(repo));

  var fbPost = {
    message: (repo.description || " ") + " \r\n(" + repo.todaysStars + ", " + repo.allStars + " total, written on " + (repo.language || "markdown") + " )",
    link: "http://www.github.com/" + repo.owner + "/" + repo.name,
    name: repo.name
  }
  var body =
    FB.api('me/feed', 'post', fbPost, function (res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        clearInterval(interval);
        return;
      }
      console.log('New Post - : ', res.id, ' - ', repo.langCode || "Top", repo.name);

      repo.posted = true;
      db.repos.update({ "_id": repo._id }, repo);
    });
}



module.exports = router;
