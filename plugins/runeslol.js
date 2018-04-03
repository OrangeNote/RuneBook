var cheerio = require('cheerio');
var request = require('request');

var baseUrl = "https://runes.lol";
var url = baseUrl + "/{gamemode}/platinum/plus/champion/{page}/{champion}/{role}";
var modeWin = "win";
var modePick = "pick";
var gamemodeRanked = "ranked";
var gamemodeAram = "aram";

var stylesMap = {
	"PRECISION":8000,
	"DOMINATION":8100,
	"SORCERY":8200,
	"RESOLVE":8400,
	"INSPIRATION":8300
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
	"Celestial Body":8339,
	"Bone Plating":8473,
	"Time Warp Tonic":8352
};

function extractPage(html, pageName, pageUrl) {
		
	var $ = cheerio.load(html);
	var page = {
		"name": pageName,
		"primaryStyleId": -1,
		"selectedPerkIds": [0, 0, 0, 0, 0, 0],
		"subStyleId": -1,
		"bookmark": { "src": pageUrl, "pName": pageName, "remote": { "name": plugin.name, "id": plugin.id } }
	};

	//getting keystone divs
	var keystones = [];
	
	$(".pure-u-8-24 > .runetitle").each(function() { keystones.push($(this).text()); });

	page.primaryStyleId = stylesMap[keystones[0]];
	page.subStyleId = stylesMap[keystones[1]];

	// 2, 4, 6, 7 - main runes, 3, 5 - secondary runes
	page.selectedPerkIds[0] = perksMap[keystones[2]];
	page.selectedPerkIds[1] = perksMap[keystones[4]];
	page.selectedPerkIds[2] = perksMap[keystones[6]];
	page.selectedPerkIds[3] = perksMap[keystones[7]];
	page.selectedPerkIds[4] = perksMap[keystones[3]];
	page.selectedPerkIds[5] = perksMap[keystones[5]];

	return page;		
}

function fillUrl(urlToReplace, gamemode, page, champion, role) {
	return urlToReplace.replace("{gamemode}", gamemode).replace("{page}", page).replace("{champion}", champion).replace("{role}", role)
}

function _getPages(champion, callback) {
	var res = {pages: {}};

	//getting main page
	console.log("getting main page for " + champion);
	var pages = [];
	request(fillUrl(url, gamemodeRanked, modeWin, champion, ""), function(error, response, html) {
		if(!error && response.statusCode == 200) {				
			//adding ARAM pages
			pages.push({page: fillUrl(url, gamemodeAram, modeWin, champion, ""), name: "ARAM - HW"});
			pages.push({page: fillUrl(url, gamemodeAram, modePick, champion, ""), name: "ARAM - MP"});
			
			var $ = cheerio.load(html);
			var lanes = [];
			$("a.lanefilter").not(".active").each(function() { lanes.push($(this).attr("href")); });

			// if there are no separate roles
			if(lanes.length == 0) {
				pages.push({page: fillUrl(url, gamemodeRanked, modeWin, champion, "" ), name: "Normal - HW"});
				pages.push({page: fillUrl(url, gamemodeRanked, modePick, champion, ""), name: "Normal - MP"});
			}
			// we get the pages for the specific lanes
			else if (lanes.length > 1) {
				for (var i = 0; i < lanes.length; i++) {
					pages.push({page: baseUrl + lanes[i], name: "Normal - " + lanes[i].split("/").filter(String).slice(-1)[0] + " - HW"});
					pages.push({page: baseUrl + lanes[i].replace("/" + modeWin + "/", "/" + modePick + "/"), name: "Normal - " + lanes[i].split("/").filter(String).slice(-1)[0] + " - MP"});
				}
			}

			var count = pages.length;

			for(var i = 0; i < pages.length; i++) {
				console.log("getting " + pages[i].name);
				// we send our custom pagename with the request so we can distuingish between pages in the response
				request({ url: pages[i].page, headers: {"X-PageName": pages[i].name}}, function(error, response, html) {
					if(!error && response.statusCode == 200) {
						var page = extractPage(html, response.request.headers["X-PageName"], response.request.uri.href);
						
						res.pages[page.name] = page;
						console.log("extracted " + page.name);
						count--;
						if(count == 0) {
							ordered = {};
							//we sort it back
							Object.keys(res.pages).sort().forEach(function(key) {
								ordered[key] = res.pages[key];
							  });

							  res.pages = ordered;
							  
							callback(res);
						}
					}
				});			
			}
		}
		else {
			callback(res);
			throw Error("failed to load main page for " + champion);
		}
	});	
}

var plugin = {
	id: "runeslol",
	name: "Runes LoL",
	active: true,
	bookmarks: true,

	getPages(champion, callback) {
		_getPages(champion, callback);
	},

	syncBookmark(bookmark, callback) {
		request(bookmark.src, function(error, response, html) {
			if(!error && response.statusCode == 200) {
				callback(extractPage(html, bookmark.pName, bookmark.src));
			}
			else {
				console.log(bookmark);
				throw Error("unable to sync " + bookmark.src);
			}
		});
	}
}

module.exports = { plugin };
