import { Component, $$ } from 'substance'

export default class Section extends Component {
  render () {
    const { name, label, children, hideIfEmpty } = this.props
    const el = $$('div', { class: 'sc-section' })
    if (name) {
      el.addClass(`sm-${name}`)
      el.setAttribute('data-section', name)
    }
    if (label) {
      el.append($$('div', { class: 'se-section-label' }, label))
    }
    if (children && children.length > 0) {
      el.append(children)
    }
    if (hideIfEmpty && children.length === 0) {
      el.addClass('sm-hidden')
    }
    return el
  }
}
