/*
 *
 *
 * Server for The Wall
 * By Artur B Adib, 2011
 *
 */

var express = require('express')
  , Mongolian = require('mongolian')
  , ObjectId = require('mongolian').ObjectId;

// Environment
var MAXSIZE = 3; // # of posts per request
var port = process.env.PORT || 8989;

// MongoDB setup
var db = (new Mongolian()).db('thewall');
var posts = db.collection('posts');

// Express setup
var app = express.createServer();
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

//
// POST /api/posts
//
app.post('/api/posts', function(req, res){
  var entry = req.body;

  // db: save
  posts.save(entry, function(err, finalEntry){
    var _id = finalEntry._id.toString();
    res.send({id:_id}, 201); // 201 == Created
  });
});

//
// GET /api/posts
//
app.get('/api/posts', function(req, res){
  var _posts; // result Array

  if (req.query.since && req.query.since > 1) {
    posts.find({time:{$gt:req.query.since}}).sort({time:-1}).limit(MAXSIZE).toArray(function(err, _posts){
      res.send(_posts.reverse()); // so latest posts come last
    });
  }
  else {
    posts.find().sort({time:-1}).limit(MAXSIZE).toArray(function(err, _posts){
      res.send(_posts.reverse()); // so latest posts come last
    });
  }
});

app.listen(port);

console.log('Listening on port '+port);
