import { Component, $$ } from 'substance'
// import FigurePanelPreview from './FigurePanelPreview'
import FigurePanelComponent from './FigurePanelComponent'

export default class FigurePanels extends Component {
  render () {
    const node = this.props.node
    const panels = node.resolve('panels')
    const el = $$('div', { class: 'sc-figure-panels' })

    for (let idx = 0; idx < panels.length; idx++) {
      const panel = panels[idx]
      el.append(
        $$(FigurePanelComponent, { node: panel })
      )
    }

    return el
  }
}
