const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path')

let updater
autoUpdater.autoDownload = false

const createWindow = () => {
  const appVersion = app.getVersion();
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html');

  autoUpdater.checkForUpdates();
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

ipcMain.on("app_version", (event) => {
  event.sender.send('app_version', { version: appVersion });
});

autoUpdater.on('error', (error) => {
  dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString());
});

autoUpdater.on('update-available', (info) => {
  dialog.showMessageBox({
    type: 'info',
    title: 'Atualização disponível',
    message: `Existem atualizações disponíveis! ${info}`,
    buttons: ['Sim', 'Não']
  }).then((buttonIndex) => {
    if (buttonIndex === 0) {
      autoUpdater.downloadUpdate();
    }
    else {
      updater.enabled = true;
      updater = null;
    };
  });
});

autoUpdater.on('update-not-available', () => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: 'Current version is up-to-date.'
  })
  updater.enabled = true
  updater = null
})

autoUpdater.on('update-downloaded', () => {
  dialog.showMessageBox({
    title: 'Atualização instalada!',
    message: 'Updates downloaded, application will be quit for update...'
  }).then(() => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
})