import { $$, SelectableNodeComponent } from 'substance'

export default class AttachedFileComponent extends SelectableNodeComponent {
  render () {
    const archive = this.context.archive
    const { node } = this.props
    const { selected } = this.state
    const el = $$('button', { class: 'sc-attached-file', 'data-id': this._getSelectableId() })
    if (selected) el.addClass('sm-selected')
    el.append(
      $$('span', { class: 'se-filename' }, archive.getFilename(node.src))
    )
    if (node.title) {
      el.append(
        ': ',
        $$('span', { class: 'se-title' }, node.title)
      )
    }
    return el
  }

  _getSelectableId () {
    const { panel, node } = this.props
    return `${panel.id}.files#${node.id}`
  }
}
