var express = require('express');
    app = express(),
    router = express.Router();
var port = process.env.PORT || 8000;
var json = require('./data.json');
    projects = json.projects;

app.use(express.static(process.env.PWD + '/'));
app.set('views', process.env.PWD + "/views");
app.set('view engine', 'ejs');

app.get('/:path', function(req, res){

  var requestedProject = projects[0];

  for(var i = 0; i < projects.length; i++){
    if( projects[i].path == req.params.path ){
      requestedProject = projects[i];
    }
  }

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

