<current-page>
	
	<div class="ui container">
		<div class="ui horizontal divider" if={ opts.connection.page }>Your current page</div>
		
		<div class="ui middle aligned relaxed divided list" if={ opts.connection.page }>
      		<div class="item">
      			<div class="right floated content" data-key={ key }>

					<button class={opts.connection.page ? "ui icon button" : "ui icon button disabled"} onclick={ downloadCurrentPage }>
						<i class="download icon"></i>
					</button>
				</div>
				<img each={ rune, index in opts.connection.page.selectedPerkIds } class="ui mini circular image" src=./resources/runesReforged/perk/{rune || "qm"}.png>
				<div class="content">
					<i class={ opts.connection.page.isValid ? "" : "warning sign icon" }></i> {opts.connection.page.name}
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