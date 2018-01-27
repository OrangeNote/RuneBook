<runebook>

	<span>{ this.current_page }</span>
	<input type="text" ref="current_page">
	<button onclick={ setCurrentPage }>Set current page</button>
	<span>{ this.status }</span>

	<script>

		var state = opts.freezer.get();
		this.current_page = state.current_page;
		this.status = state.status;

		opts.freezer.on('update', () => {
			var state = opts.freezer.get();
			console.log(state)
			this.update({
				current_page: state.current_page,
				status: state.status,
			});
		});

		setCurrentPage(evt) {
			evt.preventUpdate = true;
			opts.freezer.emit('current_page:update', this.refs.current_page.value);
		}

	</script>

</runebook>