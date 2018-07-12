<current-page>
	
	<div class="ui container">
		<div class="ui horizontal divider"><i1-8n>currentpage.title</i1-8n></div>
		<div class="ui segment">
			<h4 class="ui center aligned header" if={ !opts.connection.page }>
				<i1-8n>currentpage.unavailable</i1-8n>
				<div class="sub header"><i1-8n>currentpage.unavailable.subheader1</i1-8n></div>
				<div class="sub header"><i1-8n>currentpage.unavailable.subheader2</i1-8n></div>
			</h4>
			<div if={ opts.connection.page } class="ui middle aligned relaxed divided list">
				<div class="item">
					<div class="right floated content" data-key={ key }>

						<button class={ (opts.current.champion && opts.connection.page && opts.plugins.local[opts.tab.active]) ? "ui icon button" : "ui icon button disabled"} onclick={ downloadCurrentPage } data-tooltip="{ i18n.localise('currentpage.downloadcurrentpage') }" data-position="left center" data-inverted="">
							<i class="download icon"></i>
						</button>
					</div>

					<div class="ui image">
						<div each={ index in [0,1,2,3,4,5] } class="ui circular icon button tooltip current-page-tooltip" style="margin: 0; padding: 0; background-color: transparent; cursor: default;"
						data-html={findTooltip(index)}>
							<img draggable="false" class="ui mini circular image" src=./img/runesReforged/perk/{opts.connection.page && opts.connection.page.selectedPerkIds[index] || "qm"}.png>
						</div>
					</div>

					
					<div class="middle aligned content">
						<i class={ opts.connection.page ? (!opts.connection.page.isEditable || opts.connection.summonerLevel < 15 ? "lock icon" : (opts.connection.page.isValid ? "" : "red warning sign icon")) : "" }></i> {opts.connection.page ? opts.connection.page.name : ""}
					</div>
				</div>
			</div>
		</div>
	</div>

	<script>

		this.on('updated', function() {
			$('.current-page-tooltip').popup()
		});

		findTooltip(index) {
			if(!opts.tooltips.rune) return;
			var tooltip = opts.tooltips.rune.find((el) => el.id === opts.connection.page.selectedPerkIds[index]);
			return '<b>' + tooltip.name + '</b><br>' + tooltip.longDesc;
		}
		
		downloadCurrentPage(evt) {
			evt.preventUpdate = true;
			freezer.emit("currentpage:download");
		}

	</script>
</current-page>