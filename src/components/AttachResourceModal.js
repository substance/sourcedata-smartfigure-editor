import { Component, $$, Form, FormRow, Modal, Button, HorizontalStack, domHelpers } from 'substance'
import ResourceModal from './ResourceModal'

export default class AttachResourceModal extends Component {
  getInitialState () {
    const node = this.props.node
    const doc = node.getDocument()
    const availableResources = new Set(doc.root.resources)
    // remove already attached resources
    this.props.node.resources.forEach(id => {
      availableResources.delete(id)
    })
    return {
      selectedId: null,
      availableResources: Array.from(availableResources).map(id => doc.get(id))
    }
  }

  render () {
    const { selectedId, availableResources } = this.state
    const el = $$(Modal, { title: 'Attach Resource', size: 'large', confirmLabel: 'Ok', disableConfirm: !selectedId })
    el.addClass('sc-attach-resource-modal')

    const form = $$(Form)
    if (availableResources.length > 0) {
      form.append(
        $$(FormRow, { label: 'Choose an existing Resource' },
          $$('select', { class: 'se-resource-select', autofocus: true, onchange: this._onSelect },
            $$('option', { value: '' }, ''),
            ...availableResources.map(resource => this.renderResourceOption(resource))
          ).ref('select')
        )
      )
    }
    form.append(
      $$(HorizontalStack, {},
        $$(Button, { style: 'plain', size: 'small', class: 'se-add-new-resource', onclick: this._onClickNewResource }, 'Add a new Resource')
      )
    )
    el.append(form)
    return el
  }

  renderResourceOption (resourceNode) {
    const option = $$('option', { class: 'se-resource', value: resourceNode.id },
      resourceNode.title || resourceNode.href
    ).ref(resourceNode.id)
    if (this.state.selectedId === resourceNode.id) {
      option.setAttribute('selected', true)
    }
    return option
  }

  _onSelect () {
    const val = this.refs.select.val()
    this.extendState({
      selectedId: val
    })
  }

  _onClickNewResource (event) {
    domHelpers.stopAndPrevent(event)
    return this.send('requestModal', () => {
      return $$(ResourceModal)
    }).then(modal => {
      if (!modal) return
      const api = this.context.api
      const resourceNode = api.addResource(modal.state.data)
      api.attachResource(this.props.node.id, resourceNode.id)
    })
  }
}
