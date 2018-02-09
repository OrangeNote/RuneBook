<runebook>
  <header>
    <div class="ui secondary pointing menu">
      <div class="ui menu header item">
          RuneBook
      </div>
    </div>
  </header>

  <main>
    <select-champion champion={current.champion}></select-champion>
    <page-list current={current} lastuploadedpage={lastuploadedpage} session={session} connection={connection}></page-list>
    <current-page connection={connection} session={session}></current-page>
  </main>
  
  <footer>
    <connection-status session={session}></connection-status>
  </footer>

  <style>
    runebook {
      display: flex;
      min-height: 100vh;
      flex-direction: column;
    }

    main {
      flex: 1;
    }
  </style>

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