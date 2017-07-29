require('ts-node/register');
var serverFactory   = require('./typeindex').init;

var app = serverFactory();
app.start()
// .then(function(rugalServer) {
//     // rugalServer.start();
// })