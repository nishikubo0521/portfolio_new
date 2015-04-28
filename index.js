var express = require('express'),
    app = express(),
    router = express.Router();
var port = process.env.PORT || 8000,
    json = require('./data.json'),
    projects = json.projects;

app.use(express.static('public'));
app.use(express.static('bower_components'));
app.set('views', process.env.PWD + "/views");
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('layout', {
    pjax : false,
    isActive : {
      work : false,
      aboutme : false,
      contacts : false
    },
    directAccess : false,
    projects : projects,
    project : {image : null},
    state : {
        mainOn : "",
        selected : "",
        active : ""
    }
  });
});

/*ver1*/
app.get('/:path', function(req, res){

  var requestedProject = projects[0];

  var isActive = {
        work : false,
        aboutme : false,
        contacts : false
      }
      isActive[req.params.path] = true;
      console.log(isActive);
      
  if (req.header('X-PJAX')) {
    res.render('layout', { 
      pjax : true,
      isActive : isActive,
      directAccess : false,
      projects : projects,
      project : requestedProject,
      state : {
        mainOn : "",
        selected : "",
        active : ""
      }
    });
  }else{
    res.render('layout', { 
      pjax : false,
      isActive : isActive,
      directAccess : true,
      projects : projects,
      project : requestedProject,
      state : {
        mainOn : "main-on",
        selected : "selected",
        active : "active"
      }
    });
  }

});

/*ver 2*/
app.use('/work', express.static('public'));
app.use('/work', express.static('bower_components'));
app.get('/work/:path', function(req, res){

  var requestedProject = projects[0];

  for(var i = 0; i < projects.length; i++){
    if( projects[i].path == "/work/" + req.params.path ){
      requestedProject = projects[i];
    }
  }

  if (req.header('X-PJAX')) {
    res.render('layout', { 
      pjax : true,
      isActive : {
        work : true,
        aboutme : false,
        contacts : false
      },
      directAccess : false,
      projects : projects,
      project : requestedProject,
      state : {
        mainOn : "",
        selected : "",
        active : ""
      }
    });
  }else{
    res.render('layout', { 
      pjax : false,
      isActive : {
        work : true,
        aboutme : false,
        contacts : false
      },
      directAccess : true,
      projects : projects,
      project : requestedProject,
      state : {
        mainOn : "main-on",
        selected : "selected",
        active : "active"
      }
    });
  }

});


app.listen(port);
console.log('listening to port:' + port);
