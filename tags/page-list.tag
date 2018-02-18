<page-list>
  <h2 if={ opts.current.champion && _.isEmpty(opts.current.champ_data.pages.toJS()) } class="ui center aligned icon header">
    <i class="sticky note outline icon"></i>
    <div class="content">
      You don't seem to have any pages for this champion.
      <div class="sub header">Click the button below to import from your current page.</div>
    </div>
  </h2>

  <div if={ opts.current.champion } class="ui middle aligned relaxed divided list" style="height: 100%; overflow-y: auto;">
    <div class="item" each={ page, key in opts.current.champ_data.pages }>
      <div class="right floated content" data-key={ key }>
        
        <div class={ opts.connection.page && opts.connection.page.isEditable ? "ui icon button" : "ui icon button disabled" } data-key={key} onclick={ uploadPage }>
          <i class={ opts.lastuploadedpage.page == key && opts.lastuploadedpage.champion == opts.current.champion ? (opts.lastuploadedpage.valid === false ? "warning sign icon" : "checkmark icon") : "upload icon" } data-key={key}></i>
        </div>
        
        <div if={ opts.plugins.local[opts.tab.active] } class="ui icon button" onclick={ setFav } data-key={key}>
          <i class={ key == opts.current.champ_data.fav ? "heart icon" : "empty heart icon" } data-key={key}></i>
        </div>
        
        <div if={ opts.plugins.local[opts.tab.active] } class="ui icon button" data-key={key} onclick={ deletePage }>
          <i class="trash icon" data-key={key}></i>
        </div>
      
      </div>
      <img each={ index in [0,1,2,3,4,5] } draggable="false" class="ui mini circular image" src=./img/runesReforged/perk/{page.selectedPerkIds[index] || "qm"}.png>
      <div class="content">
        <i class={ page.isValid === false ? "red warning sign icon" : "" }></i> {key}
      </div>
    </div>
  </div>

  <script>

    setFav(evt) {
      evt.preventUpdate = true;
      
      var page = $(evt.target).attr("data-key");
      freezer.emit("page:fav", opts.current.champion, page);
    }

    deletePage(evt) {
      evt.preventUpdate = true;

      var page = $(evt.target).attr("data-key");
      freezer.emit("page:delete", opts.current.champion, page);
    }

    uploadPage(evt) {
      evt.preventUpdate = true;

      var page = $(evt.target).attr("data-key");
      console.log("DEV page key", page);
      freezer.emit("page:upload", opts.current.champion, page);
    }

  </script>

</page-list>