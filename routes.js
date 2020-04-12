const multer  = require('multer')
const path = require("path")
const fs = require('fs')
const functions = require('./functions')
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
var data = fs.readFileSync("./urlpath.json");
var urlpath = JSON.parse(data);

!fs.existsSync('works') && fs.mkdirSync('works');

module.exports = function router(app) {

  app.get('/work/list', (req, res)=> {
    functions.getWorkList(req).then((works) =>
      res.render('index', { content: 'work_list' , works: works, urlpath:urlpath}))
  });
  
  app.get('/work/show/:id', (req, res)=> {

    console.log(worksList);
    
    var database = req.app.get('database');
    
    var worksList; 
    
    functions.getWorksList(database, function(result){
        worksList = result;
    });
    
      database.WorkModel.load(req.params.id, function(err, result) {

        if(result.file) result.filepath = '/works/' + result.path + '/' + result.file.filename;
        
        functions.getWorkList(req).then((works) =>
            res.render('index', { content: 'work_show', worksList: worksList, result: result , works: works, urlpath:urlpath })
          )
        });
    })

  // app.get(/works/, (req, res)=>{

  //   var url = req.app.get('URL');
  //   var parsedUrl = req._parsedOriginalUrl;

  //   console.log('parsedUrl', parsedUrl);

  //   if(parsedUrl.query !== null){ // 파일클릭시      

  //     var filePath = parsedUrl.path.replace('?view=','.')

  //     console.log('파일 클릭함 : filePath ::: ', filePath);

  //     res.render('index', { content: 'works', urlpath:urlpath , worksFilePath: filePath, url : url, path: urlpath} )
    
  //   } else {

  //     console.log('폴더 클릭함 : folder Path ::: '); //폴더클릭시

  //     var dataPath = req.url.replace('/works/','');

  //     functions.getWorksFolder('works/' + dataPath, function(err, folderData){

  //       if(err) res.render('index', { content: 'works' } )

  //       console.log('folderData', folderData);        
        
  //       res.render('index', { content: 'works', urlpath:urlpath , worksList: folderData, url : url, path: req.url, parentFolder: dataPath })

  //     });

  //   }

  // }) 
  

  }