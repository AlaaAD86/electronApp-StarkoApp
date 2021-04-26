// Creating a module for readItem
const {BrowserWindow} = require('electron');

let offscreenWindow;

module.exports = (url, callback) => {
    //Create offscreen window
    offscreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    });

    //load item url
    offscreenWindow.loadURL(url);

    //Wait for webcontent to finish loading
    offscreenWindow.webContents.on('did-finish-load', e => {
        // Get page title
        let title = offscreenWindow.getTitle();

        // Get screenshot thumbnail
        offscreenWindow.webContents.capturePage().then( image => {
            // Get image as a dataURL
            let screenshot = image.toDataURL();

            // execute callback with new object item
            callback({
                title,
                screenshot,
                url
            });

            // Cleaning up 
            offscreenWindow.close();
            offscreenWindow = null;
        })
    })
}