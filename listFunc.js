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

var makeTree = async function (worksList) {    

    let newTree = new Tree();
                    
    return await new Promise((resolve, reject) => {
        worksList.forEach(w => {        
            newTree.add(w._doc, w._doc.parentId);    
        })

        resolve(newTree)                          

    })
}


module.exports = {

    getAllList: async (req) => {          console.log(' \n ---------- GET All List ---------- \n ');

        return await new Promise((resolve, reject) => {

            getWorkList(req).then( (worksList) => {
   
                makeTree(worksList).then( (tree) => {

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

                        var workList = '<ul id="myUL"><li><span class="box check-box">works</span><ul class="nested active">';

    
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
                                                console.log(' 3 >>>',dn.data.title);
                            

                                            }else{

                                            str += '<span class="box">';
                                            str += link
                                            str += '</span>';

                                            console.log(' 2 >>',dn.data.title);
                                            
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
                            
                            if(dn.data.parentId == '0') {   

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
                        
                        resolve(workList);              
                            
                    });
                        
                        
                });
                    
            })                
         
        })    
    }   

}