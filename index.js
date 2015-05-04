var express = require('express'),
    app = express();
    favicon = require('serve-favicon');
var port = process.env.PORT || 8000,
    json = require('./data.json'),
    projects = json.projects;

var resObj = {};

var router = function(req, res, next) {

  var log = "";

  resObj = {
    isAJAX : false,
    requestedPage : "",
    projects : projects,
    requestedProjectDetail : null
  }

  if (req.query.ajax) {
    resObj.isAJAX = true;
  }

  log += 'ajax: ' + resObj.isAJAX + '\n';

  if (req.params.path) {
    resObj.requestedPage = req.params.path;

    log += 'requestedPage: ' + resObj.requestedPage + '\n';
  }

  if (req.params.project) {

    resObj.requestedPage = 'work';

    for(var i = 0; i < projects.length; i++){
      if( projects[i].path == '/work/' + req.params.project ){
        resObj.requestedProjectDetail = projects[i];
      }
    }

    log += 'requestedPage: ' + resObj.requestedPage + '\n';
    log += 'requestedProjectDetail: ' + resObj.requestedProjectDetail.name + '\n';
  }

  console.log(log);

  next();
};

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.static('public'));
app.use(express.static('bower_components'));
app.use('/work', express.static('public'));
app.use('/work', express.static('bower_components'));
app.set('views', process.env.PWD + "/views");
app.set('view engine', 'ejs');

app.get(['/','/:path','/work/:project'], router, function(req, res){
  res.render('layout', resObj);
});

app.listen(port);
console.log('listening to port:' + port);
