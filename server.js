var express = require("express")
var app = express()

app.get('/', function (req, res){
  var h = req.headers
  var ip;
  if (h['x-forwarded-for']) {
      ip = h['x-forwarded-for'].split(",")[0];
  } else if (req.connection && req.connection.remoteAddress) {
      ip = req.connection.remoteAddress;
  } else {
      ip = req.ip;
  }
  res.send({'ip-address': ip, 
    language : h['accept-language'].split(',')[0],
    'operating-system': h['user-agent'].slice(h['user-agent'].indexOf('(') + 1, h['user-agent'].indexOf(')'))
  })
})
app.listen(8080, function () {
  console.log('Request header parser listening on port 8080!')
})