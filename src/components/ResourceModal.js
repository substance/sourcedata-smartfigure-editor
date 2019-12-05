import { Component, $$, Form, FormRow, Modal, Input } from 'substance'

export default class ResourceModal extends Component {
  getInitialState () {
    return {
      data: {
        href: ''
      }
    }
  }

  render () {
    return $$(Modal, { title: 'Create Resource', size: 'medium', confirmLabel: 'Create Resource' },
      $$(Form, {},
        $$(FormRow, { label: 'File-URL:' },
          $$(Input, { value: '', autofocus: true, oninput: this._updateHref }).ref('href')
        )
      )
    ).addClass('sc-resource-modal')
  }

  _updateHref () {
    this.state.data.href = this.refs.href.val()
  }
}
