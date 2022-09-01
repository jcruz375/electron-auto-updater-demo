const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path')

autoUpdater.autoDownload = false;

const createWindow = () => {
  const appCurrentVersion = app.getVersion();
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  mainWindow.loadFile('index.html');

  autoUpdater.checkForUpdates();
  mainWindow.webContents.openDevTools();

  autoUpdater.on("update-available", (info) => {
    localStorage.setItem('update-info', JSON.stringify(info));
  })
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

  const releaseNotes = JSON.parse(info.releaseNotes);

  const isRequiredUpdate = releaseNotes.versions.requiresUpdate.filter(version => version === appCurrentVersion)

  if (isRequiredUpdate.length > 0) {
    dialog.showMessageBox({
      type: 'info',
      title: 'SISTEMA REQUER ATUALIZAÇÃO',
      message: `O SEU SISTEMA ESTÁ DESATUALIZADO, NECESSÁRIO ATUALIZAR ${JSON.stringify(info.releaseNotes)}`,
      buttons: ['OK!!!']
    }).then((response) => {
      autoUpdater.downloadUpdate();
    });
  } else {
    dialog.showMessageBox({
      type: 'info',
      title: 'Atualização disponível',
      message: `Existem atualizações disponíveis! Deseja atualizar?? ${JSON.stringify(info.releaseNotes)}`,
      buttons: ['Sim', 'Não']
    }).then((buttonIndex) => {
      if (buttonIndex === 0) {
        dialog.showMessageBox({
          type: 'info',
          title: 'Atualização INICIOU',
          message: `A ATUALIZAÇÃO COMEÇOU A SER BAIXADA! ${JSON.stringify(info.releaseNotes)}`,
          buttons: ['OK']
        })
        autoUpdater.downloadUpdate();
      }
    });
  }

});

// console.log("TESTE::::", teste)

autoUpdater.on('update-not-available', (info) => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: `Current version is up-to-date. ${JSON.stringify(info.releaseNotes)}`
  })
})

autoUpdater.on('update-downloaded', (info) => {
  dialog.showMessageBox({
    title: 'Atualização instalada!',
    message: `Updates downloaded, application will be quit for update... ${JSON.stringify(info.releaseNotes)}`
  }).then(() => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
})