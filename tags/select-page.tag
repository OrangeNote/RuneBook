<select-page>

	<span>Selected: {current_page}</span>
	<select class="ui dropdown" onchange={setCurrentPage} ref="page_list">
		<option each={page in pages} value={page.id} selected={current_page == page.id}>{page.name}</option>
	</select>
	<span>Status: { status }</span>

	<script>

		this.on('mount', () => {
			
			$('.ui.dropdown').dropdown();

			_.assign(this, opts.freezer.get());
			this.update();
		})

		opts.freezer.on('update', () => {
			var state = opts.freezer.get();
			this.update(state);
			$('.ui.dropdown').dropdown('set selected', state.current_page);
		});

		setCurrentPage(evt) {
			evt.preventUpdate = true;
			opts.freezer.emit('current_page:update', this.refs.page_list.value);
		}

	</script>
</select-page>