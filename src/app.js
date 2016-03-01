var pg = require('pg');
var express = require('express');
var fs = require('fs');
var app = express();
var bodyParser = require('body-parser');
var parsedData = [];

if (app.get('env') === 'development') {
  app.locals.pretty = true;
}

// app.use(express.static('resources/js'));
app.use(express.static('resources/stylesheet'));

app.use(bodyParser.urlencoded({
	extended: true
}));

app.set('views', 'src/views');
app.set('view engine', 'jade'); // is kind of like require

// Postgres part
var connectionString = "postgres://DianthevanVelzen:1234@localhost/bulletinboard";


// This renders the form
app.get('/', function (request, response) {
	response.render('index');
});

// This creates a post request
app.post('/', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		var kerrie = request.body.egg;
		var apple = request.body.message;
		client.query('insert into messages (title, body) values ($1, $2)', [kerrie, apple], function(err) {
			if (err) {
				throw err;
			}

			done();
			pg.end(); // the client will idle for another 30 seconds, temporarily preventing the app from closing, unless this function is called
			// console.log("post request received");
			// console.log(request.body);
			response.redirect('/messages');
			// response.send("data received" + " " + request.body.egg + " " + request.body.message)
		});
	});
});

// testing
app.get('/messages', function(request, response) {
	pg.connect(connectionString, function(err, client, done) {
		client.query('select * from messages', function(err, result) {
			// console.log(result.rows);


			done();
			pg.end(); // the client will idle for another 30 seconds, temporarily preventing the app from closing, unless this function is called
			response.render('messages', {
				messages: result.rows
			});
		});
	});
});


// listens to port
var server = app.listen(3000, function() {
	console.log('UsersInfoApp listening on port: ' + server.address().port);
});

