import { Component, $$, Form, FormRow, Modal, Button, Icon, domHelpers, AssetModal } from 'substance'

export default class AttachFileModal extends Component {
  getInitialState () {
    const node = this.props.node
    const doc = node.getDocument()
    const availableFiles = new Set(doc.root.files)
    // remove already attached files
    this.props.node.files.forEach(id => {
      availableFiles.delete(id)
    })
    return {
      selectedId: null,
      availableFiles: Array.from(availableFiles).map(id => doc.get(id))
    }
  }

  render () {
    const { selectedId, availableFiles } = this.state
    const el = $$(Modal, { title: 'Attach File', size: 'large', confirmLabel: 'Ok', disableConfirm: !selectedId })
    el.addClass('sc-attach-file-modal')

    const form = $$(Form)
    if (availableFiles.length > 0) {
      form.append(
        $$(FormRow, { label: 'Choose an existing File' },
          $$('select', { class: 'se-file-select', autofocus: true, onchange: this._onSelect },
            $$('option', { value: '' }, ''),
            ...availableFiles.map(file => this.renderFileOption(file))
          ).ref('select')
        )
      )
    }
    form.append(
      $$(FormRow, { label: 'Add a new File' },
        $$(Button, { onclick: this._onClickNewFile }, $$(Icon, { icon: 'plus' }))
      )
    )
    el.append(form)

    return el
  }

  renderFileOption (fileNode) {
    const archive = this.context.archive
    const option = $$('option', { class: 'se-file', value: fileNode.id }, archive.getFilename(fileNode.src)).ref(fileNode.id)
    if (this.state.selectedId === fileNode.id) {
      option.setAttribute('selected', true)
    }
    return option
  }

  _onSelect () {
    const val = this.refs.select.val()
    this.extendState({
      selectedId: val
    })
  }

  _onClickNewFile (event) {
    domHelpers.stopAndPrevent(event)
    // TODO: ideally we would use the 'add-file' command
    // but actually we need to execute this in a little different way,
    // particularly w.r.t selection
    this.send('requestFileSelect', { multiple: false }).then(files => {
      if (files.length > 0) {
        const file = files[0]
        return this.send('requestModal', () => {
          return $$(AssetModal, { file })
        }).then(modal => {
          if (!modal) return
          const { src } = modal.state.data
          const api = this.context.api
          const fileNode = api.addFile(src, file)
          api.attachFile(this.props.node.id, fileNode.id)
        })
      }
    })
  }
}
