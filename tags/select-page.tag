<select-page>
	<span>Selected: {current_page}</span>

	<select onchange={setCurrentPage} ref="page_list">
		<option each={page in pages} value={page.id} selected={current_page == page.id}>{page.name}</option>
	</select>

	<span>Status: { status }</span>

	<script>
		
		this.on('mount', () => {
			_.assign(this, opts.freezer.get());
			this.update();
		})

		opts.freezer.on('update', () => {

			this.update(opts.freezer.get());
		});

		setCurrentPage(evt) {
			evt.preventUpdate = true;
			opts.freezer.emit('current_page:update', this.refs.page_list.value);
		}

	</script>
</select-page>