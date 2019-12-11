import loadArchive from 'substance/dar/loadArchive'
import DocumentArchive from 'substance/dar/DocumentArchive'
import InMemoryDarBuffer from 'substance/dar/InMemoryDarBuffer'
import { SmartFigureConfiguration, SmartFigureEditor } from '../index'

// Note: these are provided by preload.js

window.addEventListener('load', () => {
  const {
    ipc, editorConfig, sharedStorage, _showSaveDialog, _updateWindowUrl
  } = window
  const { darPath, readOnly } = editorConfig

  const config = new SmartFigureConfiguration()
  const archive = new DocumentArchive(sharedStorage, new InMemoryDarBuffer(), {}, config)
  // Note: readOnly=true if a template is loaded
  archive.readOnly = readOnly
  let editor = null
  archive.load(darPath, err => {
    if (err) {
      console.error('Could not load DAR:', err)
    } else {
      editor = SmartFigureEditor.mount({ archive }, window.document.body, { inplace: true })
    }
  })

  ipc.on('save', () => {
    _saveOrSaveAs(_handleSaveError)
  })

  ipc.on('saveAs', url => {
    _saveAs(_handleSaveError)
  })

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
          // HACK: this is kind of an optimization but formally it is not
          // 100% correct to continue with the same archive instance
          // Instead one would expect that cloning an archive returns
          // a new archive instance
          // Though, this would have other undesired implications
          // such as loosing the scroll position or undo history
          // Thus we move on with this solution, but we need to clear
          // the isReadOnly flag now.
          archive.readOnly = false
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
