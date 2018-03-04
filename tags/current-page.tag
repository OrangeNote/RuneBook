<current-page>
	
	<div class="ui container">
		<div class="ui horizontal divider">Current page</div>
		<div class="ui segment">
			<h4 class="ui center aligned header" if={ !opts.connection.page }>
				Current page is not available.
				<div class="sub header">Please log in to the League Client to access your rune pages.</div>
			</h4>
			<div if={ opts.connection.page } class="ui middle aligned relaxed divided list">
				<div class="item">
					<div class="right floated content" data-key={ key }>

						<button class={ (opts.current.champion && opts.connection.page && opts.plugins.local[opts.tab.active]) ? "ui icon button" : "ui icon button disabled"} onclick={ downloadCurrentPage }>
							<i class="download icon"></i>
						</button>
					</div>
					<img each={ index in [0,1,2,3,4,5] } draggable="false" class="ui mini circular image" src=./img/runesReforged/perk/{opts.connection.page && opts.connection.page.selectedPerkIds[index] || "qm"}.png>
					<div class="content">
						<i class={ opts.connection.page ? (!opts.connection.page.isEditable || opts.connection.summonerLevel < 15 ? "lock icon" : (opts.connection.page.isValid ? "" : "red warning sign icon")) : "" }></i> {opts.connection.page ? opts.connection.page.name : ""}
					</div>
				</div>
			</div>
		</div>
	</div>

	<script>

		downloadCurrentPage(evt) {
			evt.preventUpdate = true;
			freezer.emit("currentpage:download");
		}

	</script>
</current-page>