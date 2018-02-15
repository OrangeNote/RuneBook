<runebook>
  <header style="-webkit-app-region: drag;">
    <div class="ui secondary pointing menu">
      <div class="ui menu header item">
          RuneBook
      </div>
    </div>
  </header>

  <main>
    <select-champion champion={current.champion}></select-champion>
    <chapters-segment current={current} lastuploadedpage={lastuploadedpage} session={session} connection={connection}></chapters-segment>
  </main>
  
  <footer>
    <div style="margin-bottom: 20px">
      <current-page connection={connection} session={session} current={current}></current-page>
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

    freezer.on('update', () => {
    this.update(freezer.get());
  });

  </script>
</runebook>