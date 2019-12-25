const mongoose = require('mongoose')
const multer  = require('multer')
const path = require("path")
const fs = require('fs');
var functions = require('./functions')
let storage = multer.diskStorage({
    destination: function(req, file ,callback){
        callback(null, "./works/" + req.body.path)
    },
    filename: function(req, file, callback){
        let extension = path.extname(file.originalname);
        let basename = path.basename(file.originalname, extension);
        callback(null, basename + "_" + functions.formatDate(Date.now()) + extension);
    }
})
let upload = multer({ storage: storage })

module.exports = function router(app){

  app.get('/', function (req, res){
    functions.getWorkList(req).then((works) =>
    res.render('index', { works: works }))
  });

  app.get(/works/, function (req, res){
    functions.getWorksFolder(fs, '.'+req.url, function(err, results){
        var filePath = req.originalUrl.replace('?view=','.')
        if(req._parsedOriginalUrl.query = 'view' ){
            res.render('index', { content: 'works', worksList: results , worksFilePath: filePath, url : req.app.get('URL'), path: req.url  } )
        }
      res.render('index', { content: 'works', worksList: results, url : req.app.get('URL'), path: req.url })
    })
  });

  app.get('/work/show/:id', (req, res)=> {
      var database = req.app.get('database');
      database.WorkModel.load(req.params.id, function(err, result) {
        if(typeof result.file !== 'undefined') result.filepath = '/works/' + result.path + '/' + result.file.filename;
        functions.getWorkList(req).then((works) =>
          res.render('index', { content: 'work_show', result: result , works: works })
        )
      });
    })

  app.get('/work/form', (req, res)=> {
      functions.getWorkList(req).then((works) =>
      res.render('index', { content: 'work_form' , works: works}))
  });

 app.post('/work/edit', (req, res)=> {
     var database = req.app.get('database');
      database.WorkModel.load(req.body.edit_id, function(err, editWork) {
       res.render('index', { content: 'work_form', editWork: editWork })
      });
  });

  app.post('/work/add', upload.single('addfile'), (req, res)=> {
      const database = req.app.get('database');
      var workmodel = {
          title: req.body.title,
          writer: req.body.writer,
          content: req.body.content,
          path: req.body.path,
      };
      if(!req.body.title){ workmodel.title = new Date(Date.now())};
      if(req.file){ workmodel.file= req.file};
      var dirpath = './works/'+ req.body.path;

      !fs.existsSync(dirpath) && fs.mkdirSync(dirpath);

      var work = new database.WorkModel(workmodel);

      work.saveWork(function(err, data){
          if(err) console.log(err)
            console.log(data.title + ' => saved!')
      });
      res.redirect('/')
  });

  app.post('/work/update', upload.single('addfile'), (req, res)=> {
      var database = req.app.get('database');
      var workmodel = req.body;
      if(req.file){ workmodel.file= req.file};

        database.WorkModel.updateWork(req.body.id, workmodel, function(err, data){
          if(err) throw err;
              console.log(req.body.title+' => updated!')
              if(data.file && req.file){
                  if(req.file.filename !== req.body.pre_addfile){
                      fs.unlink('works/'+ req.body.pre_filepath, function(err) {
                          if (err) throw err;
                          console.log('file deleted');
                      });
                  }
              }
          });
       res.redirect('/work/show/'+req.body.id);
      });


  app.post('/work/delete', (req, res)=> {
    var database = req.app.get('database');
    database.WorkModel.deleteWork(req.body.id, function(err, data){
      if(err) throw err;
        console.log(req.body.id+' => deleted!')
        if(data.file){
          fs.unlink('.'+ req.body.pre_filepath, function(err) {
              if (err) throw err;
          console.log('file deleted');
          });
        }
    });
    res.redirect('/');
  });

}
