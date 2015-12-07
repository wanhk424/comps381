var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var MONGODBURL = 'mongodb://wanhk424.cloudapp.met:27017/test';

var restaurantSchema = require('./models/restaurant');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/:factor/:factor_value', function(req,res) {


	var criteria = {};
	criteria[req.params.factor] = req.params.factor_value;
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		Restaurant.find(criteria,function(err,results){
			
			if (err) {
				res.status(500).json(err);
				throw err
			}
			if (results.length > 0) {
				res.status(200).json(results);
			}
			else {
				res.status(200).json({message: 'No matching document'});
			}
			db.close();
			
		});
	});
});

app.post('/',function(req,res) {
	
	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {


		var rObj = {};
		rObj.address = {};
		if(req.body.building!=null){
		rObj.address.building = req.body.building;
		}
		if(req.body.street!=null){
		rObj.address.street = req.body.street;
		}
		if(req.body.zipcode!=null){
		rObj.address.zipcode = req.body.zipcode;
		}
		rObj.address.coord = [];
		if(req.body.lon!=null){
		rObj.address.coord.push(req.body.lon);
		}
		if(req.body.lat){
		rObj.address.coord.push(req.body.lat);
		}
		if(req.body.borough!=null){
		rObj.borough = req.body.borough;
		}
		if(req.body.cuisine!=null){
		rObj.cuisine = req.body.cuisine;
		}
		rObj.grades=[];
 		var grade1 = {};
		if(req.body.date!=null){
 		grade1.date = req.body.date;
		}
		if(req.body.grade!=null){
  		grade1.grade = req.body.grade;
		}
		if(req.body.score!=null){
  		grade1.score = parseInt(req.body.score);
		}
		if(req.body.date!=null||req.body.grade!=null||req.body.score!=null){
 		rObj.grades.push(grade1);
		}
		rObj.name = req.body.name;
		rObj.restaurant_id = req.body.restaurant_id;

		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		var r = new Restaurant(rObj);
		
		r.save(function(err) {
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		
       		db.close();
			res.status(200).json({message: 'insert done', id: r._id});
    	});
    });
});

app.delete('/:factor/:factor_value',function(req,res) {

	var criteria = {};
	criteria[req.params.factor] = req.params.factor_value;

	var restaurantSchema = require('./models/restaurant');
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		 Restaurant.remove(criteria,function(err,results){
       		if (err) {
				res.status(500).json(err);
				throw err
			}
       		
       		db.close();
			res.status(200).json({message: 'delete done', id: req.params.id});
    	});
    });
});

app.put('/:factor/:factor_value/grade', function(req,res) {

	var criteria = {};
	criteria[req.params.factor]=req.params.factor_value;
	var updated = {};
	var gradea = {};
	gradea.grade = req.body.grade;
		gradea.date = req.body.date;
		gradea.score= parseInt(req.body.score);

	updated["grades"]=gradea;
	
	console.log(updated);
	
	mongoose.connect(MONGODBURL);
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function (callback) {
		var Restaurant = mongoose.model('Restaurant', restaurantSchema);
		
		Restaurant.update(criteria,{$push:updated},function(err){

			if (err) {
				console.log("Error: " + err.message);
				res.write(err.message);
			}
			else {
				
				console.log("update successful");
				res.status(200).json({message: 'updated'})
				db.close();
				res.end('Done',200);
			}
		});
	});
});
app.listen(process.env.PORT || 8099);
