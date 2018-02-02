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

connector.on('connect', (data) => {
    console.log(data);
    freezer.get().set({ connection: data });
});

connector.on('disconnect', () => {
	freezer.get().set({ connection: null });
});

// Start listening for the LCU client
connector.start();