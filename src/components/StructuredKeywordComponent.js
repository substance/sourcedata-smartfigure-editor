import { SelectableNodeComponent, $$, domHelpers } from 'substance'

export default class StructuredKeywordComponent extends SelectableNodeComponent {
  render () {
    const node = this.props.node
    // Note: using a button so that the browser treats it as UI element, not content (e.g. re selections)
    const el = $$('button', { class: 'sc-structured-keyword' })
    if (this.state.selected) el.addClass('sm-selected')

    el.append(
      $$('span', { class: 'se-name' }, node.name)
    )

    el.append(
      $$('span', { class: 'se-values' },
        ...node.resolve('keywords').map(kwd => {
          return $$('span', { class: 'se-value' }, kwd.content)
        })
      )
    )

    el.on('mousedown', this._onMousedown)

    return el
  }

  _onMousedown (e) {
    domHelpers.stopAndPrevent(e)
    this.send('selectItem', this.props.node)
  }
}
