import { Component, $$ } from 'substance'

export default class TwoColumnLayout extends Component {
  render () {
    return $$('div', { class: 'sc-two-column-layout' },
      $$('div', { class: 'se-column sm-left' },
        this.props.children[0]
      ),
      $$('div', { class: 'se-column sm-right' },
        this.props.children[1]
      )
    )
  }
}
