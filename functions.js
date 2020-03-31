var functions = {
     getWorkList: async function(req) {
        const database = req.app.get('database')
          return await new Promise((resolve, reject) => {
            database.WorkModel.list((err, result) => {
              if (err) return reject(err);
              resolve(result);
            })
          })
      },
    getWorksList: function(database, callback) {

      var workList = '<ul id="myUL"><li><span class="caret">works</span><ul class="nested">';
      var paths = [];

            database.WorkModel.workList((err, works) => {
              if (err) return reject(err);
              works.forEach(w => {

                paths.push(w._doc.path);
                
              });
              
              paths = Array.from(new Set(paths));

              console.log('paths>>',paths);
              
              paths.forEach(p => {
        
                workList += '<li><span class="caret">' + p + '</span><ul class="nested"> ';
                workList += getChild (p);
                workList += '</ul></li>';
        
              });      
        
              function getChild (path) {
        
                var child = '';
                
                works.forEach(w => {   
        
                  if ( w._doc.path == path ) {
          
                    child += '<li class="child"><a href="#" onclick="javascript:getWorkView(\''+ w._doc._id +'\');">' + w._doc.title + '</a></li>';
               
                  
                  }
        
                });
                
                return child;
        
              }      
        
              workList += '</ul></li></ul>'
              
              callback(workList);
            })
            
    },

   formatDate: function(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear(),
            hours = d.getHours(),
            minutes = d.getMinutes(),
            seconds = d.getSeconds();

        if (month.length < 2) 
            month = '0' + month;
        if (day.length < 2) 
            day = '0' + day;
       
        return [year,month,day,hours,minutes,seconds].join('-');
    },
    getWorksFolder: function(fs, path, callback) {
        fs.readdir(path, function(err, result){
            if (err) return callback(err)
            callback(null, result)
        })
    },
    fileDelete: function(fs, filepath, callback){
      fs.unlink(filepath, function(err) {
        if (err) return callback(err)
        console.log('기존파일은 삭제됨 >>>' + filepath);
        callback(null, '기존파일 삭제완료')
      });  
    }    
  }       

module.exports = functions;