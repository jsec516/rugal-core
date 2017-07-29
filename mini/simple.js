// var express = require('express');
// var app = express();
// app.get('test', function(req, res) {
//     res.send('fine');
// })
// app.listen(2368);

var express = require('express');
var app = express();

app.get('/test', function(req, res){
  res.send('hello world');
});

app.listen(2368);