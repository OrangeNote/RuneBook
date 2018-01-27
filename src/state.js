var Freezer = require('freezer-js');

var state = {
	current_page: "default",
	status: "idle"
};

module.exports = new Freezer(state);