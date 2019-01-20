var express = require('express');
var fs = require('fs');
var request = require('request');
var cors = require('cors');

var app = express();
app.use(cors());

app.get('/lightning-status', function (request, response) {
	fetchStatus(response);
});

function fetchStatus(res) {
	var macaroon = fs.readFileSync('/home/pi/admin.macaroon').toString('hex');
	var options = {
		url: 'https://localhost:8080/v1/getinfo',
		rejectUnauthorized: false,
		json: true,
		headers: {
			'Grpc-Metadata-macaroon': macaroon,
		},
	};

	request.get(options, function(err, response, body) {
		res.json(body);
	});
}

app.listen('4200', function() {
	console.log('server started on port 4200');
});