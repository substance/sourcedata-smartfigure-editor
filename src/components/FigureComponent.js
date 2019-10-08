import { Component, $$ } from 'substance'
import { SectionLabel, renderProperty } from 'substance-texture'
// import FigurePanelPreview from './FigurePanelPreview'
import FigurePanelComponent from './FigurePanelComponent'

export default class FigureComponent extends Component {
  render () {
    const node = this.props.node
    const document = node.getDocument()
    const panels = node.resolve('panels')
    const el = $$('div', { class: 'sc-figure' })

    for (let idx = 0; idx < panels.length; idx++) {
      const panel = panels[idx]
      el.append(
        $$(FigurePanelComponent, { node: panel })
      )
    }

    el.append(
      $$(SectionLabel, { label: 'Additional Information' }),
      renderProperty(this, document, [node.id, 'additionalInformation'], { placeholder: 'Enter additional information' }).addClass('se-additional-information')
    )

    return el
  }
}
