const { ipcRenderer: ipc, remote } = require('electron')
const { shell, dialog } = remote
const path = require('path')
const url = require('url')

let _app, _window

// HACK: we should find a better solution to intercept window.open calls (e.g. as done by LinkComponent)
window.open = function (url, frameName, features) {
  console.log('Open external url', url, frameName, features)
  shell.openExternal(url)
}

ipc.on('save', () => {
  _saveOrSaveAs(_saveCallback)
})

ipc.on('saveAs', () => {
  _saveAs(_saveCallback)
})

window.addEventListener('load', () => {
  _window = remote.getCurrentWindow()

  _app.on('save', () => {
    _saveOrSaveAs(_handleSaveError)
  })

  _app.on('openExternal', url => {
    shell.openExternal(url)
  })

  _app.on('archive:ready', () => {
    // let archive = _app.state.archive
    // archive.on('archive:changed', () => {
    //   ipc.send('updateState', _window.id, {
    //     dirty: true
    //   })
    // })
    // archive.on('archive:saved', () => {
    //   ipc.send('updateState', _window.id, {
    //     dirty: false
    //   })
    // })
  })

  _window = remote.getCurrentWindow()
})

function _saveOrSaveAs (cb) {
  console.error('TODO: _saveOrSaveAs')
  // const archive = _app.state.archive
  // if (!archive) return
  // if (archive.isReadOnly) {
  //   _saveAs(cb)
  // } else {
  //   _app._save(cb)
  // }
}

function _saveAs (cb) {
  console.error('TODO: _saveAs')
  // const archive = _app.state.archive
  // if (!archive) return
  // dialog.showSaveDialog(
  //   _window,
  //   {
  //     title: 'Save archive as...',
  //     buttonLabel: 'Save',
  //     properties: ['openFile', 'createDirectory'],
  //     filters: [
  //       { name: 'Dar Files', extensions: ['dar'] }
  //     ]
  //   }, (newDarPath) => {
  //     if (newDarPath) {
  //       _app._saveAs(newDarPath, err => {
  //         if (err) {
  //           cb(err)
  //         } else {
  //           _updateWindowUrl(newDarPath)
  //           cb()
  //         }
  //       })
  //     } else {
  //       cb()
  //     }
  //   })
}

// function _updateWindowUrl (newDarPath) {
//   let newUrl = url.format({
//     pathname: path.join(__dirname, 'index.html'),
//     protocol: 'file:',
//     query: {
//       darPath: newDarPath
//     },
//     slashes: true
//   })
//   window.history.replaceState({}, 'After Save As', newUrl)
// }

function _handleSaveError (err) {
  console.error(err)
}

function _saveCallback (err) {
  if (err) {
    _handleSaveError(err)
  }
  //  else {
  //   const msg = `save:finished:${_window.id}`
  //   // console.log(msg)
  //   ipc.send(msg)
  // }
}
