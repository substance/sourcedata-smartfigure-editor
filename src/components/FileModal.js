import { Component, $$, Form, FormRow, Modal, Input, HorizontalStack } from 'substance'

export default class FileModal extends Component {
  render () {
    const { file } = this.props
    return $$(Modal, { title: 'Add Local File', size: 'medium', confirmLabel: 'Create Local File' },
      $$(Form, {},
        $$(FormRow, { label: 'Filename:' },
          $$(Input, { value: file.src, autofocus: true }).ref('src')
        ),
        $$(HorizontalStack, {},
          $$('div', { class: 'se-type' }, `type: ${file.type}`),
          $$('div', { class: 'se-size' }, `size: ${_getFormattedFileSize(file.size)}`)
        ).addClass('se-file-info')
      )
    ).addClass('sc-file-modal')
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
