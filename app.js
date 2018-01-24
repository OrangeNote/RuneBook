const Freezer = require('freezer-js');
const view = new (require('./view'))();

const LeagueClient = require('./league-client');


class App {
	
	constructor() {

		this.freezer = new Freezer({
			pages: [],
			current_page: null,
		});

		this.state = this.freezer.get();
	}

	start() {
		this.leagueClient = new LeagueClient();

		this.leagueClient.on("perks_v1_currentpage", (e) => {
			if(e.eventType == "Update") {
				this.state.set("current_page", e.data.id);
			}
		})
	}
}

exports = module.exports = new App();