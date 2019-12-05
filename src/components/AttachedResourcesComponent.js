import { $$, PropertyComponent, SelectableNodeComponent, renderProperty, domHelpers } from 'substance'

export default class AttachedResourcesComponent extends PropertyComponent {
  getPath () {
    return [this.props.node.id, 'resources']
  }

  render () {
    const { node } = this.props
    const el = $$('div', { class: 'sc-attached-resources' })
    if (node.resources && node.resources.length > 0) {
      const resources = node.resolve('resources')
      el.append(
        ...resources.map(resourceNode => {
          return $$(AttachedResourceComponent, { panel: node, node: resourceNode, onmousedown: this._onMousedown.bind(this, node, resourceNode) }).ref(resourceNode.id)
        })
      )
    }
    return el
  }

  _onMousedown (panel, resourceNode, event) {
    domHelpers.stopAndPrevent(event)
    this.context.api.selectValue(panel, 'resources', resourceNode.id)
  }
}

class AttachedResourceComponent extends SelectableNodeComponent {
  render () {
    const { node } = this.props
    const { selected } = this.state
    const el = $$('button', { class: 'sc-attached-resource', 'data-id': this._getSelectableId() })
    if (selected) el.addClass('sm-selected')
    el.append(
      renderProperty(this, node.getDocument(), [node.id, 'title'], { readOnly: true, inline: true }).addClass('se-title'),
      ': ',
      renderProperty(this, node.getDocument(), [node.id, 'href'], { readOnly: true }).addClass('se-href')
    )
    return el
  }

  _getSelectableId () {
    const { panel, node } = this.props
    return `${panel.id}.resources#${node.id}`
  }
}
