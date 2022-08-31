const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path')

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

autoUpdater.on("update-available", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["OK"],
    title: "Update Available",
    message: releaseNotes,
    detail: "A new version is being downloaded"
  };
  dialog.showMessageBox(dialogOpts, (response) => {

  })
})

autoUpdater.on("update-downloaded", (_event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: "info",
    buttons: ["Restart", "Later"],
    title: "Aplication Update",
    message: releaseNotes,
    detail: "A new version has been downloaded. Restart the aplication to aply the updates..."
  };
  dialog.showMessageBox(dialogOpts).then(returnValue => {
    if (returnValue === 0) autoUpdater.quitAndInstall();
  })
})