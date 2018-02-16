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
	},

	plugins: {}
};

module.exports = new Freezer(state);