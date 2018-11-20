<changelog-modal>
  
  <div class="ui small modal changelog-modal">
    <i class="close icon"></i>
    <div class="header">
      <i1-8n>whatsnew.title</i1-8n> { require('electron-is-dev') === true ? "DEV" : require('electron').remote.app.getVersion(); }
    </div>
    <div class="scrolling content">
      <img class="ui fluid rounded image" src="./img/backdrop.png">
      <h3>Greetings, Summoner!</h3>
      <p>Is it meta? Preseason is here with the new changes to Runes!</p>

      <h4 class="ui header">Stat shards
        <div class="sub header">statistics are now independent from the runes you choose</div></h4>
      <p>Support for stat shards has been added. Note: if you have old pages that don't support stat shards, RuneBook will automatically fill the missing slots with a default set of stat shards (Adaptive Force, Armor, Magic Resist) when you upload them to the client. You can customize them in the client afterwards. Also RuneBook will support external sites as soon they will update their pages. Just give me some time to adapt the plugins to the new data. Preseason is here for a reason, the situation will be unstable for a while :)</p>
      <h4>Even more languages</h4>
      <p>The number of languages that RuneBook support is always increasing thanks to <a href="https://discordapp.com/invite/hN4kP7n">our community</a>.</p>
      <h4>Reconnect issues</h4>
      <p>A button has been added to quickly reload RuneBook in case it doesn't recognize the League client. I have also pushed a small fix for some connection issues, but I still need to investigate on that to be sure I'm covering all the cases.</p>
      <br><hr><br>
      <p>That's all! Remember RuneBook is pretty much complete for what it has to offer, but it will always accept small contributions like these and it will still be updated to support the latest game patch.</p>
      <h4 class="ui header right floated">OrangeNote, 2018-11-20</h4>
    </div>
  </div>

  <script>
    
    this.on('mount', () => {
      $('.changelog-modal').modal({
        duration: 200,
        autofocus: false,
      });

      freezer.emit("changelog:ready");
    });

  </script>

</changelog-modal>