var express = require('express'),
    app = express();
var ejs = require('ejs');
var favicon = require('serve-favicon');
var port = process.env.PORT || 8000;
var json = require('./data.json'),
    projects = json.projects;

/*
* Initializes request information object and determines if the request is sent by AJAX
*/
var isAJAX = function(req, res, next) {
  // For debug
  req.log = "";

  //Initialize
  req.info = {
    isAJAX: false,
    requestedPage: "",
    projects: projects,
    requestedProjectDetail: null
  }

  if (req.query.ajax) {
    req.info.isAJAX = true;
  }

  req.log += 'ajax: ' + req.info.isAJAX + '\n';

  next();
}

/*
*Adds a requested section to request information object
*/
var sectionRequestHandler = function(req, res, next) {
  req.info.requestedPage = req.params.path;
  req.log += 'requestedPage: ' + req.info.requestedPage + '\n';

  next();
}

/*
* Adds a requested project detail to request information object
*/
var projectRequestHandler = function(req, res, next) {
  req.info.requestedPage = 'work';

  for (var i = 0; i < projects.length; i++) {
    if (projects[i].path == '/work/' + req.params.project) {
      req.info.requestedProjectDetail = projects[i];
    }
  }

  req.log += 'requestedPage: ' + req.info.requestedPage + '\n';
  req.log += 'requestedProjectDetail: ' + req.info.requestedProjectDetail.name + '\n';

  next();
}

/*
* Renders content based on request information
*/
var layout = function(req, res) {
  console.log(req.log)
  res.render('layout', req.info);
}

//Defines a template engine to use
app.set('views', process.env.PWD + "/views");
app.set('view engine', 'ejs');

//Middleware for static files 
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static('public'));
app.use(express.static('bower_components'));

//Middleware which determines if the request is AJAX
app.get(['/', '/:path', '/work/:project'], isAJAX);

//routing
app.get('/', layout);
app.get('/:path', sectionRequestHandler, layout);
app.get('/work/:project', projectRequestHandler, layout);

app.listen(port);
console.log('listening to port:' + port);