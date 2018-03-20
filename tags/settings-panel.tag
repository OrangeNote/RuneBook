<settings-panel>
  <div class="ui modal settings-modal">
    <div class="content">
      <div class="ui bottom attached label">
        RuneBook <a style="text-decoration: underline;" onclick="$('.changelog-modal').modal('show')">{ require('electron-is-dev') === true ? "DEV" : require('electron').remote.app.getVersion(); }</a>
        <span style="float: right;"><a href="https://github.com/OrangeNote/RuneBook/issues" style="color: #555555;"><i class="bug icon"></i></a></span>
      </div>
      <div class="ui form">
        <div class="grouped fields">
          
          <h4 class="ui horizontal divider header">
            <i class="cog icon"></i>Settings
          </h4>
          <div class="field">
            <label>Legue Client installation path:</label>
            <input type="file" id="choosepath" name="choosepath" disabled={ opts.configfile.pathdiscovery } style="display: none;" onchange={ handleChoosePath } >
            <div class={ opts.configfile.pathdiscovery ? "ui action input disabled" : "ui action input" } onclick="$('#choosepath').click();">
              <input type="text" id="displayleaguepath" value={ opts.configfile.pathdiscovery ? "Automatic detection is active. Please disable it if you want to manually set a custom path." : opts.configfile.leaguepath } readonly>
              <button class={ opts.configfile.pathdiscovery ? "ui icon button disabled" : "ui icon button" }>
                <i class="open folder icon"></i>
              </button>
            </div>
            <div class="ui orange basic top pointing label hidden" id="changeleaguelabel">Restart RuneBook to apply this change</div>
          </div>
          <div class="ui toggle checkbox">
            <input type="checkbox" name="leaguepath" onchange={ togglePathDiscovery } ref="pathdiscovery">
            <label>Automatically detect installation path (recommended)</label>
          </div>
          
          <h4 class="ui horizontal divider header">
            <i class="teal arrow alternate circle down outline icon"></i>Updates
          </h4>
          <div class="field">
            <span if={ opts.updateready }>New version available!</span>
            <button if={ opts.updateready } class="ui teal button update-button" onclick={ doUpdate }>Download update</div>
            <span if={ !opts.updateready }>RuneBook is up to date.</span>
          </div>
          
          <h4 class="ui horizontal divider header">
            <i class="red fire icon"></i>Advanced
          </h4>
          <div class="inline field">
            <label>Local rune pages file: </label>
            <input type="file" id="choosefile" name="choosefile" style="display: none;" onchange={ handleChooseFile }>
            <div class="ui action input" onclick="$('#choosefile').click();" data-tooltip={ opts.configfile.cwd } data-position="bottom center" data-inverted="">
              <input type="text" id="displaypath" placeholder="Choose .json file..." value={ opts.configfile.name } readonly>
              <button class="ui icon button">
                <i class="open folder icon"></i>
              </button>
            </div>
            <div class="ui orange basic left pointing label hidden" id="changelabel">Restart RuneBook to apply this change</div>
          </div>

        </div>
      </div>
    </div>
  </div>

  <script>
    this.on('mount', () => {
      $('.settings-modal').modal({
        duration: 200,
        autofocus: false,
        inverted: true,
      });

      this.refs.pathdiscovery.checked = opts.configfile.pathdiscovery;
    });

    freezer.on("update:downloaded", () => {
      $(".update-button").removeClass("loading");
    });

    handleChooseFile(evt) {
      evt.preventUpdate = true;

      if(evt.target.files && evt.target.files.length && evt.target.files[0].name.endsWith(".json")) {
        $("#displaypath").val(evt.target.files[0].name);
        $("#changelabel").removeClass("hidden");
        freezer.emit("configfile:change", evt.target.files[0].path);
      }
    }

    handleChoosePath(evt) {
      evt.preventUpdate = true;
      if(evt.target.files && evt.target.files.length) {
        $("#displayleaguepath").val(evt.target.files[0].name);
        $("#changeleaguelabel").removeClass("hidden");
        freezer.emit("leaguepath:change", evt.target.files[0].path);
      }

    }

    togglePathDiscovery(evt) {
      preventUpdate = true;
      $("#changeleaguelabel").removeClass("hidden");
      freezer.emit("pathdiscovery:switch", this.refs.pathdiscovery.checked);
    }

    doUpdate(evt) {
    evt.preventUpdate = true;

    $(".update-button").addClass("loading")
    $(".update-button").addClass("disabled")

    freezer.emit('update:do');
  }

  </script>

</settings-panel>