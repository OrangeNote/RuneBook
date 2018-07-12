var Store = require('electron-store');

settings = new Store({
	name: "settings",
	defaults: {
		config: {
			name: "config",
			cwd: require('electron').remote.app.getPath('userData'),
			ext: ".json"
		},
		changelogversion: "0.0.0",
		leaguepath: 'C:\\Riot Games\\League of Legends\\LeagueClient.exe',
		pathdiscovery: true,
		autochamp: false,
		lasttab: "local"
	}
});

module.exports = settings;