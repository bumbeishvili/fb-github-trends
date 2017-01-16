var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');


var githubTrigger = require('./routes/githubTrigger.js');
var fbTrigger = require('./routes/fbTrigger.js');

var app = express();


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/githubTrigger', githubTrigger);
app.use('/api/fbTrigger', fbTrigger);



var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log('server started on port ' + port);
})
