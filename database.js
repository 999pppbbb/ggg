const mongoose = require('mongoose');
var routes = require('./routes.js');
var database = {};

database.init = (app) => connect(app);

function connect(app) {

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/works');

    database.db = mongoose.connection;
    database.db.on('error', console.error.bind(console, 'db connection error'));
    database.db.once('open', function() {
        console.log('mongodb://localhost:27017/works');
        createSchema(app);
    });
    database.db.on('disconnected', connect);

}

function createSchema(app) {

    database.WorkSchema = mongoose.Schema({
        writer:'string',
        title:'string',
        content:'string',
        created_at:{type: Date, 'default': Date.now()},
        updated_at:{type: Date, 'default': Date.now()},
        path:'string',
        file:'object'
    });

    database.WorkSchema.methods = {
		saveWork: function(callback) {
			var self = this;
			this.validate(function(err) {
				if (err) return callback(err);
				self.save(callback);
			});
		}
	}

    database.WorkSchema.statics = {

        list: function(callback) {
			this.find().sort({_id: -1}).exec(callback);
		},

       load: function(id, callback) {
			this.findOne({_id: id}).exec(callback);
		},

        updateWork: function(id, workmodel, callback) {
            workmodel.updated_at = Date.now();
			this.findByIdAndUpdate(id, workmodel, callback);
		},

        deleteWork: function(id, callback){
            this.findByIdAndRemove(id, callback);
        }
    }

    database.WorkModel = mongoose.model('Works', database.WorkSchema);
    app.set('database', database);

}


module.exports = database;
