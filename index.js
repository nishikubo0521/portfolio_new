var express = require('express');
var app = express();
var router = express.Router();
var port = process.env.PORT || 8000;
var json = require('./data.json');
var projects = json.projects;

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
  
  console.log(req.header('X-PJAX'));

  if (req.header('X-PJAX')) {
    res.render('layout', { 
      pjax : true,
      directAccess : false,
      projects : projects,
      project : requestedProject 
    });
  }else{
    res.render('layout', { 
      pjax : false,
      directAccess : true,
      projects : projects,
      project : requestedProject 
    });
  }

});

app.get('/', function(req, res){
  res.render('layout', {
    pjax : false, 
    directAccess : false,
    projects : projects,
    project : {image : null}
  });
  console.log(req.query.index);
});


app.listen(port);
console.log('listening to port:' + port);

/*
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
