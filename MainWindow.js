const { BrowserWindow, app } = require('electron')
class MainWindow extends BrowserWindow {
    constructor(file, isDev) {
        super({
            title: 'SysTop',
            width: 500,//isDev ? 800 : 500,
            height: 600,
            icon: `${__dirname}/assets/icons/icon.png`,
            resizable: isDev ? true : false,
            backgroundColor: 'white',
            webPreferences: {
                nodeIntegration: true,
            },
            show: false,
            opacity: 0.9 // make window transparent
        })
        // load html
        this.loadFile(file)
        // show dev tools
        if (isDev) {
            //mainWindow.webContents.openDevTools()
        }
        // disable close
        this.on('close', this.onClose.bind(this))

    }
    onClose(e) { // disable close
        if (!app.isQuitting) {
            e.preventDefault()
            this.hide()
        }
        return true
    }
}
module.exports = MainWindow