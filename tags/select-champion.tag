<select-champion>
  <div class="ui container">
    <div class="ui basic segment">
      
      <div class="ui right aligned equal width grid">
        <div class="row">
          
          <div class="column">
            <img class="ui tiny image circular"
              src={opts.champion ? `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${this.opts.champion}.png` : "./img/unknown.png"}>
          </div>
          
          <div class="column middle aligned">
            <div class="ui search selection disabled dropdown" onchange={chooseChampion}>
              <input type="hidden" name="champion" class="myselect">
              <i class="dropdown icon"></i>
              <div class="default text">Choose a champion...</div>
            </div>
          </div>

          <div class="column middle aligned">
            <div class="ui checkbox disabled">
              <input type="checkbox" tabindex="0" class="hidden">
              <label>Auto select</label>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>

  <script>

    freezer.on("version:set", (version) => {
      this.version = version;

      $('.ui.checkbox')
        .checkbox()
      ;

      $('.ui.dropdown').dropdown({

        filterRemoteData: true,
        saveRemoteData: false,
        forceSelection: false,
        fullTextSearch: true,
        apiSettings: {
          url: `https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`,
          onResponse: handleDDRes,
          successTest: (res) => (res.success || false),
        }
      });

      $('.ui.dropdown').removeClass("disabled");
    });

    chooseChampion(evt) {
      evt.preventUpdate = true;
      var data = $('.ui.dropdown').dropdown('get value');
      if(data) freezer.emit('champion:choose', data);
    }

    function handleDDRes(ddres) {
      var res = {
        results: {}
      };
      
      if(!ddres || ddres.type != "champion") return res;
      res.success = true;

      $.each(ddres.data, function(index, item) {
        res.results[item.id] = { value: item.id, name: item.name };
      });

      return res;
    }

  </script>

</select-champion>