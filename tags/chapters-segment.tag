<chapters-segment>
  <div class="ui container">
    
    <div class="ui horizontal divider">Chapters</div>

    <div class="ui top attached pointing small borderless menu">
      <virtual each={ val, key in opts.plugins.local }>
        <a class={ opts.tab.active == key ? "item active" : "item" } data-tab={key} onclick={ switchTab }>
          {val.name}
        </a>
      </virtual>
      <virtual each={ val, key in opts.plugins.remote }>
        <a class={ opts.tab.active == key ? "item active" : "item" } data-tab={key} onclick={ switchTab }>
          {val.name}
        </a>
      </virtual>

    </div>

    <div class={ opts.tab.loaded ? "ui bottom attached tab segment active" : "ui bottom attached tab segment active loading" }>
      <div class={ opts.current.champion && !_.isEmpty(opts.current.champ_data.pages.toJS()) ? "ui one column centered grid" : "ui one column middle aligned centered grid" } style="height: 384px">
        <div class="row">
          <div class="column" style={ opts.current.champion && !_.isEmpty(opts.current.champ_data.pages.toJS()) ? "height: 100%;" : "" }>
            
            <h1 if={ !opts.current.champion } class="ui center aligned icon header">
              <i class="open book icon"></i>
              <div class="content">
                Welcome to RuneBook!
                <div class="sub header">Select a champion to start managing your rune pages.</div>
              </div>
            </h1>

            <page-list current={opts.current} lastuploadedpage={opts.lastuploadedpage} connection={opts.connection} tab={opts.tab} plugins={opts.plugins} lastbookmarkedpage={opts.lastbookmarkedpage}></page-list>
          </div>
        </div>
      </div>

    </div>
    
  </div>

  <script>

    switchTab(evt) {
      evt.preventUpdate = true;

      var tab = $(evt.target).attr("data-tab");
      freezer.emit("tab:switch", tab);
    }
  
  </script>

</chapters-segment>