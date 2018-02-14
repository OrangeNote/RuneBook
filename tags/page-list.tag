<page-list>
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
      <div class={ opts.current.champion && !_.isEmpty(opts.current.champ_data.pages.toJS()) ? "ui one column centered grid" : "ui one column middle aligned centered grid" } style="min-height: 384px">
        <div class="row">
          <div class="column">
            
            <h1 if={ !opts.current.champion } class="ui center aligned icon header">
              <i class="open book icon"></i>
              <div class="content">
                Welcome to RuneBook!
                <div class="sub header">Select a champion to start managing your rune pages.</div>
              </div>
            </h1>

            <h2 if={ opts.current.champion && _.isEmpty(opts.current.champ_data.pages.toJS()) } class="ui center aligned icon header">
              <i class="sticky note outline icon"></i>
              <div class="content">
                You don't seem to have any pages for this champion.
                <div class="sub header">Click the button below to import from your current page.</div>
              </div>
            </h2>

            <div class="ui middle aligned relaxed divided list">
              <div class="item" each={ page, key in opts.current.champ_data.pages }>
                <div class="right floated content" data-key={ key }>
                  
                  <div class={ opts.connection.page && opts.connection.page.isEditable ? "ui icon button" : "ui icon button disabled" } data-key={key} onclick={ uploadPage }>
                    <i class={ opts.lastuploadedpage.page == key && opts.lastuploadedpage.champion == opts.current.champion ? (opts.lastuploadedpage.valid === false ? "warning sign icon" : "checkmark icon") : "upload icon" } data-key={key}></i>
                  </div>
                  
                  <div class="ui icon button" onclick={ setFav } data-key={key}>
                    <i class={ key == opts.current.champ_data.fav ? "heart icon" : "empty heart icon" } data-key={key}></i>
                  </div>
                  
                  <div class="ui icon button" data-key={key} onclick={ deletePage }>
                    <i class="trash icon" data-key={key}></i>
                  </div>
                
                </div>
                <img each={ index in [0,1,2,3,4,5] } draggable="false" class="ui mini circular image" src=./img/runesReforged/perk/{page.selectedPerkIds[index] || "qm"}.png>
                <div class="content">
                  <i class={ page.isValid ? "" : "red warning sign icon" }></i> {key}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <div class="ui bottom attached tab segment" data-tab="tab-runeforge">
      Work in progress!
    </div>
    
  </div>

  <script>

    this.on("update", () => {
      $('.pointing.menu .item').tab();
    });

    setFav(evt) {
      evt.preventUpdate = true;
      
      var page = $(evt.target).data("key");
      freezer.emit("page:fav", opts.current.champion, page);
    }

    deletePage(evt) {
      evt.preventUpdate = true;

      var page = $(evt.target).data("key");
      freezer.emit("page:delete", opts.current.champion, page);
    }

    uploadPage(evt) {
      evt.preventUpdate = true;

      var page = $(evt.target).data("key");
      freezer.emit("page:upload", opts.current.champion, page);
    }
  
  </script>

</page-list>