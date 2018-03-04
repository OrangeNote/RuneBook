<connection-status>
  <div class="ui label basic">{ connectionStatusText() }</div>

  <script>
    
    connectionStatusText() {
      if(opts.session.connected) return "Connected";
      if(opts.session.state == "IN_PROGRESS") return "Logging in...";
      if(opts.session.state == "LOGGING_OUT") return "Logging out...";
      return "Disconnected";
    }

  </script>
</connection-status>