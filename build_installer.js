// ./build_installer.js

// 1. Import Modules
const { MSICreator } = require('electron-wix-msi');
const path = require('path');

// 2. Define input and output directory.
// Important: the directories must be absolute, not relative e.g
// appDirectory: "C:\\Users\sdkca\Desktop\OurCodeWorld-win32-x64", 
const APP_DIR = path.resolve(__dirname, './testjcruz-win32-x64');
// outputDirectory: "C:\\Users\sdkca\Desktop\windows_installer", 
const OUT_DIR = path.resolve(__dirname, './windows_installer_new');
const BG_IMG_DIR = path.resolve(__dirname, './assets/teste-bg.jpg');
const ICON_IMG_DIR = path.resolve(__dirname, './assets/icon.png');


// 3. Instantiate the MSICreator
const msiCreator = new MSICreator({
  appDirectory: APP_DIR,
  outputDirectory: OUT_DIR,

  // Configure metadata
  description: 'esse é um teste',
  exe: 'instaladora-teste',
  name: 'teste instalador windows',
  manufacturer: 'joao cruz',
  version: '1.0.0',
  arch: 'x64',

  // Configure installer User Interface
  ui: {
    enabled: true,
    chooseDirectory: true,
    images: {
      background: BG_IMG_DIR,
      banner: BG_IMG_DIR,
      exclamationIcon: ICON_IMG_DIR,
      infoIcon: ICON_IMG_DIR,
      newIcon: ICON_IMG_DIR,
      upIcon: ICON_IMG_DIR,
    }
  },
});

// 4. Create a .wxs template file
msiCreator.create().then(function () {

  // Step 5: Compile the template to a .msi file
  msiCreator.compile();
});