var express = require('express');
var app = express();
var fs = require('fs');
var router = express.Router();

app.use('/works', express.static('works'));
app.use('/js', express.static('js'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var database = require('./database.js');
var routes = require('./routes.js');
routes(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('URL', 'http://localhost:3000');


app.listen(3000, (err)=>{
    if(err)throw err;
    console.log('listening on port 3000');
    database.init(app, routes);
});
