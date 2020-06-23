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

                    var nodes = [];
                  
                    node.forEach(n => {

                        nodes.push(n);
                        console.log('nodes>>>',n.data.title);

                    })

                    var workList = '<ul id="myUL"><li><span class="box">works</span><ul class="nested">';

 
                    function childGET(d) {       

                        var str = '';
                        
                        if(d.children.length > 0){    
                            
                            str += '<ul class="nested">';  
                                
                                nodes.forEach(dn => {    
                                    if(dn.data.parentId == d.data._id){

                                        str += '<li>';
                                        var link = '<a href="#" onclick="javascript:getWorkView(\''+ dn.data._id +'\');">' + dn.data.title + '</a>';

                                        if(dn.children.length == 0){
                                                
                                            str += link;
                                            str += '</li>';
                                            console.log(' 222 >>>',dn.data.title);
                        

                                        }else{

                                        str += '<span class="box">';
                                        str += link
                                        str += '</span>';

                                        console.log(' 2 >',dn.data.title);
                                        
                                    }
                                
                                        
                                        str += childGET(dn)

                                        str += '</li>'



                                    
                                    }

                                })   
                                
                                
                        str += '</ul>'
                            

                        }                       
                        return str;
                                        
                       
                    }


                       nodes.forEach(dn => {    

                           let link = '<a href="#" onclick="javascript:getWorkView(\''+ dn.data._id +'\');">' + dn.data.title + '</a>';
                           
                        if(dn.data.parentId == '0'){   

                            workList += '<li>';    

                            if(dn.children.length == 0){
                                                
                                workList += link;
                                workList += '</li>';                        
            

                            } else {

                                workList += '<span class="box">';
                                workList += link
                                workList += '</span>';

                            }
                                                  
                            console.log('1 >',dn.data.title);
                            workList += childGET(dn);

                            
                        }                           
     
         
                        });                         
                        
                           res.render('index', { host:host, worksList : workList, urlpath : urlpath })
                     });


                    });
                    
            })

         
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