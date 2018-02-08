<connection-status>
	<div class="ui container">
		<hr>
		<span>Current page: { opts.connection.page ? opts.connection.page.name : "" }</span>
		<button class="ui button" onclick={ downloadCurrentPage }>Download</button>
	</div>

	<script>

		downloadCurrentPage(evt) {
			evt.preventUpdate = true;
			freezer.emit("currentpage:download");
		}

	</script>
</connection-status>