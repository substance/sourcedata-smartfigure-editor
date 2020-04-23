import { $$, SelectableNodeComponent } from 'substance'

export default class AttachedFileComponent extends SelectableNodeComponent {
  render () {
    const archive = this.context.archive
    const { node } = this.props
    const { selected } = this.state
    const el = $$('button', { class: 'sc-attached-file', 'data-id': this._getSelectableId() })
    if (selected) el.addClass('sm-selected')
    const filename = archive.getFilename(node.src)
    const title = node.title
    el.append(
      $$('span', {},
        title ? $$('span', { class: 'se-title' }, title) : null,
        $$('span', { class: 'se-filename' },
          title ? `(${filename})` : filename
        )
      )
    )
    return el
  }

  _getSelectableId () {
    const { panel, node } = this.props
    return `${panel.id}.files#${node.id}`
  }
}
