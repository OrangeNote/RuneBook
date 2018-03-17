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
          <!-- <div class="field">
            <div class="ui toggle checkbox">
              <input type="checkbox" name="public">
              <label>Checkbox label</label>
            </div>
          </div> -->
          <div class="field">
            <div class="centered">There are no available options yet.</div>
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
    });

    handleChooseFile(evt) {
      evt.preventUpdate = true;

      if(evt.target.files && evt.target.files.length && evt.target.files[0].name.endsWith(".json")) {
        $("#displaypath").val(evt.target.files[0].name);
        $("#changelabel").removeClass("hidden");
        freezer.emit("configfile:change", evt.target.files[0].path);
      }
    }

  </script>

</settings-panel>