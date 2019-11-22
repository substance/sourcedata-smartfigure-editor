import { $$, PropertyComponent, NodeComponent, renderProperty } from 'substance'

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
          return $$(AttachedResourceComponent, { node: resourceNode }).ref(resourceNode.id)
        })
      )
    }
    return el
  }
}

class AttachedResourceComponent extends NodeComponent {
  render () {
    const { node } = this.props
    const el = $$('div', { class: 'sc-attached-resource' })
    el.append(
      renderProperty(this, node.getDocument(), [node.id, 'title'], { readOnly: true, inline: true }).addClass('se-title'),
      ': ',
      renderProperty(this, node.getDocument(), [node.id, 'legend'], { readOnly: true, container: false }).addClass('se-legend')
    )
    return el
  }
}
