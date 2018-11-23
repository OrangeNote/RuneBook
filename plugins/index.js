var isDev = require('electron-is-dev');

if (!isDev) {
  var plugins = ["local", "runeforge", "championgg", "koreanbuilds", "runeslol", "opgg", "ugg"];

  var __hasProp = {}.hasOwnProperty;

  for(var i = 0; i < plugins.length; i++) {
    var name = plugins[i];
    var include = require(`./${name}.js`);
    for(func in include) {
      if(!__hasProp.call(include, func) || !include[func].active) continue;
      module.exports[name] = include[func];
    }
  }

}
else {
  console.log("isDev: dynamic plugins loader")
  var collectExports, fs, path,
  fs = require('fs');
  path = require('path');

  var __hasProp = {}.hasOwnProperty;

  collectExports = function(file) {
    var func, include, _results, name;

    if (path.extname(file) === '.js' && file !== 'index.js' && file !== 'utils.js') {
      include = require('./' + file);
      name = path.basename(file, '.js');
      _results = [];
      for (func in include) {
        if (!__hasProp.call(include, func) || !include[func].active) continue;
        _results.push(exports[name] = include[func]);
      }
      return _results;
    }
  };

  fs.readdirSync('./plugins').forEach(collectExports);
}