import { Component, $$, Form, FormRow, Modal, Input, HorizontalStack } from 'substance'

export default class FileModal extends Component {
  getInitialState () {
    // NOTE: when creating a new file, the file instance is passed as props
    const archive = this.context.api.archive
    const { mode, node, file } = this.props
    let data
    if (mode === 'edit') {
      data = {
        src: node.src || '',
        mimetype: node.mimetype,
        originalSrc: node.src || ''
      }
    } else {
      data = {
        src: archive.getUniqueFileName(file.name),
        mimetype: file.type,
        size: file.size
      }
    }
    return {
      data,
      duplicateFileError: false
    }
  }

  render () {
    const { data, duplicateFileError } = this.state
    const { mode } = this.props
    const title = mode === 'edit' ? 'Edit File' : 'Add File'
    const confirmLabel = mode === 'edit' ? 'Update File' : 'Create File'
    const modal = $$(Modal, { title, size: 'medium', confirmLabel, class: 'sc-file-modal', disableConfirm: duplicateFileError })
    const form = $$(Form)
    form.append(
      $$(FormRow, { label: 'Filename:' },
        $$(Input, { value: data.src, autofocus: true, oninput: this._updateSrc }).ref('src'),
        $$('div', { class: 'se-error' }, duplicateFileError ? 'A file with this name already exists' : null)
      ).addClass('se-src')
    )
    form.append(
      $$(HorizontalStack, {},
        $$('div', { class: 'se-type' }, `type: ${data.mimetype}`),
        data.size
          ? $$('div', { class: 'se-size' }, `size: ${_getFormattedFileSize(data.size)}`)
          : $$('div')
      ).addClass('se-file-info')
    )

    modal.append(form)
    return modal
  }

  _updateSrc () {
    this.state.data.src = this.refs.src.val()
    this._validateSrc()
  }

  _validateSrc () {
    const newSrc = this.state.data.src
    const originalSrc = this.state.data.originalSrc
    if (!originalSrc || newSrc !== originalSrc) {
      const archive = this.context.api.archive
      if (archive.isFilenameUsed(newSrc)) {
        if (!this.state.duplicateFileError) {
          this.extendState({
            duplicateFileError: true
          })
        }
      } else {
        if (this.state.duplicateFileError) {
          this.extendState({
            duplicateFileError: false
          })
        }
      }
    }
  }
}

function _getFormattedFileSize (size) {
  if (size > 1000000) {
    return Math.round(size / 1000000 * 10) / 10 + ' MB'
  } else if (size > 100000) {
    return Math.round(size / 1000) + ' KB'
  } else {
    return size + ' Bytes'
  }
}
