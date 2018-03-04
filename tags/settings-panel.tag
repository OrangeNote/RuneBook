<settings-panel>
	<div class="ui tiny modal">
		<div class="content">
			<div class="ui form">
			  <div class="grouped fields">
			  	<div class="field">
						<div class="ui toggle checkbox">
							<input type="checkbox" name="public">
							<label>Checkbox label</label>
						</div>
					</div>
					<div class="field">
						<div class="ui toggle checkbox">
							<input type="checkbox" name="asd">
							<label>Checkbox label</label>
						</div>
					</div>
					<div class="field">
						<div class="ui toggle checkbox">
							<input type="checkbox" name="zxc">
							<label>Checkbox label</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<script>
		this.on('mount', () => {
			$('.tiny.modal').modal({
				duration: 200,
				centered: false,
				autofocus: false,
			});
		});

	</script>
</settings-panel>