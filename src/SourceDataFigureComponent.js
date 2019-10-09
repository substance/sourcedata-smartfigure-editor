import { Component, $$ } from 'substance'
import FigurePanelPreview from './FigurePanelPreview'
import FigurePanelComponent from './FigurePanelComponent'

export default class SourceDataFigureComponent extends Component {
  render () {
    const figure = this.props.node
    const panels = figure.resolve('panels')
    const el = $$('div', { class: 'sc-figure' })

    el.append(
      $$(FigurePanelPreview, this.props)
    )

    for (const panel of panels) {
      el.append(
        $$(FigurePanelComponent, { node: panel })
      )
    }

    return el
  }
}
