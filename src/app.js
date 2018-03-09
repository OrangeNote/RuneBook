var settings = require('./settings');
var freezer = require('./state');

freezer.get().configfile.set({
	name: settings.get("config.name") + settings.get("config.ext"),
	cwd: settings.get("config.cwd")
});

var request = require('request');

var {ipcRenderer} = require('electron');
ipcRenderer.on('update:ready', (event, arg) => {
	console.log("UPDATE RECEIVED FROM MAIN PROCESS")
	freezer.get().set("updateready", true);
});

var path = require('path');

freezer.on("configfile:change", (newPath) => {

	settings.set({
		config: {
			name: path.basename(newPath, path.extname(newPath)),
			cwd: path.dirname(newPath),
			ext: path.extname(newPath)
		}
	});
});

freezer.on("update:do", () => {
	ipcRenderer.send('update:do');
});

request('https://ddragon.leagueoflegends.com/api/versions.json', function (error, response, data) {
	if(!error && response && response.statusCode == 200) {
		freezer.emit("version:set", JSON.parse(data)[0]);
	}
	else throw Error("Couldn't get ddragon api version");
});

freezer.on('version:set', (ver) => {
	request('http://ddragon.leagueoflegends.com/cdn/'+ver+'/data/en_US/champion.json', function(error, response, data) {
		if(!error && response && response.statusCode == 200){
			freezer.get().set('championsinfo', JSON.parse(data).data);
		}
	});
});

freezer.on('api:connected', () => {
	api.get("/lol-login/v1/session").then((res) => {
		updateConnectionData();
		if(!res) {
			console.log("no session response");
			return;
		}
		console.log("session success", res);
		freezer.get().session.set({ connected: res.connected, state: res.state });
	});
});

var plugins = require('../plugins');
console.log("plugins", plugins);
function loadPlugins() {
	var remote = {}, local = {};
	Object.keys(plugins).forEach((key) => {
		if(plugins[key].local === true) local[key] = {name: plugins[key].name};
		else remote[key] = {
			name: plugins[key].name,
			bookmarks: plugins[key].bookmarks || false,
			cache: {}
		};
	});
	freezer.get().plugins.set({ local, remote });
}
loadPlugins();

freezer.on('champion:choose', (champion) => {

	var state = freezer.get();

	var plugin = state.tab.active;

	// Check if champion is already been cached before asking the remote plugin
	if(state.plugins.remote[plugin] && state.plugins.remote[plugin].cache[champion]) {
		freezer.get().current.set({ champion, champ_data: state.plugins.remote[plugin].cache[champion] || {pages: {}} });
		console.log("CACHE HIT!");
		return;
	}

	freezer.get().tab.set({ active: freezer.get().tab.active, loaded: false });
	freezer.get().current.set({ champion }); // update champ portrait before the data response

	state = freezer.get();

	plugins[state.tab.active].getPages(champion, (res) => {
		if(freezer.get().tab.active != state.tab.active) return;
		freezer.get().current.set({ champion, champ_data: res || {pages: {}} });
		freezer.get().tab.set({ loaded: true });

		// Cache results obtained from a remote source
		if(freezer.get().plugins.remote[plugin])
			freezer.get().plugins.remote[plugin].cache.set(champion, res);
	});
});

