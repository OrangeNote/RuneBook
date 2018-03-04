var Store = require('electron-store');

settings = new Store({
	name: "settings",
	defaults: {
		config: {
			name: "config",
			cwd: require('electron').remote.app.getPath('userData'),
			ext: ".json"
		}
	}
});

module.exports = settings;