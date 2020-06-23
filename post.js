const fs = require('fs')

var fileDelete = function (filepath, cb) {
  fs.unlink(filepath, function(err) {
    if (err) throw err;
    console.log('\n ****** PRE FILE DELETED ****** \n', filepath); 
    cb(err);
  });  
}    

module.exports = {
  deleteWork: (req, res) => {
        var database = req.app.get('database');
    database.WorkModel.deleteWork(req.body.id, function(err, data){
      if(err) throw err;
      if(data.file){
        console.log('data ::: ', data.file.path);
        fileDelete(data.file.path)
      };
      console.log(' \n > ' + req.body.id + ' : DELETED \n') 
    });
    
        res.redirect('/');
  },

    addWork: (req, res) => {
      
      var database = req.app.get('database');
      var workmodel = req.body;   
      if(workmodel.parentId == '') workmodel.parentId = '0';

        if(!req.file){          console.log(' \n > NO FILE \n')                
         } else {               console.log(' \n > FILE ADDED \n')                 
            workmodel.file = req.file;
          }
    
        if ( !req.body.title ) { workmodel.title = new Date(Date.now())};
        
        var work = new database.WorkModel( workmodel );
    
        work.saveWork( function ( err, data ) {
        
            if(err) throw err;
            console.log(' \n > ' + data.title + ' : SAVED \n') 
        
        });
    
        res.redirect('/')

    },
    updateWork: (req, res) => {

      var database = req.app.get('database');
      var workmodel = req.body;
      var addfile = req.file;
      var pre_addfile = req.body.pre_addfile;

      if (pre_addfile === 'undefined') {    

          console.log('원래 파일없음')  

        } else {
        
          if ( !addfile ) {  

              console.log('업데이트시 파일 미첨부')             
              
              if ( req.body.path === req.body.pre_path ) {

                console.log('path 변동 없음')           

              } else {      

                
                var oldpath = 'works/' + req.body.pre_filepath;
                var newpath = 'works/' + req.body.path;
                var newfilepath = req.body.path + '/' + pre_addfile;
                workmodel.file = newfilepath;
                
                !fs.existsSync(newpath) && fs.mkdirSync(newpath);
                
                fs.renameSync(oldpath, 'works/' + newfilepath);    
                  console.log('ddd,newpath',newfilepath);
                
                
                console.log('path 변경', workmodel.file)    
                
              }

            } else {            

              console.log('업데이트시 파일 첨부')      

              if ( addfile.originalname !== 'undefined' && addfile.originalname !== pre_addfile ) {

                console.log('\n ****** NEW FILE UPDATE ****** \n');   
              
                workmodel.file = addfile;

                fileDelete('works/' + req.body.pre_filepath , function(err, result){                
                  if (err) throw err;
                  console.log('>>> destination >>> \n', addfile.destination);
                  fs.rmdirSync( addfile.destination );
                  console.log('\n ****** PRE FILE DELETED ****** \n');                                
                
              });
            }
          }    
        }
        
    database.WorkModel.updateWork(req.body.id, workmodel, function(err, data){
      if (err) throw err;
      console.log('\n ****** NEW FILE UPDATE COMPLETED ****** \n');   
    });   

    res.redirect('/works/view/' + req.body.id);  

  
  }

}
console.log(' \n >>>>>>>>>>> MODULE.EXPORTS [ POST.JS ] :  \n ', module.exports);