var utils = require('../utils/utils');
var express = require('express');
var router = express.Router();
var FB = require('fb');

var db = utils.getDB();



router.get('/', function (req, res, next) {



  //load all
  db.repos.find({ posted: { $ne: true } }, (err, repos) => {
    if (err) {
      resp.send(err);
    }



    var interval = setInterval(() => {
      if (repos.length) {
        var randRepo = utils.getRandomItem(repos);
        postToFB(randRepo, res);
        removeByAttr(repos, '_id', randRepo._id);
      } else {
        res.send('all repos posted');
        clearInterval(interval);
      }
    }, 1000)



  })


});

function postToFB(repo, res) {

  FB.setAccessToken(utils.getAccessTokenByRepo(repo));

  var fbPost = {
    message: repo.description + " \r\n(" + repo.todaysStars + ", " + repo.allStars + " total, written on " + repo.language + " )",
    link: "http://www.github.com/" + repo.owner + "/" + repo.name,
    name: repo.name
  }
  var body =
    FB.api('me/feed', 'post', fbPost, function (res) {
      if (!res || res.error) {
        console.log(!res ? 'error occurred' : res.error);
        return;
      }
      console.log('New Post - : ' + res.id);

      repo.posted = true;
      db.repos.update({ "_id": repo._id }, repo);
    });

}


function removeByAttr(arr, attr, value) {
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
module.exports = router;