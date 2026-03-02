import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const require = createRequire(import.meta.url)
const electron = require('electron')
const { app, BrowserWindow, Tray, Menu, nativeImage, ipcMain } = electron
// IPC handle to show/restore window
ipcMain.on('show-window', () => {
  if (win) {
    win.show()
    win.focus()
  }
})

// IPC handle for login settings
ipcMain.handle('get-login-settings', () => {
  return app.getLoginItemSettings()
})

ipcMain.on('set-login-settings', (_event: any, settings: any) => {
  app.setLoginItemSettings(settings)
})

const isHiddenStartup = process.argv.includes('--hidden')


const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

process.env.APP_ROOT = join(__dirname, '..')

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
const RENDERER_DIST = join(process.env.APP_ROOT, 'dist')

let tray: any = null
let win: any = null

function createTray() {
  const iconPath = join(process.env.APP_ROOT, 'public/quakeann.ico')
  const icon = nativeImage.createFromPath(iconPath)
  tray = new Tray(icon)

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Restore',
      click: () => {
        if (win) {
          win.show()
          win.focus()
        }
      }
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true
        app.quit()
      }
    }
  ])

  tray.setToolTip('QuakeAnn - Earthquake Announcer')
  tray.setContextMenu(contextMenu)

  tray.on('double-click', () => {
    if (win) {
      win.show()
      win.focus()
    }
  })
}

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'QuakeAnn - Real-time Earthquake Announcer',
    autoHideMenuBar: true,
    icon: join(process.env.APP_ROOT, 'public/quakeann.ico'),
    webPreferences: {
      preload: join(__dirname, 'preload.mjs'),
      nodeIntegration: true,
      contextIsolation: false,
      backgroundThrottling: false
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(join(RENDERER_DIST, 'index.html'))
  }

  // If started from Windows boot with --hidden, don't show the window
  if (!isHiddenStartup) {
    win.once('ready-to-show', () => {
      win.show()
    })
  } else {
    win.hide() // Ensure it's hidden if somehow it defaulted to visible
  }

  win.on('minimize', (event: any) => {
    event.preventDefault()
    win.hide()
  })

  // Ensure window is shown if it was hidden when normalized
  win.on('restore', () => {
    win.show()
  })

  if (!tray) {
    createTray()
  }
}

if (app) {
  app.name = 'Quake Announcer'
  // Set App User Model ID for Windows notifications
  if (process.platform === 'win32') {
    app.setAppUserModelId('Quake Announcer')
  }

  app.whenReady().then(createWindow)

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })

  // Prevent app from quitting when windows are closed if we want it to stay in tray
  // However, the user specifically asked for minimize to tray.
  // If they click the close button, it usually means quit unless specified otherwise.
}
