var Freezer = require('freezer-js');

var state = {
	current_page: 1,
	status: "idle",
	pages: [
		{id: 1, name: "Ryze"},
		{id: 2, name: "Jinx"},
		{id: 3, name: "Jhin"},
	],
	online: false,
	champion_select: false,
	champion: {
		id: null
	},
	connection: null,
};

module.exports = new Freezer(state);