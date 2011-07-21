//
// server.js for The Wall
//

var express = require('express');
var port = process.env.PORT || 8989;

var app = express.createServer();
app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(__dirname + '/public'));

//
// Data store
//
var posts = [];
var id = 1;
var MAXSIZE = 25;

//
// POST /api/posts
//
app.post('/api/posts', function(req, res){
  var entry = req.body;
  entry.id = id++;

  posts.unshift(entry); // most recent first
  if (posts.length > MAXSIZE) {
    posts.pop();
  }

  // response
  res.send({id:entry.id}, 201); // 201 == Created
});

//
// GET /api/posts
//
app.get('/api/posts', function(req, res){
  res.send(posts);
});


app.listen(port);

console.log('Listening on port '+port);
