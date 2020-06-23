const fs = require('fs');
const { Db } = require('mongodb');
var data = fs.readFileSync("./head-url.json");
var urlpath = JSON.parse(data);
var host = 'http://localhost:3000';
          
var getWorkList = async function (req) {

    const database = req.app.get('database')
        return await new Promise((resolve, reject) => {
          database.WorkModel._list((err, result) => {
            if (err) return reject(err);
            resolve(result);
          })
        })
}
module.exports = {


    index: (req, res) => {          console.log(' \n ---------- GET INDEX PAGE ---------- \n ');

    var getWorkList = async function (req) {

        const database = req.app.get('database')
            return await new Promise((resolve, reject) => {
              database.WorkModel._list((err, result) => {
                if (err) return reject(err);
                resolve(result);
              })
            })
    }

        function Node(data) {
            this.data = data;
            this.children = [];
        }

        class Tree {

            constructor() {
                this.root = [];
            }

            add(data) {

                const node = new Node(data); 
                this.root.push(node);

            }
            
            findBFS(parentId) { 
                
                let _node = null;

                this.traverseBFS( (node) => {   
                    
                    for(const n of node) {            
                        var _pid = String(n.data.parentId);     
                        if(_pid == parentId) _node = n;   
                    }     
                })
                return _node;                 
            }

            traverseBFS(cb) {
                const queue = [this.root] 
            
                if(cb)
                    while(queue.length) {
                        const node = queue.shift();

                        cb(node)      
                        
                    }
            }

        }
    

        getWorkList(req).then(function (worksList) {
            
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

                var root = tree.root;

                root.forEach(node => {

                    const parent = tree.findBFS(node.data._id);     
                          
                    if(parent) node.children.push(parent)   
                    
                });       

                tree.traverseBFS( (node) => { 

                    var workList = '<ul id="myUL"><li><span class="box">works</span><ul class="nested">';
                    
                    function getChild (children) {

                        
                        var str = '';      
                        
                        children.forEach(c => {      
                            
                            console.log('dddddd',c.data.title);
                            str += '<li><span class="box"><a href="#" onclick="javascript:getWorkView(\''+ c.data._id +'\');">' + c.data.title + '</a></span><ul class="nested"> ';

                            if(c.children.length == 0 ){

                                console.log('ddd',c.data.title);

                                str += '<li class="child"><a href="#" onclick="javascript:getWorkView(\''+ c.data._id +'\');">' + c.data.title + '</a></li>';
                                
                            } else {

                                c.children.forEach(cc => {
                                    // console.log('eee', cc.data.title);
                                    // str += '<li><span class="box"><a href="#" onclick="javascript:getWorkView(\''+ cc.data._id +'\');">' + cc.data.title + '</a></span><ul class="nested"> ';
                                    str += getChild (cc.children);
                                    
                                });

                                str += '</ul></li>';
                                
                            }
                            
                        });                     

                        return str;
                
                    }    

                    node.forEach(n => {

                        console.log('node-title', n.data.title);
         
                        if(n.data.parentId == '0') {
                            workList += '<li><span class="box"><a href="#" onclick="javascript:getWorkView(\''+ n.data._id +'\');">' + n.data.title + '</a></span><ul class="nested"> ';
                            workList += getChild(n.children);
                        }

                        workList += '</ul></li>';
                
                     });

                     workList += '</ul></li></ul>'
                     
                     res.render('index', { host:host, worksList : workList, urlpath : urlpath })

                    });
                    
            })

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
             res.render('works/view', { result: result })       

        })
    }
}
console.log(' \n >>>>>>>>>>> MODULE.EXPORTS [ GET.JS ] :  \n ', module.exports);