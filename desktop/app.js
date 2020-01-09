import DocumentArchive from 'substance/dar/DocumentArchive'
import InMemoryDarBuffer from 'substance/dar/InMemoryDarBuffer'
import { SmartFigureConfiguration, SmartFigureEditor } from '../index'

window.addEventListener('load', () => {
  // ATTENTION: these variables are provided by preload.js serving as a bridge
  // between the node backend and the web process
  const {
    ipc, editorConfig, sharedStorage, _showSaveDialog, _updateWindowUrl, windowId
  } = window
  const { darPath, readOnly } = editorConfig

  const config = new SmartFigureConfiguration()
  const archive = new DocumentArchive(sharedStorage, new InMemoryDarBuffer(), {}, config)
  const state = {
    dirty: false
  }

  // Note: readOnly=true if a template is loaded
  archive.readOnly = readOnly
  archive.load(darPath, err => {
    if (err) {
      console.error('Could not load DAR:', err)
    } else {
      _updateWindowTitle()
      SmartFigureEditor.mount({ archive }, window.document.body, { inplace: true })
    }
  })

  archive.on('archive:changed', () => {
    state.dirty = true
    ipc.send('updateState', windowId, state)
    _updateWindowTitle()
  })
  archive.on('archive:saved', () => {
    state.dirty = false
    ipc.send('updateState', windowId, state)
    _updateWindowTitle()
  })

  ipc.on('save', () => {
    _saveOrSaveAs(_handleSaveError)
  })

  ipc.on('saveAs', url => {
    _saveAs(_handleSaveError)
  })

  function _updateWindowTitle () {
    const frags = []
    if (state.dirty) frags.push('*')
    const doc = archive.getDocuments().find(doc => doc.type === 'smart-figure')
    const title = doc.root.title
    frags.push(title || 'Untitled')
    window.document.title = frags.join(' ')
  }

  function _saveOrSaveAs (cb) {
    if (!archive) return
    if (archive.readOnly) {
      _saveAs(cb)
    } else {
      archive.save((err, update) => {
        if (err) return cb(err)
        // TODO: do we change the window title?
        // this._updateTitle()
        cb(null, update)
      })
    }
  }

  function _saveAs (cb) {
    if (!archive) return
    _showSaveDialog(res => {
      const { canceled, filePath } = res
      if (!canceled && filePath) {
        archive.saveAs(filePath, err => {
          if (err) {
            console.error(err)
            return cb(err)
          }
          // ATTENTION: in case the archive has been loaded from a template, which is readonly,
          // we reuse the archive instance with a changed location, and removing the readonly flag.
          if (archive.readOnly) {
            delete archive.readOnly
          }
          _updateWindowUrl(filePath)
          cb()
        })
      } else {
        cb()
      }
    })
  }

  function _handleSaveError (err) {
    if (err) {
      console.error(err)
    }
  }
})
