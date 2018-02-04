var Freezer = require('freezer-js');

var state = {
	status: "idle",
	online: false,
	champion_select: false,
	connection: null,

	current: {
		champion: null,
		champ_data: {
			fav: null,
			pages: {},
		},
	},
};

module.exports = new Freezer(state);