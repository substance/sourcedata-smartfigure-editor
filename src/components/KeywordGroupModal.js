import {
  Component, $$, without, Form, FormRow,
  Modal, Input, MultiInput, uuid
} from 'substance'

export default class KeywordGroupModal extends Component {
  getActionHandlers () {
    return {
      addMultiInputItem: this._addMultiInputItem,
      updateMultiInputItem: this._updateMultiInputItem,
      removeMultiInputItem: this._removeMultiInputItem
    }
  }

  getInitialState () {
    let name = ''
    let keywords
    if (this.props.node) {
      const node = this.props.node
      name = node.name
      keywords = node.resolve('keywords')
    } else {
      keywords = [{ id: uuid('keyword-group'), content: '' }]
    }
    return { name, keywords }
  }

  render () {
    const { name, keywords } = this.state
    const title = this.props.mode === 'edit' ? 'Edit Keyword Group' : 'Create Keyword Group'
    const confirmLabel = this.props.mode === 'edit' ? 'Update' : 'Create'
    const values = keywords.map(kwd => kwd.content)

    return $$(Modal, { title, size: 'small', confirmLabel },
      $$(Form, {},
        $$(FormRow, { label: 'Name' },
          $$(Input, { value: name, autofocus: true }).ref('name')
        ),
        $$(FormRow, { label: 'Keywords' },
          $$(MultiInput, { name: 'keywords', value: values, addLabel: 'Add Keyword' }).ref('keywords')
        ).addClass('se-keywords')
      )
    ).addClass('sc-keyword-group-modal')
  }

  _addMultiInputItem () {
    const newState = this.getData()
    newState.keywords.push({ id: uuid('keyword-group'), content: '' })
    this.setState(newState)
  }

  _updateMultiInputItem (name, idx, value) {
    this.state[name][idx].content = value
  }

  _removeMultiInputItem (name, idx) {
    const newState = this.getData()
    const { keywords } = this.state
    const kwd = keywords[idx]
    newState.keywords = without(keywords, kwd)
    this.setState(newState)
  }

  getData () {
    const name = this.refs.name.val()
    const keywordsEl = this.refs.keywords
    const keywords = keywordsEl.findAll('input').map(input => {
      return {
        type: 'keyword',
        id: input.getAttribute('data-id'),
        content: input.val()
      }
    })
    return { name, keywords }
  }
}
