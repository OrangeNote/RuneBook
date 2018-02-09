<page-list>
  <div class="ui container">
    <div if={ !_.isEmpty(opts.current.champ_data.pages.toJS()) } class="ui horizontal divider">Local pages</div>
    <div class="ui middle aligned relaxed divided list">
      <div class="item" each={ page, key in opts.current.champ_data.pages }>
        <div class="right floated content" data-key={ key }>
          
          <div class={ opts.connection.page ? "ui icon button" : "ui icon button disabled" } data-key={key} onclick={ uploadPage }>
            <i class={ opts.lastuploadedpage.page == key ? (opts.lastuploadedpage.valid === false ? "warning sign icon" : "checkmark icon") : "upload icon" } data-key={key}></i>
          </div>
          
          <div class="ui icon button" onclick={ setFav } data-key={key}>
            <i class={ key == opts.current.champ_data.fav ? "heart icon" : "empty heart icon" } data-key={key}></i>
          </div>
          
          <div class="ui icon button" data-key={key} onclick={ deletePage }>
            <i class="remove icon" data-key={key}></i>
          </div>
        
        </div>
        <img each={ rune, index in page.selectedPerkIds } class="ui mini circular image" src=./resources/runesReforged/perk/{rune || "qm"}.png>
        <div class="content">
          <i class={ page.isValid ? "" : "warning sign icon" }></i> {key}
          
        </div>
      </div>
    </div>
  </div>

  <script>
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