var Store = require('electron-store');
var store = new Store();

var freezer = require('./state');

var request = require('request');

request('https://ddragon.leagueoflegends.com/api/versions.json', function (error, response, data) {
	if(!error && response && response.statusCode == 200) {
		freezer.emit("version:set", JSON.parse(data)[0]);
	}
	else throw Error("Couldn't get ddragon api version");
});

freezer.on('api:connected', () => {
	api.get("/lol-login/v1/session").then((res) => {
		if(!res) {
			console.log("no session response");
			return;
		}
		console.log("session success");
		freezer.get().session.set({ connected: res.connected, state: res.state });

		api.get("/lol-perks/v1/currentpage").then((page) => {
			if(!page) {
				console.log("Error: current page initialization failed");
				return;
			}
			freezer.get().connection.set({ page });
			freezer.get().lastuploadedpage.set({ champion: null, page: null, valid: false });
		})
	});
})

freezer.on('champion:choose', (champion) => {
	var state = freezer.get();

	state.current.set({ champion, champ_data: store.get(`local.${champion}`) || {pages: {}} });
});

freezer.on('page:fav', (champion, page) => {
	var state = freezer.get();

	if(store.get(`local.${champion}.fav`) == page) {
		store.set(`local.${champion}.fav`, null);
	}
	else store.set(`local.${champion}.fav`, page);

	state.current.champ_data.set(store.get(`local.${champion}`));
});

freezer.on('page:delete', (champion, page) => {
	var state = freezer.get();

	store.delete(`local.${champion}.pages.${page}`);

	if(store.get(`local.${champion}.fav`) == page) {
		store.set(`local.${champion}.fav`, null);
	}

	state.current.champ_data.set(store.get(`local.${champion}`));
});

freezer.on('page:upload', (champion, page) => {

	page_data = store.get(`local.${champion}.pages.${page}`);
	page_data.name = page;
	page_data.current = true;

	var state = freezer.get();
	console.log("page.id, page.isEditable", state.connection.page.id, state.connection.page.isEditable);
	if(state.connection.page.id && state.connection.page.isEditable) {
		api.del("/lol-perks/v1/pages/" + freezer.get().connection.page.id).then((res) => {
			console.log("api delete current page", res);
		});

		api.post("/lol-perks/v1/pages/", page_data).then((res) => {
			if(!res) {
				console.log("Error: no response after page upload request.");
				return;
			}

			freezer.get().lastuploadedpage.set({ champion, page, valid: res.isValid === true });
			/*
			 * If the page created is invalid, mark it as such in the store.
			 * This behaviour is not predictable (a page can become invalid at any time),
			 * so we want to make sure to notify users as soon as we get this info from lcu.
			 */
			if(res.isValid === false) {
				console.log("Warning: page incomplete or malformed.");
				store.set(`local.${champion}.pages.${page}.isValid`, false);
				freezer.get().current.champ_data.set(store.get(`local.${champion}`));
			}
			/*
			 * If the page created is valid, but we have an invalid copy in the store,
			 * then replace the local page with the updated one.
			 */
			else if(store.get(`local.${champion}.pages.${page}.isValid`) === false) {
				store.set(`local.${champion}.pages.${page}`, res);
				freezer.get().current.champ_data.set(store.get(`local.${champion}`));
			}
		});
	}
});

freezer.on('currentpage:download', () => {
	var state = freezer.get();

	var champion = state.current.champion;
	var pages = store.get(`local.${champion}.pages`) || {};

	var page = state.connection.page;
	pages[page.name] = page;

	store.set(`local.${champion}.pages`, pages);
	state.current.champ_data.set(store.get(`local.${champion}`));
});

freezer.on('/lol-login/v1/session:Update', (session) => {
	var state = freezer.get();
	console.log("session", session.connected, session.state);

	state.session.set({ connected: session.connected, state: session.state });
	freezer.get().connection.set({ page: null });
})

freezer.on('/lol-perks/v1/currentpage:Update', (page) => {
	var state = freezer.get();

	console.log("currentpage:Update", page.name);
	state.connection.set({ page });
	freezer.get().lastuploadedpage.set({ champion: null, page: null, valid: false });
});

const LCUConnector = require('lcu-connector');
const connector = new LCUConnector();
const api = require('./lcu-api');

connector.on('connect', (data) => {
    console.log("client found");
    api.bind(data);
});

connector.on('disconnect', () => {
	console.log("client closed");
	api.destroy();
	freezer.get().session.set({ connected: false, state: "" })
});

// Start listening for the LCU client
connector.start();