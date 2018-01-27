var freezer = require('./state');

freezer.on('current_page:update', (page_id) => {

	freezer.get().set({ status: 'updating' });

	var prev_page = freezer.get().current_page;
	freezer.get().set({ current_page: page_id })

	setTimeout(() => {

		if(true) {
			freezer.get().set({
				current_page: prev_page,
				status: 'error'
			});
		}
		else {
			freezer.get().set({
				current_page: page_id,
				status: 'idle'
			});
		}
	}, 1000);
});

// setTimeout(function() {
// 	freezer.get().set({ current_page: 3 })
// }, 15000);