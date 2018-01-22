window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Popper = require('popper.js')
window.Bootstrap = require('bootstrap')
require('chosen-js')

const {shell} = require('electron');

const renderer = require('electron').ipcRenderer;
const app = require('./app');

renderer.on('readyinit', function() {
  app.init();
});