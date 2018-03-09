var request = require('request');
var cheerio = require('cheerio');

var url = "https://runes.lol/aram/platinum/plus/champion/win/"

var stylesMap = {
	"PRECISION":8000,
	"DOMINATION":8100,
	"SORCERY":8200,
	"RESOLVE":8400,
	"INSPIRATION":8300
};

function extractPage(html, champion) {
	var $ = cheerio.load(html);

	var path = $('#runewrapper');
	var name = $('.pure-g h1', path).first().text();
  name = name.split(/\s+/).slice(0, 2).join(' ');

	var page = {
			"name": name,
			"primaryStyleId": -1,
			"selectedPerkIds": [0, 0, 0, 0, 0, 0],
			"subStyleId": -1,
			"bookmark": { "src": url + champion, "remote": { "name": plugin.name, "id": plugin.id } }
		};

	var edit = $('#edit').attr('href');
	var runesList = edit.split('/')[7];
  var runes = runesList.split('-');

	page.primaryStyleId = stylesMap[$('div:nth-child(3) > h2', path).text()];
	page.subStyleId = stylesMap[$('div:nth-child(5) > h3', path).text()];

	for(var i = 0; i < runes.length; i++) {
		page.selectedPerkIds[i] = parseInt(runes[i]);
	}
	console.log(page);
	return page;
}

function _getPages(champion, callback) {
	var res = {pages: {}};
	var champUrl = url + champion;

	request.get(champUrl, (error, response, html) => {
		if(!error && response.statusCode == 200) {
			var page = extractPage(html, champion);
			res.pages[page.name] = page;
			callback(res)
		}
		else {
			throw Error("rune page not loaded");
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
		request.get(bookmark.src, (error, response, html) => {
			if(!error && response.statusCode == 200) {
				callback(extractPage(html, bookmark.src));
			}
			else {
				throw Error("rune page not loaded");
			}
		});
	}
}

module.exports = { plugin };
