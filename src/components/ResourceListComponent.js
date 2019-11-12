import { Component, $$ } from 'substance'
import ResourceComponent from './ResourceComponent'
import Section from './Section'

export default class ResourceListComponent extends Component {
  didMount () {
    const doc = this.props.document
    const root = doc.root
    this.context.editorState.addObserver(['document'], this.rerender, this, {
      document: {
        path: [root.id, 'resources']
      },
      stage: 'render'
    })
  }

  dispose () {
    this.context.editorState.off(this)
  }

  render () {
    const { document } = this.props
    const root = document.root
    const el = $$('div', { class: 'sc-resource-list' })
    if (root.resources && root.resources.length > 0) {
      const resources = root.resolve('resources')
      el.append(
        $$(Section, { name: 'resources', label: 'Resources' },
          ...resources.map(resourceNode => {
            return $$(ResourceComponent, { node: resourceNode }).ref(resourceNode.id)
          })
        )
      )
    }
    return el
  }
}
