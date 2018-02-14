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

	lastuploadedpage: {
		champion: null,
		page: null,
		valid: false,
	}
};

module.exports = new Freezer(state);