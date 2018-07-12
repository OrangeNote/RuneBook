<select-champion>
  <div class="ui container">
    <div class="ui basic segment">
      
      <div class="ui equal width grid">
        <div class="row">
          
          <div class="column">
            <img draggable="false" class="ui tiny image circular"
              src={opts.champion ? `https://ddragon.leagueoflegends.com/cdn/${this.version}/img/champion/${this.opts.champion}.png` : "./img/unknown.png"}>
            <img draggable="false" class="ui tiny-ring image circular" style="position: absolute; top: -2px; left: 12px;" src={opts.autochamp ? "./img/ring_active.png" : "./img/ring.png"}>
            <img if={ opts.autochamp && opts.champselect } draggable="false" class="ui tiny-spin image circular" style="position: absolute; top: -10px; left: 4px;" src="./img/ring_spinner.png">
          </div>
          
          <div class="column middle aligned">
            
            <!-- <div class="ui search selection disabled dropdown" onchange={chooseChampion}>
              <input type="hidden" name="champion" class="myselect">
              <i class="dropdown icon"></i>
              <div class="default text">Champion name...</div>
            </div> -->

            <div class="ui search loading disabled fluid champion">
              <div class="ui icon input">
                <input disabled class="prompt" type="text" placeholder="{ i18n.localise('champion.name') }..." onClick="this.select();">
                <i class="search icon"></i>
              </div>
              <div class="results"></div>
            </div>

          </div>

          <div class="column middle aligned">
            <div class="ui toggle checkbox" id="autochamp">
              <input type="checkbox" tabindex="0" class="hidden">
              <label id="autochamp-label"><i1-8n>champion.autopick</i1-8n> <i class="question circle icon"></i></label>
            </div>
          </div>

        </div>
      </div>

    </div>
  </div>
  
  <div class="ui popup" style="width: 250px;"><i1-8n>champion.autopick.tooltip</i1-8n></div>

  <style>
    .tiny-ring {
      width: 84px;
      height: 84px;
    }

    .tiny-spin {
      width: 100px;
      height: 100px;
      animation: spin 1.6s linear infinite;
  }
  @keyframes spin { 100% { -webkit-transform: rotate(360deg); transform: rotate(360deg); } }
  </style>

  <script>

    freezer.on("champion:choose", (champion) => {
      $('.ui.search.champion').search("set value", champion);
    })

    freezer.on("lang:update", (champion) => {
      $('.ui.search.champion input').attr('placeholder', i18n.localise('champion.name') + '...');
    })

    freezer.on("championsinfo:set", () => {
      $("#autochamp-label").popup({
        position: "bottom right",
        popup: '.ui.popup',
        delay: {
          show: 800,
          hide: 0
        }
      });

      $('#autochamp')
        .checkbox({
          onChecked: () => {
            freezer.emit("autochamp:enable");
          },
          onUnchecked: () => {
            freezer.emit("autochamp:disable");
          }
        })
      ;

      if(freezer.get().autochamp) {
        $('#autochamp').checkbox("check");
      }

      // Force event again, in case api connection is slower than ddragon requests
      freezer.on("api:connected", () => {
        if(freezer.get().autochamp) {
          freezer.emit("autochamp:enable");
        }
      })
    })

    freezer.on("version:set", (version) => {
      this.version = version;

      var request = require(`request`);
      request.get(`https://ddragon.leagueoflegends.com/cdn/${version}/data/en_US/champion.json`, (error, response, ddres) => {
        if (error || response.statusCode != 200) return;
        
        ddres = handleDDRes2(JSON.parse(ddres));

        var search_el = $('.ui.search.champion');
        search_el.removeClass("loading");
        $('input', search_el).prop("disabled", false);

        search_el.search({
          source: ddres,
          duration: 0,
          searchDelay: 0,
          showNoResults: false,
          maxResults: 10,
          fullTextSearch: true,
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

      $('.ui.search.champion').removeClass("disabled");
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