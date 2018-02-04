<runebook>
  <div class="ui secondary pointing menu">
    <div class="ui menu header item">
        RuneBook
    </div>
  </div>

  <select-champion champion={champion}></select-champion>

  <page-list champion={champion.id}></page-list>

  <script>

  	this.champion = opts.champion;

  	freezer.on('update', () => {
		this.update(freezer.get());
	});

  </script>
</runebook>