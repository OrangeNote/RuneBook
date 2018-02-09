<connection-status>
	<div class="ui container">
		<hr>
		<button class={opts.connection.page ? "ui button" : "ui button disabled"} onclick={ downloadCurrentPage }>Download</button>
		<span>Current page: { opts.connection.page ? opts.connection.page.name : "" }</span>
		<br>
		<span>{ opts.session.connected ? "ONLINE" : opts.session.state }</span>
	</div>

	<script>

		downloadCurrentPage(evt) {
			evt.preventUpdate = true;
			freezer.emit("currentpage:download");
		}

	</script>
</connection-status>