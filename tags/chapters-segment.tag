<chapters-segment>
  <div class="ui container">
    
    <div class="ui horizontal divider">Chapters</div>

    <div class="ui top attached pointing small borderless menu">
      <a class="item active" data-tab="tab-local">
        Local pages
      </a>
      <div class="vertical divider"></div>
      <a class="item" data-tab="tab-runeforge">
        Work in progress
      </a>
      <a class="item floated right" data-tab="tab-generic">
        Generic pages
      </a>

    </div>

    <div class="ui bottom attached tab segment" data-tab="tab-generic">
      Generic pages
    </div>

    <div class="ui bottom attached tab segment active" data-tab="tab-local">
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

            <page-list current={opts.current} lastuploadedpage={opts.lastuploadedpage} connection={opts.connection}></page-list>
          </div>
        </div>
      </div>

    </div>

    <div class="ui bottom attached tab segment" data-tab="tab-runeforge">
      Work in progress!
    </div>
    
  </div>

  <script>

    this.on("mount", () => {
      $('.pointing.menu .item').tab();
    });
  
  </script>

</chapters-segment>