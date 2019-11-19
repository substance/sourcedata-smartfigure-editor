import {
  Component, $$, domHelpers, without,
  Form, FormRow, Modal, Input, Button, Icon, HorizontalStack
} from 'substance'

export default class KeywordGroupModal extends Component {
  getInitialState () {
    let name = ''
    let keywords = [{ content: '' }]
    if (this.props.node) {
      const node = this.props.node
      name = node.name
      keywords = node.resolve('keywords')
    }
    return { name, keywords }
  }

  render () {
    const { name, keywords } = this.state
    const title = this.props.mode === 'edit' ? 'Edit Keyword Group' : 'Create Keyword Group'
    const confirmLabel = this.props.mode === 'edit' ? 'Update' : 'Create'

    return $$(Modal, { title, size: 'large', confirmLabel },
      $$(Form, {},
        $$(FormRow, { label: 'Name:' },
          $$(Input, { value: name, autofocus: true }).ref('name')
        ),
        $$(FormRow, { label: 'Keywords:' },
          ...keywords.map(kwd => {
            const inputEl = $$(Input, { value: kwd.content }).addClass('se-keyword')
            if (kwd.id) {
              inputEl.setAttribute('data-id', kwd.id)
            }
            return $$(HorizontalStack, {},
              inputEl,
              $$(Button, {}, $$(Icon, { icon: 'times' })).on('click', this._onClickRemoveKeyword.bind(this, kwd))
            )
          }),
          $$(HorizontalStack, {},
            $$('div'),
            $$(Button, {}, $$(Icon, { icon: 'plus' })).on('click', this._onClickAddKeyword)
          )
        // })
          // $$(Button, {}, $$(Icon, { icon: 'plus' })).on('click', this._onClickAddKeyword)
        ).addClass('se-keywords')
      )
    ).addClass('sc-keyword-group-modal')
  }

  _onClickAddKeyword (e) {
    domHelpers.stopAndPrevent(e)
    const newState = this.getData()
    newState.keywords.push({ content: '' })
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
