<runebook>
  <div class="ui secondary pointing menu">
    <div class="ui menu header item">
        RuneBook
    </div>
  </div>

  <select-champion champion={current.champion}></select-champion>

  <page-list current={current}></page-list>

  <script>

    this.current = opts.current;

    freezer.on('update', () => {
    this.update(freezer.get());
  });

  </script>
</runebook>