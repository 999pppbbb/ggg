module.exports = {

    addWork: (req, res) => {

        var database = req.app.get('database');

        var workmodel = req.body;

        console.log('workmodel>>>>>>>>>>>',workmodel);

        if(!req.file){  

          console.log('req.file',req.file);

            console.log('파일 미첨부')                  

          } else {   

            console.log('req.file',req.file);

            workmodel.file = req.file;

          }
    
        if ( !req.body.title ) { workmodel.title = new Date(Date.now())};
        
        var work = new database.WorkModel( workmodel );
    
        work.saveWork( function ( err, data ) {
        
            if(err) throw err;
         
          console.log(data.title + ' => saved!')
        
        });
    
        res.redirect('/')


    }

}
console.log(' \n >>>>>>>>>>> MODULE.EXPORTS [ POST.JS ] :  \n ', module.exports);