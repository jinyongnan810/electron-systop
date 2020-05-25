const path = require('path')
const { app, Menu, ipcMain } = require('electron')
const log = require('electron-log')
const Store = require('./Store')
const MainWindow = require('./MainWindow')
const AppTray = require('./AppTray')


// Set env
process.env.NODE_ENV = 'production'

const isDev = process.env.NODE_ENV !== 'production' ? true : false
const isMac = process.platform === 'darwin' ? true : false

let mainWindow
let tray

// init store & defaults
const store = new Store({
  configName: 'user-settings',
  defaults: {
    settings: {
      cpuOverload: 80,
      notifyInterval: 5
    }
  }
})

function createMainWindow() {
  mainWindow = new MainWindow('./app/index.html', isDev)
}

app.on('ready', () => {
  createMainWindow()



  // send configuration when dom is ready
  mainWindow.webContents.on('dom-ready', () => {
    mainWindow.webContents.send('settings:get', store.get('settings'))
  })

  // tray
  const icon = path.join(__dirname, 'assets', 'icons', 'tray_icon.png')
  tray = new AppTray(icon, mainWindow)

  // menu
  const mainMenu = Menu.buildFromTemplate(menu)
  Menu.setApplicationMenu(mainMenu)

})

// set configuration to file
ipcMain.on('settings:set', (e, settings) => {
  store.set('settings', settings)
  mainWindow.webContents.send('settings:saved')
  mainWindow.webContents.send('settings:get', store.get('settings'))

})


const menu = [
  ...(isMac ? [{ role: 'appMenu' }] : []),
  {
    role: 'fileMenu',
  },
  ...(isDev
    ? [
      {
        label: 'Developer',
        submenu: [
          { role: 'reload' },
          { role: 'forcereload' },
          { type: 'separator' },
          { role: 'toggledevtools' },
        ],
      },
    ]
    : []),
]

app.on('window-all-closed', () => {
  if (!isMac) {
    app.quit()
  }
})

app.on('activate', () => {
  if (MainWindow.getAllWindows().length === 0) {
    createMainWindow()
  }
})

// prevent shutdown error
app.on('before-quit', (e) => {
  if (isMac) {
    app.exit();
  }
});


app.allowRendererProcessReuse = true
