<select-champion>
  <div class="ui container center aligned">
    <div class="ui grid">
      <div class="row">
        <div class="six wide column">
          <img class="ui image circular middle aligned" width="100px" height="100px" style="display: inline;"
            src={opts.champion.id ? "https://ddragon.leagueoflegends.com/cdn/8.2.1/img/champion/" + opts.champion.id + ".png" : "./img/unknown.png"}>
        </div>
        <div class="six wide column middle aligned">
          <div class="ui search selection dropdown" onchange={chooseChampion}>
            <input type="hidden" name="champion" class="myselect">
            <i class="dropdown icon"></i>
            <div class="default text">Choose a champion...</div>
            <div class="menu">
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>

    this.on('mount', () => {
      
      $('.ui.dropdown').dropdown({
        filterRemoteData: true,
        saveRemoteData: false,
        forceSelection: false,
        fullTextSearch: true,
        apiSettings: {
          url: 'https://ddragon.leagueoflegends.com/cdn/8.2.1/data/en_US/champion.json',
          onResponse: function(ddres) {
            var res = {
              results: {}
            };
            
            if(!ddres || ddres.type != "champion") return res;
            res.success = true;

            $.each(ddres.data, function(index, item) {
              res.results[item.id] = { value: item.id, name: item.name };
            });

            return res;
          },
          successTest: function(res) {
            return res.success || false;
          },
        }
      });
    });

    chooseChampion(evt) {
      evt.preventUpdate = true;
      var data = $('.ui.dropdown').dropdown('get value');
      if(data) freezer.emit('champion:choose', data);
    }

  </script>

</select-champion>