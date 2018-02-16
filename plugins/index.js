var collectExports, fs, path,
  __hasProp = {}.hasOwnProperty;

fs = require('fs');    
path = require('path');

collectExports = function(file) {
  var func, include, _results, name;

  if (path.extname(file) === '.js' && file !== 'index.js') {
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