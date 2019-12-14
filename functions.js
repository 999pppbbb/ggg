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
    }
    
  }       
module.exports = functions;