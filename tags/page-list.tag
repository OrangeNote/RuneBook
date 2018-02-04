<page-list>
  <div class="ui middle aligned divided list">
    <div class="item" each={ page, key in data.pages }>
      <div class="right floated content" data-key={ key }>
        <div class="ui icon button disabled">
          <i class="upload icon"></i>
        </div>
        <div class="ui icon button" onclick={ setFav } data-key={key}>
          <i class={ key == data.fav ? "heart icon" : "empty heart icon" } data-key={key}></i>
        </div>
        <div class="ui icon button" data-key={key} onclick={ deletePage }>
          <i class="remove icon" data-key={key}></i>
        </div>
      </div>
      <div class="middle aligned content">
        {key}
        <img each={ rune, index in page.selectedPerkIds } class="ui image avatar" style={index == 0 ? "width: 52px; height: 52px;" : ""} src=./resources/runesReforged/perk/{rune}.png>
      </div>
    </div>
  </div>

  <script>

    this.data = {pages: {}};

    freezer.on('update', () => {
      this.update({
        data: store.get(`local.${opts.champion}`) || {pages: []} ,
      });
    });

    setFav(evt) {
      evt.preventUpdate = true;
      var key = $(evt.target).data("key");
      console.log(key);

      if(store.get(`local.${opts.champion}.fav`) == key) {
        store.set(`local.${opts.champion}.fav`, null);
      }
      else store.set(`local.${opts.champion}.fav`, key)

      this.update({ data: store.get(`local.${opts.champion}`) });
    }

    deletePage(evt) {
      var key = $(evt.target).data("key");
      store.delete(`local.${opts.champion}.pages.${key}`);

      if(store.get(`local.${opts.champion}.fav`) == key) {
        store.set(`local.${opts.champion}.fav`, null);
      }
      
      this.update({ data: store.get(`local.${opts.champion}`) });
    }
  
  </script>

</page-list>