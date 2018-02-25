<update-button>
    <a if={ opts.updateready } class="ui button basic mini compact positive" style="-webkit-app-region: no-drag; position: absolute; left: 100px; top: 13px;" onclick={ doUpdate }>
      NEW VERSION! CLICK HERE TO UPDATE
    </a>

  <script>
    
    doUpdate(evt) {
      evt.preventUpdate = true;

      freezer.emit('update:do');
    }

  </script>
</update-button>