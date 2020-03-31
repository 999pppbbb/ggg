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
    index: (req, res) => {
            
        callWorkList(req).then((worksList)=>

            res.render('index', { worksList : worksList, urlpath : urlpath }) );

    },
    // index: (req, res) => {
    //     var database = req.app.get('database');
    //     var worksList; 
        
    //     functions.getWorksList(database, function(result){
    //         worksList = result;
    //         res.render('index', { worksList : worksList, urlpath : urlpath });
    //     });    
    // },
    workForm: (req, res) => {
        functions.getWorkList(req).then((works) =>
             res.render('index', { content: 'work_form' , works: works, urlpath:urlpath}))
       
    },
    workView: (req, res)=> {
    
        var database = req.app.get('database');
        
        database.WorkModel.load(req.params.id, function(err, result) {
    
            if(!result.file || typeof result.file === 'undefined') {

                result.filepath = '';

             } else {

                 result.filepath = '/works/' + result.path + '/' + result.file.filename;

             }          
                res.render('work_view', { result: result })          
        })
    },
    canvas: (req, res)=> {
        var database = req.app.get('database');
        
        database.WorkModel.load(req.params.id, function(err, result) {
    
            if(result.file) result.path  = '/works/' + result.path + '/' + result.file.filename;
                       
                res.render('work_canvas', { result: result })          
        })
    }
}
console.log(' \n >>>>>>>>>>> MODULE.EXPORTS [ GET.JS ] :  \n ', module.exports);