const express = require('express')
const app = express()
const database = require('./database.js')
const fs = require('fs')
const multer  = require('multer')
const path = require("path")
const get = require('./get.js')
const post = require('./post.js')

app.use('/works', express.static(__dirname + '/works'))
app.use('/public', express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var formatDate = function(date) {
  var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear(),
      hours = d.getHours(),
      minutes = d.getMinutes(),
      seconds = d.getSeconds();

  if (month.length < 2)
      month = '0' + month;
  if (day.length < 2) 
      day = '0' + day;
 
  return [year,month,day,hours,minutes,seconds].join('-');
};

let storage = multer.diskStorage({

    destination: function( req, file, cb ){

      var dir = __dirname + '/works' + '/' + req.body.path;

      if( !fs.existsSync(dir) ) fs.mkdirSync(dir);

      console.log(' >>>>>>>>> 파일첨부 >>>>>>>>>  add.js > file : \n', file)
      console.log(' >>>>>>>>> 파일첨부 >>>>>>>>>  add.js > dir : \n', dir)

      cb(null, 'works/' + req.body.path)

    },

    filename: function( req, file, cb ) {

      let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extension);
        cb(null, basename + "_" + formatDate(Date.now()) + extension);

      }
    })

let upload = multer({ storage: storage })

app.set('views', __dirname + '/views')

app.get('/', get.index)
app.all('/works/form', get.works_form)
app.get('/works/view/:id', get.works_view)
app.post('/works/add', upload.single('addfile'), post.addWork)
app.post('/works/update', upload.single('addfile'), post.updateWork)
app.post('/works/delete', post.deleteWork)

app.set('view engine', 'ejs')
app.set('URL', 'http://localhost:3000')

app.listen(3000, (err)=>{
      if(err)throw err
    console.log(' \n ************************ SERVER START ON PORT 3000 ************************ \n')
    database.init(app)    

});