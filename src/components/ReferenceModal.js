import { Component, $$, Form, FormRow, Modal, Input } from 'substance'

export default class ReferenceModal extends Component {
  getInitialState () {
    return {
      data: {
        content: ''
      }
    }
  }

  render () {
    return $$(Modal, { title: 'Create Reference', size: 'medium', confirmLabel: 'Create Reference' },
      $$(Form, {},
        $$(FormRow, { label: 'Content:' },
          $$(Input, { value: '', autofocus: true, oninput: this._updateContent }).ref('content')
        )
      )
    ).addClass('sc-reference-modal')
  }

  _updateContent () {
    this.state.data.content = this.refs.content.val()
  }
}
