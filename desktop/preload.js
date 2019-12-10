// NOTE: for sake of security, node integration is disabled in the browser windows
// instead we have to provide/wrap anything needed from the node environment
const { ipcRenderer, remote, shell } = require('electron')
window.ipc = ipcRenderer
window.windowId = remote.getCurrentWindow().id

window.open = function (url, frameName, features) {
  console.error('TODO: Open external url', url, frameName, features)
  shell.openExternal(url)
}

const browserWindow = remote.getCurrentWindow()
window.sharedStorage = browserWindow.sharedStorage
window.editorConfig = browserWindow.editorConfig
