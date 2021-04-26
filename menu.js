const { Menu, shell } = require('electron');

// Create the main app menu
module.exports = appWin => {
    let template = [
        {
            label: 'items',
            submenu:[
                {
                    label: 'Add new item',
                    accelerator: 'CmdOrCtrl+o',
                    click: () => {
                        // we do not need to import the mainwindow module (we do not have access)
                        // we do not need to use ipcRenderer, electron manage it internally
                        // so we pass the mainwindo.webcontents in the appMenu in main.js
                        appWin.send('menu-show-modal')
                    }
                },
                {
                    label: 'Read item',
                    accelerator: 'CmdOrCtrl+Enter',
                    click: () => {
                        appWin.send('menu-open-item')
                    }
                },
                {
                    label: 'Delete item',
                    accelerator: 'CmdOrCtrl+Backspace',
                    click: () => {
                        appWin.send('menu-delete-item')
                    }
                },
                {
                    label: 'Open in browser',
                    accelerator: 'CmdOrCtrl+Shift+Enter',
                    click: () => {
                        appWin.send('menu-open-item-native')
                    }
                },
                {
                    label: 'Search items',
                    accelerator: 'CmdOrCtrl+s',
                    click: () => {
                        appWin.send('menu-focus-search')
                    }
                }
            ]
        },
        {
            role: 'editMenu'
        },
        {
            role: 'windowMenu'
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'learn more',
                    click: () => {
                        shell.openExternal('https://github.com/AlaaAD86/electronApp-StarkoApp')
                    }
                }
            ]
        }
    ]

    // Check plateform
    if (process.platform === 'darwin') template.unshift({
        role: 'appMenu'
    })
    // Build the menu
    let menu = Menu.buildFromTemplate(template)

    Menu.setApplicationMenu(menu);
}