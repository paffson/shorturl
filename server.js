var express = require("express")
var app = express()

app.get('/', function (req, res){
  var h = req.headers
  res.send({'ip-address': h['x-forwarded-for'], 
    language : h['accept-language'].split(',')[0],
    'operating-system': h['user-agent'].slice(h['user-agent'].indexOf('(') + 1, h['user-agent'].indexOf(')'))
  })
})
app.listen(8080, function () {
  console.log('Request header parser listening on port 8080!')
})