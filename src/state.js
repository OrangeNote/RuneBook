var Freezer = require('freezer-js');

var state = {
	status: "idle",
	online: false,
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
		page: null,
		valid: false,
	}
};

module.exports = new Freezer(state);