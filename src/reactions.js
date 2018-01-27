var freezer = require('./state');

freezer.on('current_page:update', function( page_id ) {

	freezer.get().set({ status: 'updating' });

	setTimeout(function() {
		freezer.get().set({
			current_page: page_id,
			status: 'idle'
		});
	}, 3000);
});