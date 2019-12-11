// NOTE: for sake of security, node integration is disabled in the browser windows
// instead we have to provide/wrap anything needed from the node environment
const { ipcRenderer, remote, shell } = require('electron')
const url = require('url')
const path = require('path')
const fileFilters = require('./_fileFilters')

window.open = window._openExternal = function (url, frameName, features) {
  console.error('TODO: Open external url', url, frameName, features)
  shell.openExternal(url)
}

window._showSaveDialog = function (cb) {
  remote.dialog.showSaveDialog(
    browserWindow,
    {
      title: 'Save as...',
      buttonLabel: 'Save',
      properties: ['openFile', 'createDirectory'],
      filters: fileFilters
    }
  ).then(cb)
}

window._updateWindowUrl = function (newArchivePath) {
  const newUrl = url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    query: {
      darPath: newArchivePath
    },
    slashes: true
  })
  window.history.replaceState({}, 'After Save As', newUrl)
}

const browserWindow = remote.getCurrentWindow()
window.windowId = remote.getCurrentWindow().id
window.sharedStorage = browserWindow.sharedStorage
window.editorConfig = browserWindow.editorConfig
window.ipc = ipcRenderer
