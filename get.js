const fs = require('fs');
const { Db } = require('mongodb');
const listFunc = require('./listFunc');
var data = fs.readFileSync("./head-url.json");
var urlpath = JSON.parse(data);
          
module.exports = {

    index: (req, res ) => {

        listFunc.getAllList(req).then( (worksList) => {
               res.render('index', { worksList : worksList, urlpath : urlpath })
            
        });                 

    },
   
    works_form: (req, res) => {     console.log(' \n ---------- GET WORK FORM PAGE ---------- id: \n ', req.body.edit_id);
        
        if(req.body.edit_id) {

            console.log(' \n ---------- GET WORK EDIT PAGE ---------- id: \n ', req.body.edit_id);

            var database = req.app.get('database');
            database.WorkModel.load(req.body.edit_id, function(err, editWork) {
                if(err) throw err;
                res.render('index', { content: 'works/form', editWork: editWork })
            })

        } else {
            console.log(' \n ---------- GET NEW WORK ADD PAGE ----------  \n ');
            var parentId = '';
            listFunc.getAllList(req).then( (worksList) => {
                if(req.body.parentId) parentId = req.body.parentId;
                 res.render('index', { content: 'works/form' , parentId: parentId, worksList: worksList, urlpath:urlpath })
            });
        }
    },
    works_view: (req, res) => {        console.log(' \n ---------- GET WORK VIEW PAGE ---------- \n ');

        var database = req.app.get('database');        
        database.WorkModel.load(req.params.id, function(err, result) {
            if (err) throw err;
    
            if(!result.file || typeof result.file === 'undefined') {

                result.filepath = '';

             } else {

                 result.filepath = '/works/' + result.path + '/' + result.file.filename;

             }          
             res.render('works/view', { result: result })       

        })
    }
}
console.log(' \n >>>>>>>>>>> MODULE.EXPORTS [ GET.JS ] :  \n ', module.exports);