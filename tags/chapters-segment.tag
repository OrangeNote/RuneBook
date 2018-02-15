<chapters-segment>
  <div class="ui container">
    
    <div class="ui horizontal divider">Chapters</div>

    <div class="ui top attached pointing small borderless menu">
      <a class={ opts.tab.active == "local" ? "item active" : "item" } data-tab="local" onclick={ switchTab }>
        Local pages
      </a>
      <div class="vertical divider"></div>
      <a class={ opts.tab.active == "runeforge" ? "item active" : "item" } data-tab="runeforge" onclick={ switchTab }>
        Rune Forge
      </a>
<!--       <a class="item floated right" data-tab="tab-generic">
        Generic pages
      </a> -->

    </div>

<!--     <div class="ui bottom attached tab segment" data-tab="tab-generic">
      Generic pages
    </div> -->

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

            <page-list current={opts.current} lastuploadedpage={opts.lastuploadedpage} connection={opts.connection} tab={opts.tab}></page-list>
          </div>
        </div>
      </div>

    </div>
    
  </div>

  <script>

    switchTab(evt) {
      evt.preventUpdate = true;

      var tab = $(evt.target).data("tab");
      freezer.emit("tab:switch", tab);
    }
  
  </script>

</chapters-segment>