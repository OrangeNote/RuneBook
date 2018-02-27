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
		console.log(champion, page)
		page = page.replace(/\./g, '\\.');
		store.delete(`local.${champion}.pages.${page}`);
		if(store.get(`local.${champion}.fav`) == page) {
			store.set(`local.${champion}.fav`, null);
		}
	},

	unlinkBookmark(champion, page) {
		page = page.replace(/\./g, '\\.');
		store.delete(`local.${champion}.pages.${page}.bookmark`);
	},

	setPage(champion, page) {
		var pages = store.get(`local.${champion}.pages`) || {};
		pages[page.name] = page;
		store.set(`local.${champion}.pages`, pages);
	},

	confirmPageValidity(champion, page, res) {
		page = page.replace(/\./g, '\\.');
		/*
		 * If the page returned is invalid, mark it as such in the store.
		 * This behaviour is not predictable (a page can become invalid at any time),
		 * so we want to make sure to notify users as soon as we get this info from lcu.
		 */
		if(res.isValid === false) {
			console.log("Warning: page incomplete or malformed.");
			store.set(`local.${champion}.pages.${page}.isValid`, false);
		}
		/*
		 * If the page returned is valid, but we have an invalid copy in the store,
		 * then replace the local page with the updated one.
		 */
		else if(store.get(`local.${champion}.pages.${page}.isValid`) === false) {
			store.set(`local.${champion}.pages.${page}`, res);
		}
	},

	toggleDarkMode() {
		var dark = !store.get("local.settings.darkmode");
		store.set("local.settings.darkmode", dark);
		return dark;
	}
}

module.exports = { plugin };
