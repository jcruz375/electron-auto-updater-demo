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
  autoUpdater.downloadUpdate();
})

autoUpdater.on('update-downloaded', (info) => {
  let isRequiredUpdate = info.tag.includes('required');

  if (isRequiredUpdate) {
    dialog.showMessageBox({
      type: 'info',
      title: 'Atualização obrigatória disponível',
      message: `Existe uma atualização ***OBRIGATÓRIA*** ${JSON.stringify(info)}`,
      buttons: ['OKAY!!!!']
    }).then((response) => {
      autoUpdater.quitAndInstall();
    });
  } else {
    dialog.showMessageBox({
      type: 'info',
      title: 'Atualização disponível',
      message: `Existem atualizações disponíveis! Deseja atualizar?? ${JSON.stringify(info)}`,
      buttons: ['Instalar agora', 'Depois']
    }).then((buttonIndex) => {
      if (buttonIndex === 0) {
        autoUpdater.downloadUpdate();
      }
    });
  }

});

autoUpdater.on('update-not-available', (info) => {
  dialog.showMessageBox({
    title: 'No Updates',
    message: `Current version is up-to-date. ${JSON.stringify(info)}`
  })
});