const functions = require('./functions')
const fs = require('fs')
var data = fs.readFileSync("./urlpath.json");
var urlpath = JSON.parse(data);
async function callWorkList(req) {
        var database = req.app.get('database')
    return await new Promise( (resolve, reject) => {
            functions.getWorksList(database, function(result) {
            resolve(result);
        })
    })
}

module.exports = {
    index: (req, res) => {          console.log(' \n ---------- GET INDEX PAGE ---------- \n ');
           
        callWorkList(req).then((worksList)=>

            res.render('index', { worksList : worksList, urlpath : urlpath }) );

    },
    workForm: (req, res) => {                   console.log(' \n ---------- GET WORK FORM PAGE ---------- id: \n ', req.body.edit_id);
        
        if(req.body.edit_id) {

            console.log(' \n ---------- GET WORK EDIT PAGE ---------- id: \n ', req.body.edit_id);

            var database = req.app.get('database');
            database.WorkModel.load(req.body.edit_id, function(err, editWork) {
                if(err) throw err;
                res.render('index', { content: 'work_form', editWork: editWork })
            })

        } else {

            console.log(' \n ---------- GET WORK ADD PAGE ----------  \n ');
            functions.getWorkList(req).then((works) =>
             res.render('index', { content: 'work_form' , works: works, urlpath:urlpath }))

        }
    },
    workView: (req, res) => {        console.log(' \n ---------- GET WORK VIEW PAGE ---------- \n ');

        var database = req.app.get('database');        
        database.WorkModel.load(req.params.id, function(err, result) {
            if (err) throw err;
    
            if(!result.file || typeof result.file === 'undefined') {

                result.filepath = '';

             } else {

                 result.filepath = '/works/' + result.path + '/' + result.file.filename;

             }          
                res.render('work_view', { result: result })          
        })
    },
    workCanvas: (req, res) => {        console.log(' \n ---------- GET WORK CANVAS PAGE ---------- \n ');
    
        var database = req.app.get('database');
        var filepath = '';
        
        database.WorkModel.load(req.params.id, function(err, result) {    
            if(err) throw err;
            if(result.file) filepath  = '/works/' + result.path + '/' + result.file.filename;
                res.send(filepath)          
        })
    },
    files: (req, res) => {        console.log(' \n ---------- GET FILES PAGE ---------- \n ');

        var reqUrl = req.url;       
        console.log(' \n > REQ. URL : ' , reqUrl );
        var filePath = '';
        var folderPath = 'works/' + reqUrl.replace('/files/','');       
        var preUrl = req.app.get('URL') + reqUrl;     
        if( reqUrl === '/files' ) folderPath = 'works';
        
        if ( folderPath.includes('?view=') ) {
            
            console.log(' \n ---------- VIEW FILE ---------- \n ');            
            var filePath = folderPath.replace('?view=','.')      
            console.log(' \n > FILE PATH : \n ' , filePath );      
            res.render('files', { worksFilePath: filePath } )     
            
        } else {          
            
            console.log(' \n ---------- VIEW FOLDER ---------- \n ');       

            functions.getWorksFolder( folderPath , function(err, folderData) {                
                if(err) throw err;   
                console.log(' \n > FOLDER DATA \n ', folderData);                   
                console.log(' \n >>reqUrl', reqUrl );
                res.render('files', { lists: folderData, preUrl : preUrl, worksFilePath: filePath, parentFolder: folderPath })    
            });

        }
        

        console.log(' \n > REQ. URL : ' , reqUrl );
        console.log(' \n > FOLDER PATH : ' , folderPath );
        console.log(' \n > preURl : ' , preUrl );
    }
      
}
console.log(' \n >>>>>>>>>>> MODULE.EXPORTS [ GET.JS ] :  \n ', module.exports);