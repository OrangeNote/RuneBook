<changelog-modal>
  
  <div class="ui small modal changelog-modal">
    <i class="close icon"></i>
    <div class="header">
      <i1-8n>whatsnew.title</i1-8n> { require('electron-is-dev') === true ? "DEV" : require('electron').remote.app.getVersion(); }
    </div>
    <div class="scrolling content">
      <img class="ui fluid rounded image" src="./img/backdrop.png">
      <h3>Greetings, Summoner!</h3>
      <p>This community-driven update contains small quality of life improvements. A big thank you <i class="icon blue heart"></i> to contributors on <a href="https://github.com/OrangeNote/RuneBook/network">GitHub</a> and to the community on <a href="https://discord.gg/hN4kP7n">Discord</a> for its suggestions!</p>
      <p>Here is a list of notable changes:</p>
      <h4 class="ui header">Localization
        <div class="sub header">Thanks to everyone who taught RuneBook how to speak:</div></h4>
      <ul>
        <li><i class="de flag"></i>Deutsch</li>
        <li><i class="gb flag"></i>English</li>
        <li><i class="es flag"></i>Español</li>
        <li><i class="fr flag"></i>Français</li>
        <li><i class="it flag"></i>Italiano</li>
        <li><i class="hu flag"></i>Magyar</li>
        <li><i class="pt flag"></i>Português</li>
        <li><i class="ru flag"></i>Русский</li>
        <li><i class="tr flag"></i>Türkçe</li>
      </ul>
      ... and more to come, because you can still submit new languages! Join us on <a href="https://discord.gg/hN4kP7n">Discord</a> and we'll help you adding your favourite language to RuneBook.
      <h4>Splash screen</h4>
      <p>When launching RuneBook, a fancy splash screen with the RuneBook logo appears. No more blank windows!</p>
      <h4>Remember me</h4>
      <p>Now RuneBook remembers your preference regarding auto select and your last active tab.
      Also tabs don't reset to "Local pages" when auto select triggers an update.</p>
      <br><hr><br>
      <p>That's all! RuneBook is pretty much complete for what it has to offer, but it will always accept small contributions like these and it will still be updated to support the latest game patch.</p>
      <h4 class="ui header right floated">OrangeNote, 2018-06-12</h4>
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