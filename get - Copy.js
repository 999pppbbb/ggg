const fs = require('fs');
const { Db } = require('mongodb');
var data = fs.readFileSync("./head-url.json");
var urlpath = JSON.parse(data);
var host = 'http://localhost:3000';
          
var getWorkList = async function (req) {

    const database = req.app.get('database')
        return await new Promise((resolve, reject) => {
          database.WorkModel.list((err, result) => {
            if (err) return reject(err);
            resolve(result);
          })
        })
}
module.exports = {

    // ulstr += '<li class="box">';
    //                 ulstr += '<a href="' + host + '/works/view/'+ w._doc._id + '">' + w._doc.title + '</a>';

    //                 if(parentId == w._doc.parentId) {
    //                     child += '<ul class="nested">';
    //                     child += '<li><a href="<%- host %>/works/view/<%- w._doc._id %>"><%- w._doc.title %>'</a></li>';
                  
                  
    //                 }
                

    index: (req, res) => {          console.log(' \n ---------- GET INDEX PAGE ---------- \n ');

    function Node(data) {
        this.data = data;
        this.children = [];
    }

    class Tree {
        constructor() {
            this.root = [];
        }

        add(data) {

            const parentId = data.parentId;    
            const node = new Node(data); 

            this.root.push(node);

            const parent = this.findBFS(data._id);          
            if(parent) node.children.push(parent)  
           
        }

        findBFS(parentId){ //자식 찾기
            let _node = null;
            this.traverseBFS( (node) => {   
            
                    for(const n of node){                       
                            
                        var _pid = String(n.data.parentId);                            
                        
                        if(_pid == parentId){                              
                            _node = n;                            
                        }
                        
                    }              
                    
            })

            return _node; //자식리턴
                
        }

        traverseBFS(cb) {
            const queue = [this.root] //기존 저장된 데이터들
           
                if(cb)
                    while(queue.length) {
                        const node = queue.shift();

                        cb(node)   
                        
                        
                        // node.forEach(n => {
                        //     queue.push(n.children)
                            
                        // });            

                    
                    }
        }

    }
    

        getWorkList(req).then(function (worksList){
            //var ulstr = '<ul id="myUL"><li class="box">works<ul class="nested">';

         
            let tree = new Tree();

            var getTrees = async function () {    
                
                
                    return await new Promise((resolve, reject) => {

                        worksList.forEach(w => {
                            
                                      
                                tree.add(w._doc, w._doc.parentId);                         
            
                          })

                          resolve(tree)
                          

                    })
            }

       
            getTrees().then( (tree) => {

                tree.traverseBFS( (node) => { 

                    node.forEach(n => {
                        console.log("n : \n", n );
                        console.log("n.child : \n", n.children)
                     });
                        
                    });
 
                    
            })

            //ulstr += '</ul></li></ul>';

            //res.render('index', { host:host, worksList : ulstr, urlpath : urlpath })
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
             getWorkList(req).then(function (worksList){
                if(req.body.parentId) parentId = req.body.parentId;
                 res.render('index', { content: 'works/form' , parentId: parentId,  works: worksList, urlpath:urlpath })
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
             getWorkList(req).then(function (worksList){
                res.render('index', { host:host, worksList : worksList, urlpath : urlpath, content: 'works/view', result: result})
            });

        })
    }   
}
console.log(' \n >>>>>>>>>>> MODULE.EXPORTS [ GET.JS ] :  \n ', module.exports);