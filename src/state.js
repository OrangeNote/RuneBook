var Freezer = require('freezer-js');

var state = {
	session: {
		connected: false,
		state: ""

	},
	champion_select: false,
	connection: {
		page: null,
	},

	current: {
		champion: null,
		champ_data: {
			fav: null,
			pages: {},
		},
	},

	tab: {
		active: "local",
		loaded: true,
	},

	lastuploadedpage: {
		champion: null,
		page: null,
		valid: false,
		loading: false
	},

	lastbookmarkedpage: {
		champion: null,
		page: null
	},

	lastsyncedpage: {
		champion: null,
		page: null,
		loading: false
	},

	plugins: {},

	updateready: false
};

module.exports = new Freezer(state);