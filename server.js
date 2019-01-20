var express = require('express');
var fs = require('fs');
var bodyParser = require('body-parser');
var request = require('request');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/lightning-status', function (request, response) {
	fetchStatus(response);
});

app.get('/get-balance', function(req, res) {
	const macaroon = getMacaroon();
	var options = {
		url: 'https://localhost:8080/v1/balance/blockchain',
		rejectUnauthorized: false,
		json: true,
		headers: {
			'Grpc-Metadata-macaroon': macaroon,
		},
	};

	request.get(options, function(err, response, body) {
		res.json(body);
	});
});


app.post('/initiate-transaction', function(req, res) {
	const macaroon = getMacaroon();
	var options = {
		url: 'https://localhost:8080/v1/transactions',
		rejectUnauthorized: false,
		json: true,
		headers: {
			'Grpc-Metadata-macaroon': macaroon,
		},
		form: JSON.stringify({
			addr: req.body.address,
			amount: req.body.amount,
		}),
	};
	request.post(options, function(err, response, body) {
		res.json(body);
	});
});

function fetchStatus(res) {
	var macaroon = getMacaroon();
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

function getMacaroon() {
	return fs.readFileSync('/home/pi/admin.macaroon').toString('hex');
}

app.listen('4200', function() {
	console.log('server started on port 4200');
});