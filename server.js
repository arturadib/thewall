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

// Environment, constants, etc
var MAXSIZE = 25 // # of posts per request
  , PORT = process.env.PORT || 8989
  , MONGO_AUTH = process.env.MONGO_AUTH || 'mongo://localhost:27017/thewall';
  
// MongoDB setup
var db = (new Mongolian(MONGO_AUTH));
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

//
// DELETE /api/posts/:id
//
app.del('/api/posts/:id', function(req, res){
  posts.remove({_id: ObjectId(req.params.id)});
  // response
  res.send({}, 200);
});

app.listen(PORT);

console.log('Listening on port '+PORT);
