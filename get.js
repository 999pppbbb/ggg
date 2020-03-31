const functions = require('./functions')
const fs = require('fs')
var data = fs.readFileSync("./urlpath.json");
var urlpath = JSON.parse(data);


module.exports = {
    renderIndex: (req, res) => {
        var database = req.app.get('database');
        var worksList; 
        
        functions.getWorksList(database, function(result){
            worksList = result;
            res.render('index', { worksList : worksList, urlpath : urlpath });
        });    
    },
    renderView: (req, res)=> {
    
        var database = req.app.get('database');
        
        database.WorkModel.load(req.params.id, function(err, result) {
    
            if(result.file) result.filepath = '/works/' + result.path + '/' + result.file.filename;
                       
                res.render('work_view', { result: result })          
        })
    },
    renderCanvas: (req, res)=> {
        var database = req.app.get('database');
        
        database.WorkModel.load(req.params.id, function(err, result) {
    
            if(result.file) result.path  = '/works/' + result.path + '/' + result.file.filename;
                       
                res.render('work_canvas', { result: result })          
        })
    }
}
console.log(' \n >>>>>>>>>>> MODULE.EXPORTS [ GET.JS ] :  \n ', module.exports);