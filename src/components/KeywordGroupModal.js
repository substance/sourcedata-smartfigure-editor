import { Component, $$, Form, FormRow, Modal, Input, Button, domHelpers } from 'substance'

export default class KeywordGroupModal extends Component {
  getInitialState () {
    let name = ''
    let keywords = ['']
    if (this.props.node) {
      const node = this.props.node
      name = node.name
      keywords = node.resolve('keywords').map(node => node.getText())
    }
    return { name, keywords }
  }

  render () {
    const { name, keywords } = this.state
    return $$(Modal, { title: 'Create Keyword Group', size: 'small', confirmLabel: 'Create' },
      $$(Form, {},
        $$(FormRow, { label: 'Name:' },
          $$(Input, { value: name, autofocus: true }).ref('name')
        ),
        $$(FormRow, { label: 'Keywords:' },
          ...keywords.map(kwd => {
            return $$(Input, { value: kwd }).addClass('se-keyword')
          })
        ),
        $$(FormRow, {},
          $$(Button, {}, 'Add Keyword').on('click', this._onClickAddKeyword)
        )
      )
    ).addClass('sc-keyword-group-modal')
  }

  _onClickAddKeyword (e) {
    domHelpers.stopAndPrevent(e)
    const newState = this.getData()
    newState.keywords.push('')
    this.setState(newState)
  }

  getData () {
    const name = this.refs.name.val()
    const keywords = this.findAll('.se-keyword').map(input => input.val())
    return { name, keywords }
  }
}
