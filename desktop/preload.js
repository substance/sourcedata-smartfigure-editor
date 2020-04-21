// NOTE: for sake of security, node integration is disabled in the browser windows
// instead we have to provide/wrap anything needed from the node environment
const { ipcRenderer, remote, shell } = require('electron')
const url = require('url')
const fse = require('fs-extra')
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

window._showExportDialog = function (cb) {
  remote.dialog.showSaveDialog(
    browserWindow,
    {
      title: 'Export as...',
      buttonLabel: 'Export',
      properties: ['openFile', 'createDirectory'],
      filters: [
        { name: 'ZIP files', extensions: ['zip'] }
      ]
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

window._downloadAsset = function (archive, asset, cb) {
  const filename = path.basename(archive.getFilename(asset.id))
  remote.dialog.showSaveDialog(
    browserWindow,
    {
      defaultPath: filename,
      title: 'Save asset as...',
      buttonLabel: 'Save',
      properties: ['openFile', 'createDirectory']
    }
  ).then(async (result) => {
    if (result.canceled) return
    const buffer = await archive.getBlob(asset.id)
    const filePath = result.filePath
    return fse.outputFile(filePath, buffer)
  })
}

const browserWindow = remote.getCurrentWindow()
window.windowId = remote.getCurrentWindow().id
window.sharedStorage = browserWindow.sharedStorage
window.editorConfig = browserWindow.editorConfig
window.ipc = ipcRenderer
