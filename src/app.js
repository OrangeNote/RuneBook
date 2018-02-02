var freezer = require('./state');

var prev_page = freezer.get().current_page;

freezer.on('current_page:update', (page_id) => {

	freezer.get().set({ status: 'updating' });

	prev_page = prev_page || freezer.get().current_page;
	freezer.get().set({ current_page: page_id })

	setTimeout(() => {

		if(true) {
			freezer.get().set({
				current_page: prev_page,
				status: 'error'
			});
			prev_page = null;
		}
		else {
			freezer.get().set({
				current_page: page_id,
				status: 'idle'
			});
		}
	}, 1000);
});

freezer.on('champion:choose', (data) => {
	var champion = freezer.get().champion;
	champion.set({ id: data });
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