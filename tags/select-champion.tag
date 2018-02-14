<select-champion>
  <div class="ui container">
    <div class="ui basic segment">
      
      <div class="ui equal width grid">
        <div class="row">
          
          <div class="column">
            <img draggable="false" class="ui tiny image circular"
              src={opts.champion ? `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${this.opts.champion}.png` : "./img/unknown.png"}>
            <img draggable="false" class="ui tiny-ring image circular" style="position: absolute; top: -2px; left: 12px;" src="./img/ring.png">
            <!-- <img draggable="false" class="ui tiny-spin image circular" style="position: absolute; top: -10px; left: 4px;" src="./img/ring_spinner.png"> -->
          </div>
          
          <div class="column middle aligned">
            
            <!-- <div class="ui search selection disabled dropdown" onchange={chooseChampion}>
              <input type="hidden" name="champion" class="myselect">
              <i class="dropdown icon"></i>
              <div class="default text">Champion name...</div>
            </div> -->

            <div class="ui search fluid">
              <div class="ui icon input">
                <input class="prompt" type="text" placeholder="Champion name..." onClick="this.select();">
                <i class="search icon"></i>
              </div>
              <div class="results"></div>
            </div>

          </div>

          <div class="column middle aligned right aligned">
            <div class="ui checkbox disabled" data-tooltip="Work in progress!" data-position="bottom right" data-inverted="">
              <input type="checkbox" tabindex="0" class="hidden">
              <label>Auto select <i class="help circle icon"></i></label>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
  
  <style>
    .tiny-ring {
      width: 84px;
      height: 84px;
    }

    .tiny-spin {
      width: 100px;
      height: 100px;
      animation: spin 1.5s linear infinite;
  }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } }
  </style>

  <script>

    freezer.on("version:set", (version) => {
      this.version = version;

      $('.ui.checkbox')
        .checkbox()
      ;

      var request = require(`request`);
      request.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`, (error, response, ddres) => {
        if (error || response.statusCode != 200) return;
        
        ddres = handleDDRes2(JSON.parse(ddres));

        $('.ui.search').search({
          source: ddres,
          duration: 0,
          searchDelay: 0,
          showNoResults: false,
          maxResults: 14,
          searchFullText: true,
          selectFirstResult: true,
          searchFields: ['title', 'info'],
          regExp: {
            escape     : /[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g,
            beginsWith : '(?:\\s|^)'
          },

          onSelect: (data) => {
            if(data) freezer.emit('champion:choose', data.id);
          },
        });
      });

      $('.ui.dropdown').dropdown({

        filterRemoteData: true,
        saveRemoteData: false,
        forceSelection: false,
        fullTextSearch: false,
        showOnFocus: false,
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

    function handleDDRes2(ddres) {
      var res = [];
      if(!ddres || ddres.type != "champion") return res;

      $.each(ddres.data, function(index, item) {
        res.push({ id: item.id, title: item.name });
        if(item.name == "Blitzcrank") res[res.length - 1].info = "22";
        if(item.name == "Warwick") res[res.length - 1].info = "urf";
      });

      return res;
    }

  </script>

</select-champion>