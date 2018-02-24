<runebook>
  <header style="-webkit-app-region: drag;">
    <div class="ui secondary pointing menu">
      <div class="ui menu header item">
          RuneBook (v{window.require('electron').remote.app.getVersion()})
      </div>
    </div>
  </header>

  <main>
    <select-champion champion={current.champion}></select-champion>
    <chapters-segment current={current} lastuploadedpage={lastuploadedpage} session={session} connection={connection} tab={tab} plugins={plugins} lastbookmarkedpage={lastbookmarkedpage} lastsyncedpage={lastsyncedpage}></chapters-segment>
  </main>
  
  <footer>
    <div style="margin-bottom: 20px">
      <current-page connection={connection} session={session} current={current} tab={tab} plugins={plugins}></current-page>
    </div>
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
    this.tab = opts.tab;
    this.plugins = opts.plugins;
    this.lastbookmarkedpage = opts.lastbookmarkedpage;
    this.lastsyncedpage = opts.lastsyncedpage;

    freezer.on('update', () => {
    this.update(freezer.get());
  });

  </script>
</runebook>