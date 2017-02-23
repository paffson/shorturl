
var express = require("express")
var app = express()

var mongo = require('mongodb').MongoClient,
test = require('assert')

var validUrl = require('valid-url');

var url = 'mongodb://localhost:27017/app'

mongo.connect(url, function(err, db) {
  test.equal(null, err);
   //db.collection('urls').drop()
    console.log("creating counters collection if it doesn't exist")
    db.collection('counters').insert(
    {
        _id: "shorturl",
        seq: 0
    })
    db.collection('urls').find(
    ).toArray(function(err, documents) {
          test.equal(null, err);
          //console.log(documents);
    })
  db.close();
})

app.get('/', function (req, res){
  res.send('Usage example: '+ req.headers['x-forwarded-proto'] + '://' + req.get('host') + '/new/http://google.com')
})
app.get('/:shorturl', function (req, res){
  var shorturl = +req.params.shorturl
  // get long version of url from the collection
  // if it's not there - respond with error
  // else respond with redirection to it  
    mongo.connect(url, function(err, db) {
      test.equal(null, err)
  
      var urls = db.collection('urls')
      console.log(shorturl)
      urls.findOne({shorturl : +shorturl}, {longurl: 1}
      ,function(err, doc) {
          test.equal(null, err)
          if (doc === null)
            res.send({error: 'url not known'})
          else {
            res.redirect(doc.longurl)
          }
          db.close()
      })      
    })
})
app.get('/new/:url*', function (req, res){
  // if url invalid
  //   respond with error message
  // else (url valid)
  // if url not already in collection
  // create short url and insert into the collection
  // respond with json of long and short urls
  
  var longUrl = req.params.url + req.params[0];
  longUrl = longUrl.toLowerCase()
  
  var valid = longUrl.startsWith('http') || longUrl.startsWith('https')
  valid = valid && validUrl.isUri(longUrl)
  if (!valid){
      res.send({error: 'Not a valid url'})
      return
  } 

    mongo.connect(url, function(err, db) {
      test.equal(null, err)
  
      var urls = db.collection('urls')
      console.log(longUrl)
      urls.findOne({longurl : longUrl}, {shorturl: 1}
      ,function(err, doc1) {
          test.equal(null, err)
          if (doc1 === null)
          {
            var counters = db.collection('counters')
            counters.findAndModify(
              { _id: 'shorturl' },
                  [],
                  {$inc: { seq: 1 }},            
                  {new: true},
                  function(err, counter){
                    if (err) throw err;
                    var doc = {longurl: longUrl, shorturl: counter.value.seq}
                    res.send({longurl: longUrl, shorturl: req.headers['x-forwarded-proto'] + '://' + req.get('host') + '/' + counter.value.seq})
                    urls.insert(doc, function(err, data) {
                      test.equal(null, err)
                      db.close()
                    })
                  })            
          }
          else {
            res.send({longurl: longUrl, shorturl: req.headers['x-forwarded-proto'] + '://' + req.get('host') + '/' + doc1.shorturl})
            db.close()
          }
      })      
    })
})

app.listen(8080, function () {
  console.log('Url shortener listening on port 8080!')
})