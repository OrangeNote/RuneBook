var Store = require('electron-store');
var store = new Store();

var plugin = {
	name: "Local pages",
	local: true,
	active: true,

	getPages(champion, callback) {
		var res = store.get(`local.${champion}`) || {pages: {}};
		callback(res);
	},

	favPage(champion, page) {
		if(store.get(`local.${champion}.fav`) == page) {
			store.set(`local.${champion}.fav`, null);
		}
		else store.set(`local.${champion}.fav`, page);
	},

	deletePage(champion, page) {
		store.delete(`local.${champion}.pages.${page}`);
		if(store.get(`local.${champion}.fav`) == page) {
			store.set(`local.${champion}.fav`, null);
		}
	},

	setPage(champion, page) {
		var pages = store.get(`local.${champion}.pages`) || {};
		pages[page.name] = page;
		store.set(`local.${champion}.pages`, pages);
	}
}

module.exports = { plugin };