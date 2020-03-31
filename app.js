var express = require('express')
var app = express()
var database = require('./database.js')
const fs = require('fs')
const multer  = require('multer')
const path = require("path")
var routes = require('./routes.js')

app.use('/works', express.static('./works'))
app.use('/public', express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var get = require('./get.js')
var post = require('./post.js')

let storage = multer.diskStorage({
    destination: function(req, file, cb){
      var works = req.app.get('works');
      var dirpath = works + '/' + req.body.path;
      if(!fs.existsSync(dirpath)) fs.mkdirSync(dirpath)
      console.log('path:::','works/' + req.body.path)
      cb(null, 'works/' + req.body.path)
    },
    filename: function(req, file, cb){
      let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extension);
        cb(null, basename + "_" + functions.formatDate(Date.now()) + extension);
      }
    })

let upload = multer({ storage: storage })

routes(app)

app.get('/', get.renderIndex)
app.get('/work/view/:id', get.renderView)
app.get('/work/canvas/:id', get.renderCanvas)
app.post('/work/add', upload.single('addfile'), post.processAddWork)

//app.set('works', __dirname + '/works');
app.set('views', __dirname + '/views')
app.set('view engine', 'ejs')
app.set('URL', 'http://localhost:3000')

app.listen(3000, (err)=>{
      if(err)throw err
    console.log(' \n ****************** SERVER START ON PORT 3000 ****************** \n')
    database.init(app)
});
