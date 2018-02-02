const WebSocket = require('ws');

var ws = null;

function bind(data) {
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

module.exports = { bind, destroy };