<update-button>

  <div if={ !opts.updateready }>
    <i class="link cog small icon" style="position: absolute; top: 37%; right: 11%; -webkit-app-region: no-drag;" onclick="$('.settings-modal').modal('show')"></i>
  </div>

  <div if={ opts.updateready } style="position: absolute; top: 25%; right: 11%; -webkit-app-region: no-drag;">
    <div class="ui teal label" style="cursor: pointer;" onclick="$('.ui.modal').modal('show')">
      <i class="link cog icon"></i>
      <div class="detail">Update available!</div>
    </div>
  </div>

  <script>
  
  doUpdate(evt) {
    evt.preventUpdate = true;

    freezer.emit('update:do');
  }

  </script>
</update-button>