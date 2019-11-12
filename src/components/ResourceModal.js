import { Component, $$, Form, FormRow, Modal, Input } from 'substance'

export default class ResourceModal extends Component {
  render () {
    return $$(Modal, { title: 'Create Resource', size: 'small', confirmLabel: 'Create Resource' },
      $$(Form, {},
        $$(FormRow, { label: 'File-URL:' },
          $$(Input, { value: '', autofocus: true }).ref('href')
        )
      )
    ).addClass('sc-resource-modal')
  }
}
