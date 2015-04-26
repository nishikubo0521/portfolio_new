var express = require('express');
var app = express();
//var ejs = require('ejs');
var router = express.Router();
var port = process.env.PORT || 8000;
var json = require('./data.json');

var projects = json.projects;

console.log(json.projects[0]);
console.log(process.env);
console.log(__dirname);

app.use(express.static(process.env.PWD + '/'));
app.set('views', process.env.PWD + "/views");
app.set('view engine', 'ejs');

app.get('/:path', function(req, res){

  // initialize a project to render
  var requestedProject = projects[0];

  //FIXME : Need to pick data by index number; 
  for(var i = 0; i < projects.length; i++){
    if( projects[i].path == req.params.path ){
      requestedProject = projects[i];
    }
  }

  res.render('project-detail', { 
    pjax : false,
    project : requestedProject 
  });

  console.log(req.query);
  console.log(req.params.index);
});

app.get('/', function(req, res){
  res.render('layout', { 
    projects : projects,
  });
  console.log(req.query.index);
});


app.listen(port);
console.log('listening to port:' + port);

/*
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
*/
