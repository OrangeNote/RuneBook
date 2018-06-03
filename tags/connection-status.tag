<connection-status>
  <div class="ui label basic">{ connectionStatusText() } ...</div>

  <script>
    
    connectionStatusText() {
      if(opts.session.connected) return "Connected";
      if(opts.session.state == "IN_PROGRESS") return i18n.localise('connectionstatus.inprogress');
      if(opts.session.state == "LOGGING_OUT") return i18n.localise('connectionstatus.loggingout');
      return "Disconnected";
    }

  </script>
</connection-status>