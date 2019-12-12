import {
  Component, $$, domHelpers, without,
  Form, FormRow, Modal, Input, Button, Icon, HorizontalStack,
  uuid
} from 'substance'

export default class KeywordGroupModal extends Component {
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

    return $$(Modal, { title, size: 'small', confirmLabel },
      $$(Form, {},
        $$(FormRow, { label: 'Name' },
          $$(Input, { value: name, autofocus: true }).ref('name')
        ),
        $$(FormRow, { label: 'Keywords' },
          ...keywords.map(kwd => {
            const inputEl = $$(Input, { value: kwd.content, class: 'se-keyword', 'data-id': kwd.id }).ref(kwd.id)
            return $$(HorizontalStack, {},
              inputEl,
              $$(Button, { style: 'plain', class: 'se-remove-item' }, $$(Icon, { icon: 'trash' })).on('click', this._onClickRemoveKeyword.bind(this, kwd))
            )
          }),
          $$(HorizontalStack, {},
            $$('a', { class: 'se-add-item' }, 'Add Keyword').on('click', this._onClickAddKeyword)
          )
        ).addClass('se-keywords')
      )
    ).addClass('sc-keyword-group-modal')
  }

  _onClickAddKeyword (e) {
    domHelpers.stopAndPrevent(e)
    const newState = this.getData()
    newState.keywords.push({ id: uuid('keyword-group'), content: '' })
    this.setState(newState)
  }

  _onClickRemoveKeyword (kwd, e) {
    domHelpers.stopAndPrevent(e)
    const newState = this.getData()
    newState.keywords = without(this.state.keywords, kwd)
    this.setState(newState)
  }

  getData () {
    const name = this.refs.name.val()
    const keywords = this.findAll('.se-keyword').map(input => {
      return {
        type: 'keyword',
        id: input.getAttribute('data-id'),
        content: input.val()
      }
    })
    return { name, keywords }
  }
}