freezer.on("tab:switch", (tab) => {
	freezer.get().tab.set({ active: tab, loaded: true });

	var state = freezer.get();

	var plugin = state.tab.active;
	var champion = freezer.get().current.champion;

	// Check if champion is already been cached before asking the remote plugin
	if(state.plugins.remote[plugin] && state.plugins.remote[plugin].cache[champion]) {
		freezer.get().current.set({ champion, champ_data: state.plugins.remote[plugin].cache[champion] || {pages: {}} });
		console.log("CACHE HIT!");
		return;
	}

	freezer.get().tab.set({ active: tab, loaded: tab == "local" || !freezer.get().current.champion });

	state = freezer.get();

	if(!state.current.champion) return;
	plugins[state.tab.active].getPages(state.current.champion, (res) => {
		if(freezer.get().tab.active != state.tab.active) return;
		freezer.get().current.set({ champion: freezer.get().current.champion, champ_data: res || {pages: {}} });
		freezer.get().tab.set({ loaded: true });

		// Cache results obtained from a remote source
		if(freezer.get().plugins.remote[plugin])
			freezer.get().plugins.remote[plugin].cache.set(champion, res);
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

freezer.on('page:unlinkbookmark', (champion, page) => {
	var state = freezer.get();
	plugins[state.tab.active].unlinkBookmark(champion, page);
	plugins[state.tab.active].getPages(champion, (res) => {
		state.current.champ_data.set(res);	
	});
});

freezer.on('page:bookmark', (champion, pagename) => {
	var state = freezer.get();

	page = state.current.champ_data.pages[pagename];
	console.log(page)

	plugins["local"].setPage(champion, page);
	freezer.get().lastbookmarkedpage.set({ champion, page: pagename });
	freezer.get().lastsyncedpage.set({ champion: null, page: null, loading: false });
});

freezer.on('page:syncbookmark', (champion, page) => {
	freezer.get().lastsyncedpage.set({champion, page, loading: true});

	var state = freezer.get();

	page = state.current.champ_data.pages[page];
	console.log(page)

	plugins[page.bookmark.remote.id].syncBookmark(page.bookmark, (_page) => {
		plugins[state.tab.active].setPage(champion, _page);
		plugins[state.tab.active].getPages(champion, (res) => {
			state.current.champ_data.set(res);
			freezer.get().lastsyncedpage.set({champion, _page, loading: false});
		});
	});
});

freezer.on('page:upload', (champion, page) => {
	var state = freezer.get();
	console.log("DEV page", page);
	console.log("DEV page data", state.current.champ_data.pages[page]);
	console.log("DEV state pages", state.current.champ_data.pages);
	page_data = state.current.champ_data.pages[page];
	page_data.name = page;
	page_data.current = true;

	console.log("page.id, page.isEditable", state.connection.page.id, state.connection.page.isEditable);
	if(state.connection.page.id && state.connection.page.isEditable && state.connection.summonerLevel >= 15) {
		freezer.off('/lol-perks/v1/currentpage:Update');
		freezer.get().lastuploadedpage.set({ champion, page, loading: true });
		api.del("/lol-perks/v1/pages/" + freezer.get().connection.page.id).then((res) => {
			console.log("api delete current page", res);

			api.post("/lol-perks/v1/pages/", page_data).then((res) => {
				if(!res) {
					console.log("Error: no response after page upload request.");
					api.get("/lol-perks/v1/currentpage").then((res) => {
						handleCurrentPageUpdate(res);
						freezer.on('/lol-perks/v1/currentpage:Update', handleCurrentPageUpdate);
					});
					return;
				}
				console.log("post res", res);
				api.get("/lol-perks/v1/currentpage").then((res) => {
					handleCurrentPageUpdate(res);
					freezer.on('/lol-perks/v1/currentpage:Update', handleCurrentPageUpdate);
				});
				freezer.on('/lol-perks/v1/currentpage:Update', handleCurrentPageUpdate);
				freezer.get().lastuploadedpage.set({ champion, page, valid: res.isValid === true, loading: false });
				
				var state = freezer.get();
				if(plugins[state.tab.active].local) {
					plugins[state.tab.active].confirmPageValidity(champion, page, res);
					plugins[state.tab.active].getPages(champion, (res) => {
						state.current.champ_data.set(res);
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
	if(!session.connected) {
		freezer.get().connection.set({ page: null, summonerLevel: 0 });
	}
	else {
		updateConnectionData();
	}
})

function handleCurrentPageUpdate(page) {
	var state = freezer.get();

	console.log("currentpage:Update", page.name);
	state.connection.set({ page });
	if(page.name != freezer.get().lastuploadedpage.page) freezer.get().lastuploadedpage.set({ champion: null, page: null, valid: false });
}

function updateConnectionData() {
	api.get("/lol-perks/v1/currentpage").then((page) => {
		if(!page) {
			console.log("Error: current page initialization failed");
			return;
		}
		freezer.get().connection.set({ page });
		freezer.get().lastuploadedpage.set({ champion: null, page: null, valid: false });
	});

	api.get("/lol-summoner/v1/current-summoner").then((summoner) => {
		if(!summoner) {
			console.log("no summoner response");
			return;
		}
		freezer.get().connection.set("summonerLevel", summoner.summonerLevel);
	});

	api.get("/lol-perks/v1/perks").then((data) => {
		if(!data) return;
		freezer.get().tooltips.set("rune", data);
	});
}

freezer.on('/lol-perks/v1/currentpage:Update', handleCurrentPageUpdate);

freezer.on('/lol-champ-select/v1/session:Delete', () => {
	freezer.get().set("champselect", false);
});

freezer.on('/lol-champ-select/v1/session:Update', (data) => {
	console.log(data)
	if(data.actions[0][0].completed === false) freezer.get().set("champselect", true);
	else freezer.get().set("champselect", false);
	if(freezer.get().autochamp === false) return;
	var champions = freezer.get().championsinfo;
	var champion = Object.keys(champions).find((el) => champions[el].key == data.actions[0][0].championId);
	console.log(champion)
	freezer.emit('champion:choose', champion);
	freezer.get().tab.set("active", "local");
});

freezer.on("autochamp:enable", () => {
	freezer.get().set("autochamp", true);

	// Check if a champ was already selected in client
	api.get("/lol-champ-select/v1/session").then((data) => {
		if(!data) return;
		if(data.actions[0][0].completed === false) freezer.get().set("champselect", true);
		var champions = freezer.get().championsinfo;
		var champion = Object.keys(champions).find((el) => champions[el].key == data.actions[0][0].championId);
		console.log(champion)
		freezer.emit('champion:choose', champion);
		freezer.get().tab.set("active", "local");
	});
});

freezer.on("autochamp:disable", () => {
	freezer.get().set("autochamp", false);
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