
var port = process.env.PORT || 1337;
var baseHost = process.env.WEBSITE_HOSTNAME || 'localhost';

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
  if (baseHost === 'localhost')
  {
    app.setHost(baseHost + ':' + port);
  } else {
    app.setHost(baseHost);
  }
    console.log("Server started ..");
});
