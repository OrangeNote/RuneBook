var request = require('request');
var cheerio = require('cheerio');

var url = "http://koreanbuilds.net";

var stylesMap = {
	"8000":8000,
	"8100":8100,
	"8200":8200,
	"8300":8400,
	"8400":8300
};

function extractPage(html, champObj, champion, role, rec, callback, pageType) {
	var $ = cheerio.load(html);

	var pages = [];
	var runecount = -1;
	var slots = $("div[class^=perk-itm]");


	$("img[src^='//statics.koreanbuilds.net/perks/']", slots).each(function(index) {
		if(index % 8 == 0) {
			pages.push({
				"name": champObj.name + " " + role + " BC "+ $('#circle-big').text(),
				"primaryStyleId": -1,
				"selectedPerkIds": [0, 0, 0, 0, 0, 0],
				"subStyleId": -1,
				// "bookmark": {
				// 	"src": url + "/champion/" + champion + "/" + role + "/" + champObj.version.replace(/\.(?:[0-9]*)$/, '') + '/-1',
				// 	"meta": {
				// 		"pageType": Math.floor(index / 6),
				// 		"champion": champion
				// 	},
				// 	"remote": { "name": plugin.name, "id": plugin.id }
				// }
			})
		}
		var rune = $(this).attr("src");
		rune = rune.replace("//statics.koreanbuilds.net/perks/", "");
		rune = rune.replace(".png", "");
		var primary = $('#reforged-primary .perk-img-c').attr("src");
		primary = primary.replace("//statics.koreanbuilds.net/perk-types/", "");
		primary = primary.replace(".png", "");
		var secondary = $('#reforged-secondary .perk-img-c').attr("src");
		secondary = secondary.replace("//statics.koreanbuilds.net/perk-types/", "");
		secondary = secondary.replace(".png", "");
		if(index % 6 == 0) {
			pages[pages.length - 1].primaryStyleId = stylesMap[primary];
			pages[pages.length - 1].subStyleId = stylesMap[secondary];
		}
		pages[pages.length - 1].selectedPerkIds[index] = parseInt(rune);
	});

	if(rec) {
		var reqCount = 0;
		var summs = [];
		$('#summSel option').each(function(index) {
			if(index != 0)
				summs.push($(this).val())
		})
		console.log("IF REC TRUE")
		console.log("summs length", summs.length)
		if(summs.length == 0) return callback(pages);
		summs.forEach(function(value) {
			console.log(url + "/champion/" + champObj.name + "/" + role + "/" + champObj.version.replace(/\.(?:[0-9]*)$/, '') + '/'+ value)
			request.get(url + "/champion/" + champObj.name + "/" + role + "/" + champObj.version.replace(/\.(?:[0-9]*)$/, '') + '/' + value, (error, response, _html) => {
				if(!error && response.statusCode == 200) {
					var newPages = extractPage(_html, champObj, champion, role, false);
					pages = pages.concat(newPages);
					console.log("newPages", newPages)
					if(++reqCount == summs.length) callback(pages);
				}
			});
		});
	}
	var regex = /(?:\d{0,3}(\.\d{1,2})? *%?)$/
	pages.sort((a, b) => {
		var percentA = parseFloat(a.name.match(regex)[0]);
		var percentB = parseFloat(b.name.match(regex)[0]);
		return percentB - percentA;
	})
	return ((typeof pageType !== "undefined") ? pages[pageType] : pages);
}

function _getPages(champion, callback) {
	var res = {pages: {}};

	var champ = freezer.get().championsinfo[champion]
	var champId = champ.key;
	request.get(url + "/roles?championid="+ champId, (error, response, html) => {
		if(!error && response.statusCode == 200) {
			var $ = cheerio.load(html);
			var rolesExtracted = $.root().text().split('\n').filter((value) => value != '');
			var roles = rolesExtracted.map((s) => { return String.prototype.trim.apply(s) })
			if(!roles.length || roles.length == 0){
				console.log(`No builds found for ${champion}.`)
				callback(res)
			} else {
				roles.forEach((role) => {
					var champUrl = url + "/champion/" + champ.name + "/" + role + "/" + champ.version.replace(/\.(?:[0-9]*)$/, '') + '/-1';
					request.get(champUrl, (error, response, html) => {
						if(!error && response.statusCode == 200) {
							extractPage(html, champ, champion, role, true, (pages) => {
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
				})
			}
		}
		else {
			callback(res);
			throw Error("roles page not loaded");
		}
	});
	
}

var plugin = {
	id: "koreanbuilds",
	name: "Korean Builds",
	active: true,
	bookmarks: false,

	getPages(champion, callback) {
		_getPages(champion, callback);
	},

	syncBookmark(bookmark, callback) {
		request.get(bookmark.src, (error, response, html) => {
			if(!error && response.statusCode == 200) {
				callback(extractPage(html, bookmark.meta.champion, false, null, bookmark.meta.pageType));
			}
			else {
				throw Error("rune page not loaded");
			}
		});
	}
}

module.exports = { plugin };