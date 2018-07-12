const path = require('path');
const glob = require('glob');
let dictionary = {}
glob.sync(__dirname + '/locales/*.json').forEach(function(filepath) {
  let lang = path.basename(filepath, '.json');
  dictionary[lang] = require(filepath);
});
module.exports = dictionary;