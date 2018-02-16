var request = require('request');
var runeforge;

request.post("http://runeforge.gg/all-loadouts-data.json", (error, response, data) => {
	if (error || response.statusCode != 200) {
		console.log("runeforge json not loaded");
	}
	runeforge = JSON.parse(data);
});

var cheerio = require('cheerio');

var stylesMap = {
	"Precision":8000,
	"Domination":8100,
	"Sorcery":8200,
	"Resolve":8400,
	"Inspiration":8300
};
var perksMap = {
	"Press the Attack":8005,
	"Lethal Tempo":8008,
	"Fleet Footwork":8021,
	"Overheal":9101,
	"Triumph":9111,
	"Presence of Mind":8009,
	"Legend: Alacrity":9104,
	"Legend: Tenacity":9105,
	"Legend: Bloodline":9103,
	"Coup De Grace":8014,
	"Cut Down":8017,
	"Last Stand":8299,
	"Electrocute":8112,
	"Predator":8124,
	"Dark Harvest":8128,
	"Cheap Shot":8126,
	"Taste of Blood":8139,
	"Sudden Impact":8143,
	"Zombie Ward":8136,
	"Ghost Poro":8120,
	"Eyeball Collection":8138,
	"Ravenous Hunter":8135,
	"Ingenious Hunter":8134,
	"Relentless Hunter":8105,
	"Summon Aery":8214,
	"Arcane Comet":8229,
	"Phase Rush":8230,
	"Nullifying Orb":8224,
	"Manaflow Band":8226,
	"The Ultimate Hat":8243,
	"Transcendence":8210,
	"Celerity":8234,
	"Absolute Focus":8233,
	"Scorch":8237,
	"Waterwalking":8232,
	"Gathering Storm":8236,
	"Grasp of the Undying":8437,
	"Aftershock":8439,
	"Guardian":8465,
	"Unflinching":8242,
	"Demolish":8446,
	"Font of Life":8463,
	"Iron Skin":8430,
	"Mirror Shell":8435,
	"Conditioning":8429,
	"Overgrowth":8451,
	"Revitalize":8453,
	"Second Wind":8444,
	"Unsealed Spellbook":8326,
	"Glacial Augment":8351,
	"Kleptomancy":8359,
	"Hextech Flashtraption":8306,
	"Biscuit Delivery":8345,
	"Perfect Timing":8313,
	"Magical Footwear":8304,
	"Future's Market":8321,
	"Minion Dematerializer":8316,
	"Cosmic Insight":8347,
	"Approach Velocity":8410,
	"Celestial Body":8339
};

function exctractPage(html) {
	var $ = cheerio.load(html);
	var path = $("div.rune-paths").first();

	var name = $(".loadout-title").text();
	if(name.length > 22) name = name.substring(0, 22) + "..."

	var page = {
			"name": name,
			"primaryStyleId": -1,
			"selectedPerkIds": [0, 0, 0, 0, 0, 0],
			"subStyleId": -1
		};

	var data = [];
	$("li.rune-path--rune", path).each(function() {
		data.push($(this).attr("data-link-title"));
	});

	page.primaryStyleId = stylesMap[$("div.rune-path--primary .rune-path--path", path).attr("data-content-title")];
	page.subStyleId = stylesMap[$("div.rune-path--secondary .rune-path--path", path).attr("data-content-title")];

	for(var i = 0; i < data.length; i++) {
		page.selectedPerkIds[i] = perksMap[data[i]];
	}
	console.log(page)
	return page;
}

var plugin = {
	name: "Rune Forge",
	active: true,

	getPages(champion, callback) {
		var res = {pages: {}};

		var pageUrls = [];

		for(var i = 0; i < runeforge.length; i++) {
			var pageData = runeforge[i];
			var sep = pageData.loadout_champion_grid.split("/");
			sep = sep[sep.length - 1].split(".")[0];
			if(champion == sep) {
				pageUrls.push(pageData.loadout_url);
			}
		}
		var callCount = 0;
		for(var i = 0; i < pageUrls.length; i++) {
			$.post(pageUrls[i], (html) => {
				var page = exctractPage(html);
				res.pages[page.name] = page;
				if(++callCount == pageUrls.length) callback(res);
			});
		}
		
	}
}

module.exports = { plugin };