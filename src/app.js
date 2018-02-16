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
		});
	});
});

var plugins = require('../plugins');
console.log("plugins", plugins);
function loadPlugins() {
	var remote = {}, local = {};
	Object.keys(plugins).forEach((key) => {
		if(plugins[key].local === true) local[key] = {name: plugins[key].name};
		else remote[key] = {name: plugins[key].name};
	});
	freezer.get().plugins.set({ local, remote });
}
loadPlugins();

freezer.on('champion:choose', (champion) => {

	freezer.get().tab.set({ active: freezer.get().tab.active, loaded: false });
	freezer.get().current.set({ champion }); // update champ portrait before the data response
	var state = freezer.get();

	plugins[state.tab.active].getPages(champion, (res) => {
		freezer.get().current.set({ champion, champ_data: res || {pages: {}} });
		freezer.get().tab.set({ loaded: true });
	});
});

freezer.on("tab:switch", (tab) => {
	freezer.get().tab.set({ active: tab, loaded: tab == "local" || !freezer.get().current.champion });

	var state = freezer.get();

	plugins[state.tab.active].getPages(state.current.champion, (res) => {
		freezer.get().current.set({ champion: freezer.get().current.champion, champ_data: res || {pages: {}} });
		freezer.get().tab.set({ loaded: true });
	});
});

freezer.on('page:fav', (champion, page) => {
	var state = freezer.get();
	plugins[state.tab.active].favPage(champion, page);
	plugins[state.tab.active].getPages(champion, (res) => {
		state.current.champ_data.set(res);	
	});
});

freezer.on('page:delete', (champion, page) => {
	var state = freezer.get();
	plugins[state.tab.active].deletePage(champion, page);
	plugins[state.tab.active].getPages(champion, (res) => {
		state.current.champ_data.set(res);	
	});
});

freezer.on('page:upload', (champion, page) => {
	var state = freezer.get();

	page_data = state.current.champ_data.pages[page];
	page_data.name = page;
	page_data.current = true;

	console.log("page.id, page.isEditable", state.connection.page.id, state.connection.page.isEditable);
	if(state.connection.page.id && state.connection.page.isEditable) {
		api.del("/lol-perks/v1/pages/" + freezer.get().connection.page.id).then((res) => {
			console.log("api delete current page", res);

			api.post("/lol-perks/v1/pages/", page_data).then((res) => {
				if(!res) {
					console.log("Error: no response after page upload request.");
					return;
				}
				console.log("post res", res);

				freezer.get().lastuploadedpage.set({ champion, page, valid: res.isValid === true });
				
				var state = freezer.get();
				if(plugins[state.tab.active].local) {
					plugins[state.tab.active].confirmPageValidity(champion, page, res);
					plugins[state.tab.active].getPages(champion, (res) => {
						state.current.champ_data.set(res)
					});
				}
			});
		});
	}
});

freezer.on('currentpage:download', () => {
	var state = freezer.get();

	var champion = state.current.champion;
	var page = state.connection.page;

	plugins[state.tab.active].setPage(champion, page);
	plugins[state.tab.active].getPages(champion, (res) => {
		state.current.champ_data.set(res);	
	});
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