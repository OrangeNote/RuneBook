const electron = require('electron')
const el_app = electron.app;

// Adds debug features like hotkeys for triggering dev tools and reload
require('electron-debug')();

// Prevent window being garbage collected
let mainWindow;

function onClosed() {
	// Dereference the window
	// For multiple windows store them in an array
	mainWindow = null;
}

function createMainWindow() {
	const win = new electron.BrowserWindow({
		width: 450,
		height: 670,
		frame: false,
		titleBarStyle: "hiddenInset",
	});

	win.loadURL(`file://${__dirname}/loading.html`);
	win.on('closed', onClosed);

	return win;
}

el_app.on('window-all-closed', () => {
	//if (process.platform !== 'darwin') {
		el_app.quit();
	//}
});

el_app.on('activate', () => {
	if (!mainWindow) {
		mainWindow = createMainWindow();
	}
});

el_app.on('ready', () => {
	mainWindow = createMainWindow();
	mainWindow.webContents.on('did-finish-load', () => {
		mainWindow.webContents.send('ready');
	});
});