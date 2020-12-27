const { app, BrowserWindow, ipcMain, dialog, webContents } = require('electron')
const DataStore = require('./renderer/MusicDataStore')
const  myStore=  new DataStore()
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
  mainWindow.webContents.on('did-finish-load', ()=>{
    console.log('page for main in webcontent');
    mainWindow.send('getTracks', myStore.getTracks())
  })
  ipcMain.on('add-music-window', (event, arg) => {
    const addWindow = new AppWindow({
      width: 500,
      height: 400,
      parent: mainWindow
    }, './renderer/add.html')
  })
  ipcMain.on('add-tracks', (event, tracks) => {
    console.log(tracks);
    const updateStore =  myStore.addTracks(tracks).getTracks()
    // console.log(updateStore);   
    mainWindow.send('getTracks', updateStore)
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
  ipcMain.on('delete-file', (event, id) => {
    const updateTracks = myStore.deleteTracks(id).getTracks()
    mainWindow.send('getTracks', updateTracks)
  })
})