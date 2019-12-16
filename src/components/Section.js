import { Component, $$ } from 'substance'

// NOTE: I have a feeling the section component is misplaced in some areas currently
// e.g. using it as a panel label ("A") or in the table of contents "Additional Information"
// I suggest to flatten things, and use Heading in 

export default class Section extends Component {
  render () {
    const { name, label, children } = this.props
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
    return el
  }
}
