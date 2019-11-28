import { Component, $$ } from 'substance'

export default class CheckboxItem extends Component {
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
