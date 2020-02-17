var express = require('express');
var app = express();

app.use('/works', express.static('ggg/works'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

var database = require('./database.js');
var routes = require('./routes.js');
routes(app);

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('URL', 'http://localhost:3000');
app.set('works', __dirname + '/works');

app.listen(3000, (err)=>{
    if(err)throw err;
    console.log('listening on port 3000');
    console.log('__dirname', __dirname);
    database.init(app);
});
