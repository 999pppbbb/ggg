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

  app.get('/work/form', (req, res)=> {
    functions.getWorkList(req).then((works) =>
      res.render('index', { content: 'work_form' , works: works, urlpath:urlpath}))
    });

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

  app.get(/works/, (req, res)=>{

    var url = req.app.get('URL');
    var parsedUrl = req._parsedOriginalUrl;

    console.log('parsedUrl', parsedUrl);

    if(parsedUrl.query !== null){ // 파일클릭시      

      var filePath = parsedUrl.path.replace('?view=','.')

      console.log('파일 클릭함 : filePath ::: ', filePath);

      res.render('index', { content: 'works', urlpath:urlpath , worksFilePath: filePath, url : url, path: urlpath} )
    
    } else {

      console.log('폴더 클릭함 : folder Path ::: '); //폴더클릭시

      var dataPath = req.url.replace('/works/','');

      console.log('dataPath', dataPath);

      functions.getWorksFolder(fs, 'works/'+ dataPath, function(err, folderData){

        if(err) {
          res.render('index', { content: 'works' })          
        }

        console.log('folderData', folderData);        
        
        res.render('index', { content: 'works', urlpath:urlpath , worksList: folderData, url : url, path: req.url, parentFolder: dataPath })

      });

    }

  })
  
  app.post('/work/edit', (req, res)=> {
      var database = req.app.get('database');
       database.WorkModel.load(req.body.edit_id, function(err, editWork) {
         if(err) throw err;
        res.render('index', { content: 'work_form', editWork: editWork })
       });
   });

  app.post('/work/update', upload.single('addfile'), (req, res)=> {
      var database = req.app.get('database');
      var workmodel = req.body;
      var addfile = req.file;
      var pre_addfile = req.body.pre_addfile;

      console.log('기존 첨부파일 : ', pre_addfile);
      console.log('addfile : ', addfile);

      if(pre_addfile === 'undefined'){    
          console.log('기존파일없음')          
        }else{
        
          if(!addfile){  
              console.log('파일 미첨부')                  

            } else {          
             
              console.log('파일 첨부함 :::', addfile) 
          
            if(addfile.originalname !== 'undefined' && addfile.originalname !== pre_addfile){
              
              console.log(addfile.originalname + ' ====> '+ pre_addfile);    
              console.log('파일 이름 다름')
              
              workmodel.file = addfile;

              functions.fileDelete(fs, 'works/' + req.body.pre_filepath , function(err, result){
                
                if(err) throw err;
                console.log('result', result);  
                console.log('destination >>>', addfile.destination);
                fs.rmdirSync(addfile.destination);
                // if(fs.existsSync(addfile.destination)){
                //   console.log('파일있음');
                // }                          
                
              });
            }
          }    
        }
        
    database.WorkModel.updateWork(req.body.id, workmodel, function(err, data){
      if (err) throw err;
      console.log('작업 수정 완료');
    });   

    res.redirect('/work/show/' + req.body.id);  

  });  
  
  app.post('/work/delete', (req, res)=> {

    var database = req.app.get('database');
    database.WorkModel.deleteWork(req.body.id, function(err, data){
      if(err) throw err;
      if(data.file){
        console.log('data ::: ', data.file.path);
        functions.fileDelete(fs, data.file.path , function(err, result){
          if(err) throw err;
          console.log('result', result);                  
        });           
      };
      console.log(req.body.id+' => 작업 삭제완료')
    });
    
        res.redirect('/');
    });

  }