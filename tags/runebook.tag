<runebook>
  <div class="ui secondary pointing menu">
    <div class="ui menu header item">
        RuneBook
    </div>
  </div>

  <select-champion champion={current.champion}></select-champion>

  <page-list current={current} lastuploadedpage={lastuploadedpage} session={session} connection={connection}></page-list>
  <connection-status connection={connection} session={session}></connection-status>

  <script>

    this.current = opts.current;
    this.lastuploadedpage = opts.lastuploadedpage;
    this.connection = opts.connection;
    this.session = opts.session;

    freezer.on('update', () => {
    this.update(freezer.get());
  });

  </script>
</runebook>