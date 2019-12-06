import { $$, SelectableNodeComponent } from 'substance'

export default class AttachedResourceComponent extends SelectableNodeComponent {
  render () {
    const { node } = this.props
    const { selected } = this.state
    const el = $$('button', { class: 'sc-attached-resource', 'data-id': this._getSelectableId() })
    if (selected) el.addClass('sm-selected')
    if (node.title) {
      el.append(
        $$('span', { class: 'se-title' }, node.title)
      )
      if (node.href) el.append(': ')
    }
    if (node.href) {
      el.append(
        $$('span', { class: 'se-href' }, node.href)
      )
    }
    return el
  }

  _getSelectableId () {
    const { panel, node } = this.props
    return `${panel.id}.resources#${node.id}`
  }
}
