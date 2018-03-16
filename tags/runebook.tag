<runebook>
  <header style="-webkit-app-region: drag;">
    <div class="ui secondary pointing menu">
      <div class="ui menu header item">
          RuneBook
          <update-button updateready={updateready}></update-button>
          
          <settings-panel configfile={configfile}></settings-panel>
      </div>
    </div>
  </header>

  <main>
    <select-champion champion={current.champion} autochamp={autochamp} champselect={champselect}></select-champion>
    <chapters-segment current={current} lastuploadedpage={lastuploadedpage} session={session} connection={connection} tab={tab} plugins={plugins} lastbookmarkedpage={lastbookmarkedpage} lastsyncedpage={lastsyncedpage} tooltips={tooltips}></chapters-segment>
  </main>
  
  <footer>
    <div style="margin-bottom: 20px">
      <current-page connection={connection} session={session} current={current} tab={tab} plugins={plugins} tooltips={tooltips}></current-page>
    </div>
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
    this.updateready = opts.updateready;
    this.configfile = opts.configfile;
    this.autochamp = opts.autochamp;
    this.champselect = opts.champselect;
    this.tooltips = opts.tooltips;

    freezer.on('update', () => {
      this.update(freezer.get());
  });

  </script>
</runebook>