import { Component, $$, Form, FormRow, Modal, renderProperty } from 'substance'
import CheckboxItem from './CheckboxItem'

export default class AttachFileModal extends Component {
  getInitialState () {
    const { node } = this.props
    const attachedFiles = node.files.slice()
    const allFiles = node.getDocument().root.files.slice()
    const files = new Map()
    attachedFiles.forEach(id => {
      files.set(id, { attached: true })
    })
    allFiles.forEach(id => {
      if (!files.has(id)) {
        files.set(id, { attached: false })
      }
    })
    return { files }
  }

  render () {
    const files = this.state.files
    const el = $$(Modal, { title: 'Attach File', size: 'large', confirmLabel: 'Ok' })
    el.addClass('sc-attach-file-modal')

    const form = $$(Form)
    const filesEl = $$(FormRow, { label: 'Files' })
    for (const [id, entry] of files) {
      filesEl.append(
        $$(CheckboxItem, { selected: entry.attached, oninput: this._onToggleItem.bind(this, id) },
          this._renderFile(id)
        ).ref(id)
      )
    }

    form.append(filesEl)
    el.append(form)

    return el
  }

  _renderFile (id) {
    const doc = this.props.node.getDocument()
    const node = doc.get(id)
    return $$('div', { class: 'se-file' },
      $$('span', { class: 'se-src' }, node.src),
      ': ',
      renderProperty(this, node.getDocument(), [node.id, 'title'], { readOnly: true, inline: true })
    )
  }

  _onToggleItem (id) {
    const newFiles = new Map(this.state.files)
    const newEntry = this.state.files.get(id)
    newEntry.attached = !newEntry.attached
    newFiles.set(id, newEntry)
    this.extendState({ files: newFiles })
  }
}
