const functions = require('./functions')
const fs = require('fs')

module.exports = {
  deleteWork: (req, res) => {
        var database = req.app.get('database');
    database.WorkModel.deleteWork(req.body.id, function(err, data){
      if(err) throw err;
      if(data.file){
        console.log('data ::: ', data.file.path);
        functions.fileDelete(fs, data.file.path)
      };
      console.log(' \n > ' + req.body.id + ' : DELETED \n') 
    });
    
        res.redirect('/');
  },

    addWork: (req, res) => {

        var database = req.app.get('database');
        var workmodel = req.body;   

        if(!req.file){  

          console.log(' \n > NO FILE \n')         

          } else {   

            console.log(' \n > FILE ADDED \n')                 
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

      console.log('\n ****** updateWork Post ****** \n');

      var database = req.app.get('database');
      var workmodel = req.body;
      var addfile = req.file;
      var pre_addfile = req.body.pre_addfile;

      console.log('\n ****** PRE FILE ****** \n', pre_addfile);


      if (pre_addfile === 'undefined') {    

          console.log('원래 파일없음')  

        } else {
        
          if ( !addfile ) {  

              console.log('업데이트시 파일 미첨부')                  

            } else {                       
              
              if ( addfile.originalname !== 'undefined' && addfile.originalname !== pre_addfile ) {

                console.log('\n ****** NEW FILE UPDATE ****** \n', addfile);   
              
                workmodel.file = addfile;

                functions.fileDelete(fs, 'works/' + req.body.pre_filepath , function(err, result){                
                  if (err) throw err;
                  console.log('>>> destination >>> \n', addfile.destination);
                  fs.rmdirSync( addfile.destination );
                  console.log('\n ****** PRE FILE DELETED ****** \n', result);   
                  // if(fs.existsSync(addfile.destination)){
                  //   console.log('파일있음');
                  // }                          
                
              });
            }
          }    
        }
        
    database.WorkModel.updateWork(req.body.id, workmodel, function(err, data){
      if (err) throw err;
      console.log('\n ****** NEW FILE UPDATE COMPLETED ****** \n', data);   
      console.log('작업 수정 완료');
    });   

    res.redirect('/work/show/' + req.body.id);  

  
  }

}
console.log(' \n >>>>>>>>>>> MODULE.EXPORTS [ POST.JS ] :  \n ', module.exports);