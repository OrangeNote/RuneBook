const { EventEmitter } = require('events');
const request = require('request');

class LCURuneManager extends EventEmitter {

	getRunePages() {
		return new Promise(resolve => {	
			
			var options = {
				url: `${this._conn.protocol}://${this._conn.address}:${this._conn.port}/lol-perks/v1/pages/`,
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

				resolve(data);
			});
		});
	}

	getCurrentPage() {
		return new Promise(resolve => {	
			
			var options = {
				url: `${this._conn.protocol}://${this._conn.address}:${this._conn.port}/lol-perks/v1/currentpage/`,
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

				resolve(JSON.parse(data));
			});
		});
	}

	putCurrentPage(page_id) {
		return new Promise(resolve => {	
			
			var options = {
				url: `${this._conn.protocol}://${this._conn.address}:${this._conn.port}/lol-perks/v1/currentpage/`,
				auth: {
					"user": this._conn.username,
					"pass": this._conn.password
				},
				headers: {
					'Accept': 'application/json'
				},
				json: true,
				body: parseInt(page_id),
				rejectUnauthorized: false
			};

			request.put(options, (error, response, data) => {
				if (error || response.statusCode != 201) {
					resolve();
					return;
				}

				resolve(data, page_id);
			});
		});
	}

	postPage(page) {
		return new Promise(resolve => {	
			
			var options = {
				url: `${this._conn.protocol}://${this._conn.address}:${this._conn.port}/lol-perks/v1/pages/`,
				auth: {
					"user": this._conn.username,
					"pass": this._conn.password
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

	deletePageById(page_id) {
		return new Promise(resolve => {	
			
			var options = {
				url: `${this._conn.protocol}://${this._conn.address}:${this._conn.port}/lol-perks/v1/pages/${page_id}`,
				auth: {
					"user": this._conn.username,
					"pass": this._conn.password
				},
				headers: {
					'Accept': 'application/json'
				},
				rejectUnauthorized: false
			};

			request.delete(options, (error, response, data) => {
				console.log("delete", error, response.statusCode, data)
				if (error || response.statusCode != 204) {
					resolve();
					return;
				}

				resolve(data);
			});
		});
	}

	start(conn) {
		console.log("starting rune manager")
		this._pagesWatcher = null;
		this._conn = conn;
		this._initPagesWatcher();
	}

	stop() {
		console.log("stopping rune manager")
		this._clearPagesWatcher();
	}

	_initPagesWatcher() {

		return this.getRunePages().then(pages => {
			if (pages && pages != "[]") {
				if(pages != this._pages) {
					this.emit("pages-update", JSON.parse(pages));
				}
			}
			else if(this._pages) {
				this.emit("pages-error");
			}

			this._pages = pages && pages != "[]" ? pages : null;

			if (!this._pagesWatcher) {
				this._pagesWatcher = setInterval(this._initPagesWatcher.bind(this), 1000);
			}
		});
	}

	_clearPagesWatcher() {
		clearInterval(this._pagesWatcher);
	}
}

module.exports = LCURuneManager;