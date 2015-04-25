var express = require('express');
var app = express();
var ejs = require('ejs');
var router = express.Router();
var port = process.env.PORT || 8000;

app.set('views', __dirname + "/views");
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('layout');
});

app.get('/test', function(req, res){
  console.log(req.header('X-PJAX'));
  res.render('test', {testvalue: "YEAAAA"});
});

app.get('/test2', function(req, res){
  console.log(req.header('X-PJAX'));
  if (req.header('X-PJAX')) {
    res.render('test2', 
      {
        layout: false,
        testvalue2: 'hapy'
      }
    );
  } else {
    res.render('test2', 
      {
        layout: false,
        testvalue2: 'happy'
      }
    );
  }
});

app.use(express.static(__dirname + '/'));

app.listen(port);
console.log('listening to port:' + port);
