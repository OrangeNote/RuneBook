window.$ = window.jQuery = require('jquery')
window.Tether = require('tether')
window.Popper = require('popper.js')
window.Bootstrap = require('bootstrap')
require('chosen-js')

const { shell } = require('electron');

const renderer = require('electron').ipcRenderer;
const app = require('./app');

window.logger = require('./logger')

renderer.on('ready', function() {
	app.start()
});