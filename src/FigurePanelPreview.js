import { Component, $$ } from 'substance'
import { renderNode } from 'substance-texture'

export default class FigurePanelPreview extends Component {
  render () {
    const figure = this.props.node
    const panels = figure.resolve('panels')

    const el = $$('div', { class: 'sc-figure-panel-preview' })

    for (const panel of panels) {
      const graphic = panel.resolve('content')
      el.append(
        renderNode(this, graphic)
      )
    }

    return el
  }
}
