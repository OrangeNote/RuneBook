var fs = require('fs');
var runeforge;
fs.readFile('./resources/runeforge.json', 'utf8', function (err, data) {
  if (err) throw err;
  runeforge = JSON.parse(data);
});

var plugin = {
	name: "Rune Forge",
	active: true,

	getPages(champion, callback) {
		setTimeout(() => {
			var res = {pages: {}};
			_.forOwn(runeforge, function(value, key) {
				var sep = value.loadout_champion_grid.split("/");
				sep = sep[sep.length - 1].split(".")[0];
				if(champion == sep) {
					res.pages[`${value.loadout_champion_name} ${value.loadout_id}`] = {
						"current": true,
						"isActive": false,
						"isDeletable": true,
						"isEditable": true,
						"isValid": false,
						"name": `${value.loadout_champion_name} ${value.loadout_id}`,
						"order": 1,
						"primaryStyleId": -1,
						"selectedPerkIds": [
							0,
							0,
							0,
							0,
							0,
							0
						],
						"subStyleId": -1
					};
				}
			});
			callback(res);
		}, 300);
	}
}

module.exports = { plugin };