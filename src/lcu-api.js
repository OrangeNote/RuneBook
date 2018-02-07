const WebSocket = require('ws');
const request = require('request');

var ws = null;
var conn_data = null;

function bind(data) {
	conn_data = data;
	ws = new WebSocket(`wss://${data.username}:${data.password}@${data.address}:${data.port}/`, "wamp", {
		rejectUnauthorized: false,
	});

	ws.on('error', (err) => {
		console.log(err);
	});

	ws.on('message', (msg) => {
		var res;
		try {
			res = JSON.parse(msg);
		} catch(e) {
			console.log(e);
		}
		if(res[0] === 0) console.log("connected", res);
		if(res[1] === "OnJsonApiEvent") console.log(res[2]);
	});

	ws.on('open', () => {
		ws.send('[5, "OnJsonApiEvent"]');
	});
}

function destroy() {
	ws = null;
}

function postPage(page) {
	return new Promise(resolve => {	
		
		var options = {
			url: `${conn_data.protocol}://${conn_data.address}:${conn_data.port}/lol-perks/v1/pages/`,
			auth: {
				"user": conn_data.username,
				"pass": conn_data.password
			},
			headers: {
				'Accept': 'application/json'
			},
			json: true,
			body: page,
			rejectUnauthorized: false
		};

		request.post(options, (error, response, data) => {
			if (error || response.statusCode != 200) {
				resolve();
				return;
			}

			resolve(data);
		});
	});
}

module.exports = { bind, destroy, postPage };