const { EventEmitter } = require('events');
const request = require('request');

class LCUSessionDetector extends EventEmitter {

	getLoginSession() {
		return new Promise(resolve => {	
			
			var options = {
				url: `${this._conn.protocol}://${this._conn.address}:${this._conn.port}/lol-login/v1/session/`,
				method: 'get',
				auth: {
					"user": this._conn.username,
					"pass": this._conn.password
				},
				headers: {
					'Accept': 'application/json'
				},
				rejectUnauthorized: false
			};

			request.get(options, (error, response, data) => {
				if (error || response.statusCode != 200) {
					resolve();
					return;
				}

				data = JSON.parse(data);
				resolve(data);
			});
		});
	}

	start(conn) {
		this._conn = conn;
		this._sessionWatcher = null;
		this._initSessionWatcher();
	}

	stop() {
		this._clearSessionWatcher();
	}

	_initSessionWatcher() {

		return this.getLoginSession().then(session => {
			if (session) {
				if(!this._session) {
					this.emit("login-session-active", session);
				}
			}
			else if(this._session) {
				this.emit("login-session-closed");
			}

			this._session = session;

			if (!this._sessionWatcher) {
				this._sessionWatcher = setInterval(this._initSessionWatcher.bind(this), 5000);
			}
		});
	}

	_clearSessionWatcher() {
		clearInterval(this._sessionWatcher);
	}
}

module.exports = LCUSessionDetector;