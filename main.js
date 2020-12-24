const { app, BrowserWindow, ipcMain, dialog } = require('electron')

class AppWindow extends BrowserWindow{
  constructor(config, fileLocation){
    const baseConfig = {
      width: 800,
      height: 600,
      webPreferences: {
        nodeIntegration: true
      }
    }
    const finalConfig = { ...baseConfig, ...config }
    super(finalConfig)
    this.loadFile(fileLocation)
    this.once('ready-to-show', ()=>{
      this.show()
    })
  }
}
  
app.on('ready', ()=>{
  // 主进程
  const mainWindow = new AppWindow({}, './renderer/index.html')
  ipcMain.on('add-music-window', (event, arg) => {
    const addWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow
    }, './renderer/add.html')
  })
  ipcMain.on('open-music-file', (event, arg) => {
    dialog.showOpenDialog({
      properties:['openFild', 'multiSelections' ],
      filters: [
        { name: 'Movies', extensions: ['mp3'] }
      ]
    }).then(result => {
      if(!result.canceled){
        event.sender.send('selected-file', result.filePaths)
      }
    })
  })
})