var express = require('express');
var fs = require('fs');
var request = require('request');

var app = express();

app.get('lightning-status', function (request, response) {
	fetchStatus();
	response.json({});
});

function fetchStatus() {
	var macaroon = fs.readFileSync('/home/bitcoin/data/chain/bitcoin/simnet/admin.macaroon').toString('hex');
	var options = {
		url: 'https://localhost:8080/v1/getinfo',
		rejectUnauthorized: false,
		json: true,
		headers: {
			'Grpc-Metadata-macaroon': macaroon,
		},
	};

	request.get(options, function(err, response, body) {
		console.log('body');
	});
}

app.listen('4200', function() {
	console.log('server started on port 4200');
});