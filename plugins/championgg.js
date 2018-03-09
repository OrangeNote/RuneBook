var request = require('request');
var cheerio = require('cheerio');

var url = "http://champion.gg";

var stylesMap = {
	"icon-p":8000,
	"icon-d":8100,
	"icon-s":8200,
	"icon-r":8400,
	"icon-i":8300
};

function exctractPage(html, champion, rec, callback, pageType) {
	var $ = cheerio.load(html);

	var pages = [];
	var runecount = -1;
	var slots = $("div[class^=Slot__LeftSide]");

	var role = $(`li[class^='selected-role'] a[href^='/champion/${champion}']`).first();

	$("img[src^='https://s3.amazonaws.com/solomid-cdn/league/runes_reforged/']", slots).each(function(index) {
		if(index % 8 == 0) {
			pages.push({
				"name": $(".champion-profile h1").text() + " " + role.text().trim() + (Math.floor(runecount / 6) ? " HW" : " MF"),
				"primaryStyleId": -1,
				"selectedPerkIds": [0, 0, 0, 0, 0, 0],
				"subStyleId": -1,
				"bookmark": {
					"src": url + role.attr("href"),
					"meta": {
						"pageType": Math.floor(index / 8),
						"champion": champion
					},
					"remote": { "name": plugin.name, "id": plugin.id }
				}
			})
		}
		var rune = $(this).attr("src");
		rune = rune.replace("https://s3.amazonaws.com/solomid-cdn/league/runes_reforged/", "");
		rune = rune.replace(".png", "");
		if(index % 8 == 0) {
			pages[pages.length - 1].primaryStyleId = stylesMap[rune];
			return;
		}
		else if(index % 8 == 5) {
			pages[pages.length - 1].subStyleId = stylesMap[rune];
			return;
		}
		else runecount++;
		
		pages[pages.length - 1].selectedPerkIds[runecount % 6] = rune;
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