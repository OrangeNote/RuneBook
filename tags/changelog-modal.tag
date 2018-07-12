<changelog-modal>
  
  <div class="ui small modal changelog-modal">
    <i class="close icon"></i>
    <div class="header">
      <i1-8n>whatsnew.title</i1-8n> { require('electron-is-dev') === true ? "DEV" : require('electron').remote.app.getVersion(); }
    </div>
    <div class="scrolling content">
      <img class="ui fluid rounded image" src="./img/changelog_banner.png">
      <i>Thanks to TheKillerey for the banner</i>
      <h3>Greetings, Summoner!</h3>
      <p>Thanks to everyone who contributed on <a href="https://github.com/OrangeNote/RuneBook/network">GitHub</a> and to the supporting community on <a href="https://discord.gg/hN4kP7n">Discord</a>! You made this update possible, you rock!</p>
      <p>Here it is a list of notable changes:</p>
      <h4 class="ui header">New sources for rune pages
        <div class="sub header">Thanks to Keyzou, passzivsurmo and Jainish</div></h4>
      <ul>
        <li>Korean Builds</li>
        <li>Runes LoL</li>
      </ul>
      <h4>Auto select</h4>
      <p>Added a switch that allows RuneBook to peek at your pick in champion select and to automatically choose the champion for you. No need to type names in the search bar anymore!</p>
      <h4>Tooltips</h4>
      <p>Now you can hover over runes and see their description. League client needs to be open, because I'm pulling data from it. The advantage is that descriptions are in your preferred language.</p>
      <h4>Settings panel</h4>
      <p>RuneBook already has all the basic functionalities, but additional features might be added as options, that's why I made the settings panel.</p>
      <h4 class="ui header">Custom file for Local pages
        <div class="sub header">Only for the braves</div>
      </h4>
      <p>Talking about settings, there is an advanced option for choosing a different path for the config.json file. Use at your own risk because it might delete the content of the file you choose if it is not a valid JSON file. It might be really useful if you want to sync local pages between your computers with Dropbox or Google Drive, for example.</p>
      <h4 class="ui header">Changelog
        <div class="sub header">Hype for release notes is real</div>
      </h4>
      <p>This is the changelog. What did you think you were reading?</p>
      <p>You can read this changelog whenever you want by clicking the app version in the bottom left corner of the settings panel.<p>
      <h4 class="ui header">UI improvements and bug fixes
        <div class="sub header">It wouldn't be a real changelog without the bug fixes statement</div>
      </h4>
      There are a lot of quality-of-life improvements, like:
      <ul>
        <li>Window can now be resized</li>
        <li>Window position and size will be remembered after you close the app</li>
        <li>All buttons now have a brief description</li>
        <li>No more double window header</li>
        <li>Added custom window control buttons</li>
        <li> ...and more</li>
      </ul>
      <p>That's all! And as always: <i>“The runes decide my path.”</i></p>
      <h4 class="ui header right floated">OrangeNote, 2018-03-18</h4>
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