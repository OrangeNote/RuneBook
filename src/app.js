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
	var state = freezer.get();

	page_data = store.get(`local.${champion}.pages.${page}`);
	page_data.name = page;
	page_data.current = true;

	api.postPage(page_data).then((res) => {
		if(res) state.lastUploadedPage.set({ page });
	});
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
});

// Start listening for the LCU client
connector.start();