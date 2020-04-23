import {
  Component, $$, Form, FormRow, Modal, domHelpers,
  MultiSelect, AssetModal, HorizontalStack
} from 'substance'

export default class AttachFileModal extends Component {
  getInitialState () {
    const { node } = this.props
    const selectedFiles = node.resolve('files')
    return { selectedFiles }
  }

  render () {
    const { selectedFiles } = this.state
    const title = 'Attach File'

    const modalProps = { title, cancelLabel: 'Cancel', confirmLabel: 'Ok', size: 'medium', class: 'sc-attach-file-modal' }
    return $$(Modal, modalProps,
      $$(Form, {},
        $$(FormRow, {},
          $$(MultiSelect, {
            placeholder: 'No files attached.',
            selectedItems: selectedFiles,
            queryPlaceHolder: 'Select a file or attach a new one',
            query: this._queryFiles.bind(this),
            itemRenderer: this._renderAttachedFile.bind(this),
            local: true,
            autofocus: true,
            onchange: this._onFilesChange,
            onaction: this._onFilesAction
          }).ref('files')
        )
      )
    )
  }

  _renderAttachedFile (item) {
    const archive = this.context.archive
    return $$(HorizontalStack, { class: 'se-attached-file-item' },
      $$('div', { class: 'se-filename' }, archive.getFilename(item.src)),
      $$('div', { class: 'se-title' }, item.title)
    )
  }

  _queryFiles (str) {
    const archive = this.context.archive
    const { document } = this.props
    const root = document.root
    const items = root.resolve('files').map(item => {
      const filename = archive.getFilename(item.src)
      return {
        id: item.id,
        filename,
        title: item.title,
        label: filename,
        _data: filename + item.title ? ` ${item.title}` : '',
        node: item
      }
    })
    let filteredItems
    // if no query string provided show all items
    if (str) {
      filteredItems = items.filter(item => {
        return item._data.indexOf(str) > -1
      })
    } else {
      filteredItems = items
    }
    let options = []
    options.push(
      { action: 'attach-file', id: '#create', label: 'Attach a new file' }
    )
    options = options.concat(
      filteredItems.map(item => {
        return { action: 'select', id: item.id, label: item.label, item: item.node }
      })
    )
    return options
  }

  _onFilesChange () {
    const val = this.refs.files.val()
    this.extendState({
      selectedFiles: val
    })
  }

  _onFilesAction (e) {
    domHelpers.stopAndPrevent(e)
    const option = e.detail
    if (option.id === '#create') {
      this.send('requestFileSelect', { multiple: false }).then(files => {
        if (files.length > 0) {
          const file = files[0]
          return this.send('requestModal', () => {
            return $$(AssetModal, { file })
          }).then(modal => {
            if (!modal) return
            const api = this.context.api
            const { filename } = modal.state.data
            const fileNode = api.addFile(filename, file)
            const selectedFiles = this.state.selectedFiles
            selectedFiles.push(fileNode)
            this.extendState({ selectedFiles })
          })
        }
      })
    }
  }
}
