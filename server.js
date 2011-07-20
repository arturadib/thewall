//
// server.js for The Wall
//

var express = require('express');
var port = process.env.PORT || 8989;

var app = express.createServer();
app.use(express.bodyParser());
app.use(app.router);

//
// Static server
//
app.use(express.static(__dirname + '/public'));

//
// POST /api/posts
//
app.post('/api/posts', function(req, res){
  var entry = req.body;
  entry.id = 123;

  // response
  res.send({id:entry.id}, 201); // 201 == Created
});

app.listen(port);

console.log('Listening on port '+port);
