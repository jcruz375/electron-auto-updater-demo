const { app, BrowserWindow, dialog, ipcMain } = require('electron')
const { autoUpdater } = require('electron-updater');
const path = require('path')


const createWindow = () => {
  const mainWindow = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })
  
  mainWindow.loadFile('index.html');
  
  autoUpdater.autoDownload = false;
  autoUpdater.checkForUpdates();
  mainWindow.webContents.openDevTools();
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

autoUpdater.on('update-available', (info) => {
  let isRequiredUpdate = info.tag.includes('required');

  if (isRequiredUpdate) {
    dialog.showMessageBox({
      type: 'info',
      title: 'Atualização obrigatória disponível',
      message: `Existe uma atualização ***OBRIGATÓRIA*** ${JSON.stringify(info)}`,
      buttons: ['OKAY!!!!']
    }).then((buttonIndex) => {
      autoUpdater.downloadUpdate();
    });
  } else {
    dialog.showMessageBox({
      type: 'info',
      title: 'Atualização disponível',
      message: `Existem atualizações disponíveis! Deseja atualizar?? ${JSON.stringify(info)}`,
      buttons: ['Sim', 'Não']
    }).then((buttonIndex) => {
      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  }

});

// console.log("TESTE::::", teste)

autoUpdater.on('update-not-available', (info) => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: `Current version is up-to-date. ${JSON.stringify(info)}`
  })
})

autoUpdater.on('update-downloaded', (info) => {
  dialog.showMessageBox({
    title: 'Atualização instalada!',
    message: `Updates downloaded, application will be quit for update... ${JSON.stringify(info)}`
  }).then(() => {
    setImmediate(() => autoUpdater.quitAndInstall())
  })
})