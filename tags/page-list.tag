<page-list>
  <h2 if={ opts.current.champion && _.isEmpty(opts.current.champ_data.pages.toJS()) } class="ui center aligned icon header">
    <virtual if={ opts.plugins.local[opts.tab.active] }>
      <i class="sticky note outline icon"></i>
      <div class="content">
        <i1-8n>pagelist.emptylocalpage</i1-8n>
        <div class="sub header"><i1-8n>pagelist.emptylocalpage.subheader</i1-8n></div>
      </div>
    </virtual>
    <virtual if={ !opts.plugins.local[opts.tab.active] }>
      <i class="frown outline icon"></i>
      <div class="content">
        <i1-8n>pagelist.emptyremotepage</i1-8n>
        <div class="sub header">
          <i1-8n>pagelist.emptyremotepage.subheader</i1-8n><br>
        </div>
      </div>
    </virtual>
  </h2>

  <div if={ opts.current.champion } class="ui middle aligned relaxed divided list" style="height: 100%; overflow-y: auto;">
    <div class="item" each={ page, key in opts.current.champ_data.pages }>
      <div class="right floated content" data-key={ key }>
        
        <div class={ opts.connection.page && opts.connection.page.isEditable && opts.connection.summonerLevel >= 15 ? "ui icon button" : "ui icon button disabled" } data-key={key} onclick={ uploadPage } data-tooltip={ i18n.localise('pagelist.uploadpage') } data-position="left center" data-inverted="">
          <i class={ opts.lastuploadedpage.page == key && opts.lastuploadedpage.champion == opts.current.champion ? (opts.lastuploadedpage.loading ? "notched circle loading icon" : (opts.lastuploadedpage.valid === false ? "warning sign icon" : "checkmark icon")) : "upload icon" } data-key={key}></i>
        </div>
        
        <!-- <div if={ opts.plugins.local[opts.tab.active] } class="ui icon button" onclick={ setFav } data-key={key}>
          <i class={ key == opts.current.champ_data.fav ? "heart icon" : "heart outline icon" } data-key={key}></i>
        </div> -->
        
        <div if={ opts.plugins.local[opts.tab.active] && page.bookmark } class="ui icon button" data-key={key} data-tooltip={ i18n.localise('pagelist.syncfrom') + page.bookmark.remote.name} data-position="left center" data-inverted="" onclick={ syncBookmark }>
          <i class={ opts.lastsyncedpage.page == key && opts.lastsyncedpage.champion == opts.current.champion ? (opts.lastsyncedpage.loading ? "sync alternate icon loading" : "checkmark icon") : "sync alternate icon" } data-key={key}></i>
        </div>

        <div if={ opts.plugins.local[opts.tab.active] } class="ui icon button {red: !page.bookmark}" data-key={key} data-tooltip={page.bookmark ? i18n.localise('pagelist.unlink') : ""} data-position="left center" data-inverted="" onclick={ page.bookmark ? unlinkBookmark : deletePage }>
          <i class={page.bookmark ? "unlink icon" : "trash icon"} data-key={key}></i>
        </div>

        <div if={ opts.plugins.remote[opts.tab.active] } class="ui icon button" data-key={key} onclick={ bookmarkPage } data-tooltip={ i18n.localise('pagelist.bookmarkpage') } data-position="left center" data-inverted="">
          <i class={opts.lastbookmarkedpage.page == key && opts.lastbookmarkedpage.champion == opts.current.champion ? "checkmark icon" : "bookmark icon"} data-key={key}></i>
        </div>
      </div>
      <div class="ui image">
        <div each={ index in [0,1,2,3,4,5] } class="ui circular icon button tooltip page-list-tooltip" style="margin: 0; padding: 0; background-color: transparent; cursor: default;"
        data-html={findTooltip(page, index)}>
          <img draggable="false" class="ui mini circular image" src=./img/runesReforged/perk/{page.selectedPerkIds[index] || "qm"}.png>
        </div>
      </div>
      <div class="middle aligned content"><i class={ page.isValid === false ? "red warning sign icon" : "" }></i> {key}</div>
    </div>
  </div>

  <script>

		this.on('updated', function() {
      if (process.platform != 'darwin') $('.page-list-tooltip').popup()
		});

    findTooltip(page, index) {
      if(!opts.tooltips.rune) return;
      var tooltip = opts.tooltips.rune.find((el) => el.id === page.selectedPerkIds[index]);
      return '<b>' + tooltip.name + '</b><br>' + tooltip.longDesc;
    }

    var shell = require('electron').shell;
    //open links externally by default
    $(document).on('click', 'a[href^="http"]', function(event) {
        event.preventDefault();
        shell.openExternal(this.href);
    });

    setFav(evt) {
      evt.preventUpdate = true;
      
      var page = $(evt.target).attr("data-key");
      freezer.emit("page:fav", opts.current.champion, page);
    }

    deletePage(evt) {
      evt.preventUpdate = true;

      var page = $(evt.target).attr("data-key");
      console.log(page)
      freezer.emit("page:delete", opts.current.champion, page);
    }

    unlinkBookmark(evt) {
      evt.preventUpdate = true;

      var page = $(evt.target).attr("data-key");
      freezer.emit("page:unlinkbookmark", opts.current.champion, page);
    }

    syncBookmark(evt) {
      evt.preventUpdate = true;

      var page = $(evt.target).attr("data-key");
      freezer.emit("page:syncbookmark", opts.current.champion, page);
    }

    bookmarkPage(evt) {
      evt.preventUpdate = true;

      var page = $(evt.target).attr("data-key");
      freezer.emit("page:bookmark", opts.current.champion, page);
    }

    uploadPage(evt) {
      evt.preventUpdate = true;

      var page = $(evt.target).attr("data-key");
      console.log("DEV page key", page);
      freezer.emit("page:upload", opts.current.champion, page);
    }

  </script>

</page-list>