import { $$, PropertyComponent, domHelpers } from 'substance'
import AttachedResourceComponent from './AttachedResourceComponent'

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
          return $$(AttachedResourceComponent, {
            panel: node,
            node: resourceNode,
            onmousedown: this._onMousedown.bind(this, node, resourceNode)
          }).ref(resourceNode.id)
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
