import { PropertyComponent, $$ } from 'substance'
import ResourceComponent from './ResourceComponent'
import Heading from './Heading'

export default class ResourceListComponent extends PropertyComponent {
  getPath () {
    return [this.props.document.root.id, 'resources']
  }

  render () {
    const { document } = this.props
    const root = document.root
    const el = $$('div', { class: 'sc-resource-list' })
    if (root.resources && root.resources.length > 0) {
      const resources = root.resolve('resources')
      el.append(
        $$(Heading, { level: 2 }, 'Resources')
          .setAttribute('data-section', 'resources')
      )
      el.append(
        $$('div', { class: 'se-resources' },
          ...resources.map(resourceNode => {
            return $$(ResourceComponent, { node: resourceNode }).ref(resourceNode.id)
          })
        )
      )
    }
    return el
  }
}
