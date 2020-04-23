import {
  Component, $$, Form, Modal, HorizontalStack, domHelpers,
  MultiSelect
} from 'substance'
import ResourceModal from './ResourceModal'

export default class AttachResourceModal extends Component {
  getInitialState () {
    const node = this.props.node
    const selectedResources = node.resolve('resources')
    return {
      selectedResources
    }
  }

  render () {
    const { selectedResources } = this.state
    const el = $$(Modal, { title: 'Attach Resource', size: 'large', confirmLabel: 'Ok' })
    el.addClass('sc-attach-resource-modal')
    const form = $$(Form, {},
      $$(MultiSelect, {
        placeholder: 'No resources attached.',
        selectedItems: selectedResources,
        queryPlaceHolder: 'Select a resource or enter a URL to attach a new one',
        query: this._queryResources.bind(this),
        itemRenderer: this._renderAttachedResource.bind(this),
        local: true,
        onchange: this._onResourcesChange,
        onaction: this._onResourcesAction
      }).ref('resources')
    )
    el.append(form)
    return el
  }

  _renderAttachedResource (item) {
    return $$(HorizontalStack, { class: 'se-attached-file-item' },
      $$('div', { class: 'se-label' }, item.title ? `${item.title} (${item.href})` : item.href)
    )
  }

  _onResourcesChange () {
    const val = this.refs.resources.val()
    this.extendState({
      selectedResources: val
    })
  }

  _queryResources (str) {
    const { document } = this.props
    const root = document.root
    const items = root.resolve('resources').map(item => {
      const label = item.title ? `${item.title} (${item.href})` : item.href
      return {
        id: item.id,
        label,
        _data: label,
        node: item
      }
    })
    let filteredItems
    // if no query string provided show all items
    if (str) {
      filteredItems = items.filter(item => {
        return item._data.indexOf(str) > -1
      })
    } else {
      filteredItems = items
    }
    let options = []
    if ((/(https?|ftps?)/.exec(str))) {
      options.push(
        { action: 'attach-resource', id: '#create', label: `Attach a new resource "${str}"`, value: str }
      )
    }
    options = options.concat(
      filteredItems.map(item => {
        return { action: 'select', id: item.id, label: item.label, item: item.node }
      })
    )
    return options
  }

  _onResourcesAction (e) {
    domHelpers.stopAndPrevent(e)
    const option = e.detail
    if (option.id === '#create') {
      const api = this.context.api
      const resourceNode = api.addResource({ href: option.value }, { select: false })
      const selectedResources = this.state.selectedResources
      selectedResources.push(resourceNode)
      this.extendState({ selectedResources })
    }
  }
}
