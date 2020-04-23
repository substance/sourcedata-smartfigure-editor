import { $$, SelectableNodeComponent } from 'substance'

export default class AttachedResourceComponent extends SelectableNodeComponent {
  render () {
    const { node } = this.props
    const { selected } = this.state
    const el = $$('button', { class: 'sc-attached-resource', 'data-id': this._getSelectableId() })
    if (selected) el.addClass('sm-selected')
    const { title, href } = node
    el.append(
      $$('span', {},
        $$('span', { class: 'se-title' }, title || 'Untitled'),
        $$('span', { class: 'se-href' }, `(${href})`)
      )
    )
    return el
  }

  _getSelectableId () {
    const { panel, node } = this.props
    return `${panel.id}.resources#${node.id}`
  }
}
