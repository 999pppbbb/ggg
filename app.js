const express = require('express')
const app = express()
const database = require('./database.js')
const fs = require('fs')
const multer  = require('multer')
const path = require("path")
const functions = require('./functions')
const routes = require('./routes.js')
const get = require('./get.js')
const post = require('./post.js')

app.use('/works', express.static(__dirname + '/works'))
app.use('/public', express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))


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
        cb(null, basename + "_" + functions.formatDate(Date.now()) + extension);

      }
    })

let upload = multer({ storage: storage })

routes(app)

app.set('views', __dirname + '/views')

app.get('/', get.index)
app.all('/work/form', get.workForm )
app.get('/work/canvas/:id', get.workCanvas)
app.get('/work/view/:id', get.workView)
app.post('/work/add', upload.single('addfile'), post.addWork)
app.post('/work/update', upload.single('addfile'), post.updateWork)
app.post('/work/delete', post.deleteWork)

app.get(/files/, get.files)

app.set('view engine', 'ejs')
app.set('URL', 'http://localhost:3000')

app.listen(3000, (err)=>{
      if(err)throw err
    console.log(' \n ************************ SERVER START ON PORT 3000 ************************ \n')
    database.init(app)    

});



// let ejs = require('ejs');
// let myFileLoader = function (filePath) {
//   return 'myFileLoader: ' + fs.readFileSync(filePath);
// };

// ejs.fileLoader = myFileLoad;

// app.use('/',function(req,res,next){
//   console.log('/ 주소의 요청일 때 실행된다.');
//   next();
// });

//app.get('/test', function(req, res){  res.render('test');})