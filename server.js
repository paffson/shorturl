var express = require("express")
var app = express()
var monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
app.get('/:param', function (req, res) {
  var paramNum = Number(req.params.param)
  var param = req.params.param
  
  var date = Number.isNaN(paramNum)? new Date(param) : new Date(paramNum*1000)
  if(!isNaN(date.getTime()))
    res.send({natural: date.toDateString(), unix: (date.getTime()/1000).toFixed(0)})
  else
    res.send({natural: null, unix: null})
})
app.get('/', function (req, res){
  res.send('Give date or unix seconds as a parameter')
})
app.listen(8080, function () {
  console.log('Timestamp api listening on port 8080!')
})