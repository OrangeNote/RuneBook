var fs, runeforge;

var plugin = {
	name: "Dummy Rune Forge",
	active: false,

	getPages(champion, callback) {
		setTimeout(() => {
			var res = {pages: {}};
			for(key in runeforge) {
				var value = runeforge[key];
				var sep = value.loadout_champion_grid.split("/");
				sep = sep[sep.length - 1].split(".")[0];
				if(champion == sep) {
					res.pages[`${value.loadout_champion_name} ${value.loadout_id}`] = {
						"current": true,
						"isActive": false,
						"isDeletable": true,
						"isEditable": true,
						"isValid": true,
						"name": `${value.loadout_champion_name} ${value.loadout_id}`,
						"order": 1,
						"primaryStyleId": 8000,
						"selectedPerkIds": [
							8021,
							9111,
							9103,
							8014,
							8313,
							8321
						],
						"subStyleId": 8300
					};
				}
			}
			callback(res);
		}, 300);
	}
};

if(plugin.active) {
	fs = require('fs');
	fs.readFile('./resources/runeforge.json', 'utf8', function (err, data) {
	  if (err) throw err;
	  runeforge = JSON.parse(data);
	});
}

module.exports = { plugin };