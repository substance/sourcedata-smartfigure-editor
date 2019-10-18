import { Component, $$ } from 'substance'

export default class Section extends Component {
  render () {
    const { name, label, children } = this.props
    return $$('div', { class: `sc-section sm-${name}`, 'data-section': name },
      $$('div', { class: 'se-section-label' }, label),
      children
    )
  }
}
