var request = require('request');
var cheerio = require('cheerio');

var url = "http://champion.gg";

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
	"Conqueror":8010,
	"Overheal":9101,
	"Triumph":9111,
	"Presence of Mind":8009,
	"Legend: Alacrity":9104,
	"Legend: Tenacity":9105,
	"Legend: Bloodline":9103,
	"Coup de Grace":8014,
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
	"Chrysalis":8472,
	"Conditioning":8429,
	"Overgrowth":8451,
	"Revitalize":8453,
	"Second Wind":8444,
	"Unsealed Spellbook":8360,
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
	"Celestial Body":8339,
	"Bone Plating":8473,
	"Time Warp Tonic":8352,
	"Hail of Blades":9923,
	"Ultimate Hunter":8106,
	"Nimbus Cloak":8275,
	"Shield Bash":8401,

	"Scaling Health": 5001,
	"Armor": 5002,
	"Magic Resist": 5003,
	"Attack Speed": 5005,
	"Scaling Cooldown Reduction": 5007,
	"Adaptive Force": 5008
};

function exctractPage(html, champion, rec, callback, pageType) {
	var $ = cheerio.load(html);

	var pages = [];
	var runecount = -1;
	var slots = $("div[class^=Slot__RightSide]");

	var role = $(`li[class^='selected-role'] a[href^='/champion/${champion}']`).first();

	$("div[class*='Description__Title']", slots).each(function(index) {
		if(index % 11 == 0) {
			pages.push({
				"name": $(".champion-profile h1").text() + " " + role.text().trim() + (Math.floor(runecount / 9) ? " HW" : " MF"),
				"primaryStyleId": -1,
				"selectedPerkIds": [0, 0, 0, 0, 0, 0],
				"subStyleId": -1,
				"bookmark": {
					"src": url + role.attr("href"),
					"meta": {
						"pageType": Math.floor(index / 11),
						"champion": champion
					},
					"remote": { "name": plugin.name, "id": plugin.id }
				}
			})
		}
		var rune = $(this).text();
		rune = rune.replace(".png", "");
		console.log(rune)
		if(index % 11 == 0) {
			pages[pages.length - 1].primaryStyleId = stylesMap[rune];
			return;
		}
		else if(index % 11 == 5) {
			pages[pages.length - 1].subStyleId = stylesMap[rune];
			return;
		}
		else runecount++;
		
		pages[pages.length - 1].selectedPerkIds[runecount % 9] = perksMap[rune];
	});

	if(rec) {
		var reqCount = 0;
		var els = $(`li[class!='selected-role'] a[href^='/champion/${champion}']`);
		console.log("IF REC TRUE")
		console.log("ELS length", els.length)
		if(els.length == 0) return callback(pages);
		els.each(function(index) {
			console.log(url + "/champion/" + champion + "/" + $(this).text().trim())
			request.get(url + "/champion/" + champion + "/" + $(this).text().trim(), (error, response, _html) => {
				if(!error && response.statusCode == 200) {
					var newPages = exctractPage(_html, champion, false);
					pages = pages.concat(newPages);
					console.log("newPages", newPages)
					if(++reqCount == els.length) callback(pages);
				}
			});
		});
	}
	return ((typeof pageType !== "undefined") ? pages[pageType] : pages);
}

function _getPages(champion, callback) {
	var res = {pages: {}};

	var champUrl = url + "/champion/" + champion;
	console.log(champUrl)
	request.get(champUrl, (error, response, html) => {
		if(!error && response.statusCode == 200) {
			exctractPage(html, champion, true, (pages) => {
				pages.forEach((page) => {
					res.pages[page.name] = page;
				});
				console.log(res)
				callback(res);
			});
		}
		else {
			callback(res);
			throw Error("rune page not loaded");
		}
	});
}

var plugin = {
	id: "championgg",
	name: "Champion.gg",
	active: true,
	bookmarks: true,

	getPages(champion, callback) {
		_getPages(champion, callback);
	},

	syncBookmark(bookmark, callback) {
		request.get(bookmark.src, (error, response, html) => {
			if(!error && response.statusCode == 200) {
				callback(exctractPage(html, bookmark.meta.champion, false, null, bookmark.meta.pageType));
			}
			else {
				throw Error("rune page not loaded");
			}
		});
	}
}

module.exports = { plugin };