import {
  Component, $$, HorizontalStack, Title, StackFill
} from 'substance'
import loadArchive from 'substance/dar/loadArchive'
import { SmartFigureConfiguration, SmartFigureEditor } from '../index'

// Note: these are provided by preload.js

window.addEventListener('load', () => {
  const { windowId, ipc, editorConfig, sharedStorage } = window
  const { darPath, readOnly } = editorConfig
  let app
  sharedStorage.read(darPath, (err, rawArchive) => {
    if (err) {
      console.error('Could not load DAR:', err)
    } else {
      const config = new SmartFigureConfiguration()
      const archive = loadArchive(rawArchive, config)
      app = SmartFigureEditor.mount({ archive, readOnly }, window.document.body, { inplace: true })
    }
  })

  // _app.on('save', () => {
  //   _saveOrSaveAs(_handleSaveError)
  // })
  // _app.on('openExternal', url => {
  //   shell.openExternal(url)
  // })
  // _app.on('archive:ready', () => {
  //   // let archive = _app.state.archive
  //   // archive.on('archive:changed', () => {
  //   //   ipc.send('updateState', _window.id, {
  //   //     dirty: true
  //   //   })
  //   // })
  //   // archive.on('archive:saved', () => {
  //   //   ipc.send('updateState', _window.id, {
  //   //     dirty: false
  //   //   })
  //   // })
  // })
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

class App extends Component {
  constructor (...args) {
    super(...args)

    this.config = new SmartFigureConfiguration()
  }

  getInitialState () {
    return {
      archive: null,
      error: null
    }
  }

  getChildContext () {
    return {
      config: this.config,
      archive: this.state.archive
    }
  }

  didMount () {
    const archiveId = this.props.archiveId
    this.props.darStorage
  }

  dispose () {
  }

  render () {
    const { archive } = this.state.archive
    return $$('body', { class: 'sc-app' },
      archive ? $$(SmartFigureEditor, { archive }) : null
    )
  }

  _getTitle () {
    // TODO: do we need this?
    return ''
  }

  _onDocumentChange (change) {}
}
