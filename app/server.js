
var port = process.env.PORT || 1337;
var http = require('http');
var express = require('express');
var swaggerize = require('swaggerize-express');

var app = express();

var server = http.createServer(app);

app.use(swaggerize({
    api: require('./api.json'),
    docspath: '/swagger',
    handlers: './handlers/'
}));

app.use('/', express.static(__dirname + '/html'));

server.listen(port, 'localhost', function () {
    app.setHost(server.address().address + ':' + port);
    console.log("Server started..");
});
