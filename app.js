var express = require('express');
var app = express();

_DEBUG = false;

if (_DEBUG)
{
    app.get('/', function(req,res) {
        res.sendFile(__dirname + '/client/debug.html')
    })
}
else
{
    app.get('/', function(req,res) {
    res.sendFile(__dirname + '/client/index.html')
})}
app.use('/client', express.static(__dirname + '/client'))


var server = app.listen(8082, function () {
    var port = server.address().port;
    console.log('Server running at port %s', port);
});
