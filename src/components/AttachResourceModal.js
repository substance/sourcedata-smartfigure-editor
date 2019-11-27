import { Component, $$, Form, FormRow, Modal, renderProperty } from 'substance'

export default class AttachResourceModal extends Component {
  getInitialState () {
    const { node } = this.props
    const attachedResources = node.resources.slice()
    const allResources = node.getDocument().root.resources.slice()
    const resources = new Map()
    attachedResources.forEach(id => {
      resources.set(id, { attached: true })
    })
    allResources.forEach(id => {
      if (!resources.has(id)) {
        resources.set(id, { attached: false })
      }
    })
    return { resources }
  }

  render () {
    const resources = this.state.resources
    const el = $$(Modal, { title: 'Attach Resource', size: 'large', confirmLabel: 'Ok' })
    el.addClass('sc-attach-resource-modal')

    const form = $$(Form)
    const resourcesEl = $$(FormRow, { label: 'Resources' })
    for (const [id, entry] of resources) {
      resourcesEl.append(
        $$(CheckboxItem, { selected: entry.attached, oninput: this._onToggleItem.bind(this, id) },
          this._renderResource(id)
        ).ref(id)
      )
    }

    form.append(resourcesEl)
    el.append(form)

    return el
  }

  _renderResource (id) {
    const doc = this.props.node.getDocument()
    const node = doc.get(id)
    return $$('div', { class: 'se-resource' },
      renderProperty(this, node.getDocument(), [node.id, 'title'], { readOnly: true, inline: true }),
      ': ',
      renderProperty(this, node.getDocument(), [node.id, 'href'], { readOnly: true, inline: true })
    )
  }

  _onToggleItem (id) {
    const newResources = new Map(this.state.resources)
    const newEntry = this.state.resources.get(id)
    newEntry.attached = !newEntry.attached
    newResources.set(id, newEntry)
    this.extendState({ resources: newResources })
  }
}

class CheckboxItem extends Component {
  render () {
    const { selected } = this.props
    const el = $$('div', { class: 'sc-checkbox-item' })
    const checkbox = $$('input', { class: 'se-checkbox', type: 'checkbox' }).ref('checkbox')
    if (selected) {
      checkbox.setAttribute('checked', true)
    }
    const value = $$('div', { class: 'se-value' }, ...this.props.children)
    el.append(
      checkbox,
      value
    )
    return el
  }

  isSelected () {
    return this.refs
  }
}
