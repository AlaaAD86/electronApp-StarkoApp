// Modules
const {app, BrowserWindow, ipcMain} = require('electron');
const windowStateKeeper = require('electron-window-state');
const readItem = require('./readItem');
const appMenu = require('./menu')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

// Listen to new item request
ipcMain.on('new-item', (event, itemUrl) => {
  // console.log(itemUrl);
  readItem( itemUrl, item => {
    event.sender.send('new-item-success', item)
  })
});


// Create a new BrowserWindow when `app` is ready
function createWindow () {
  // win state keeper : keeps window size as precised when launched
  let state = windowStateKeeper({
    defaultWidth: 1024, defaultHeight: 800
  })
  mainWindow = new BrowserWindow({
    x: state.x,
    y: state.y, 
    width: state.width,
    height: state.height,
    minWidth: 450, maxWidth: 900,
    minHeight: 300,
    webPreferences: { nodeIntegration: true }
  });

  // Create app menu
  appMenu(mainWindow.webContents)

  // Load index.html into the new BrowserWindow
  mainWindow.loadFile('renderer/main.html')

  // managing the new window state
  state.manage(mainWindow);

  // Open DevTools - Remove for PRODUCTION!
  // mainWindow.webContents.openDevTools();

  // Listen for window being closed
  mainWindow.on('closed',  () => {
    mainWindow = null
  })
}

// Electron `app` is ready
app.on('ready', createWindow)

// Quit when all windows are closed - (Not macOS - Darwin)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

// When app icon is clicked and app is running, (macOS) recreate the BrowserWindow
app.on('activate', () => {
  if (mainWindow === null) createWindow()
})
