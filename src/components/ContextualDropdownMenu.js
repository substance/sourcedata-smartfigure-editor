import { DropdownMenu, $$, Button, Icon, HorizontalSpace, platform } from 'substance'
import _getContext from './_getContext'

export default class ContextualDropdownMenu extends DropdownMenu {
  render () {
    const { noIcons } = this.props

    const buttonProps = this._getToggleButtonProps()
    const { label, disabled } = buttonProps

    const el = $$(Button, buttonProps).addClass('sc-contextual-dropdown-menu sc-dropdown-menu sc-menu')
    if (noIcons) {
      el.addClass('sm-no-icons')
    }
    if (disabled) {
      el.addClass('sm-hidden')
    } else {
      el.on('click', this._onClick)
    }
    el.append(
      label,
      $$(HorizontalSpace),
      $$(Icon, { icon: 'caret-down' })
    )
    return el
  }

  _getToggleButtonProps () {
    const { style, size } = this.props
    const context = _getContext(this.context.editorState.selectionState)
    // TODO: rethink this, i.e. some contexts such as 'text' should not enable the contextual dropdown
    const disabled = !context || context === 'text'
    const label = context ? this.getLabel(context) : ''
    return {
      dropdown: true,
      disabled,
      style: style || 'plain',
      size,
      label
    }
  }

  _onClick () {
    const context = _getContext(this.context.editorState.selectionState)
    const menuSpec = this.context.config.getToolPanel(`context-menu:${context}`)
    if (menuSpec && platform.inBrowser) {
      let { x, y, height, width } = this.getNativeElement().getBoundingClientRect()
      y = y + height + 5
      x = x + width / 2
      this.send('requestPopover', {
        requester: this,
        desiredPos: { x, y },
        content: menuSpec
      })
    }
  }
}
