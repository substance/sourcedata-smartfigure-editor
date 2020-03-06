import {
  Component, $$, Form, FormRow, Modal, domHelpers,
  MultiSelect, AssetModal
} from 'substance'

export default class AttachFileModal extends Component {
  getInitialState () {
    const { node } = this.props
    const selectedFiles = node.files.slice()
    return { selectedFiles }
  }

  render () {
    const { node } = this.props
    const { selectedFiles } = this.state
    const title = 'Attach File'
    const archive = this.context.archive

    const root = node.getDocument().root
    const fileList = root.resolve('files')

    const modalProps = { title, cancelLabel: 'Cancel', confirmLabel: 'Ok', size: 'medium', class: 'sc-attach-file-modal' }
    const selectFileOptions = fileList.map(file => {
      return { value: file.id, label: archive.getFilename(file.src) }
    })
    return $$(Modal, modalProps,
      $$(Form, {},
        $$(FormRow, {},
          $$('div', {},
            'Select an existing file or add a ',
            $$('a', { class: 'se-add-new-file', onclick: this._onAddNewFile }, 'New File')
          )
        ),
        $$(FormRow, {},
          $$(MultiSelect, {
            options: selectFileOptions,
            value: selectedFiles,
            label: 'Select File',
            // placeholder: 'Please select one or more files',
            onchange: this._onChange,
            onaction: this._onAddNewFile
          }).ref('files')
        )
      )
    )
  }

  _onChange () {
    const val = this.refs.files.val()
    this.extendState({
      selectedFiles: val
    })
  }

  _onAddNewFile (event) {
    domHelpers.stopAndPrevent(event)
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
          const selectedFiles = this.state.selectedFiles.concat(fileNode.id)
          this.extendState({
            selectedFiles
          })
        })
      }
    })
  }
}
