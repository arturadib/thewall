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
var defaultPost = {
  msg: "It seems like our servers were restarted, so previous posts were lost. How about adding your own? :)",
  avatarPath: "img/halloween_slimer_icon.png",
  name:"TheWall-Bot",
  time:(new Date()).getTime(),
  id:1
};
var posts = [defaultPost];
var id = 2;
var MAXSIZE = 25;

//
// POST /api/posts
//
app.post('/api/posts', function(req, res){
  var entry = req.body;
  entry.id = id++;

  posts.push(entry);
  if (posts.length > MAXSIZE) {
    posts.shift();
  }

  // response
  res.send({id:entry.id}, 201); // 201 == Created
});

//
// GET /api/posts
//
app.get('/api/posts', function(req, res){
  if (req.query.since) {
    var _posts = [];
    posts.forEach(function(post){
      if (post.time > req.query.since) {
        _posts.push(post);
      }
    });
    res.send(_posts);
  }
  else {
    res.send(posts);
  }
});


app.listen(port);

console.log('Listening on port '+port);
