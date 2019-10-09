import { Component, $$ } from 'substance'
import { renderProperty, ManuscriptSection } from 'substance-texture'
// import FigurePanelPreview from './FigurePanelPreview'
import FigurePanelComponent from './FigurePanelComponent'

export default class FigureComponent extends Component {
  render () {
    const node = this.props.node
    const document = node.getDocument()
    const panels = node.resolve('panels')
    const el = $$('div', { class: 'sc-figure' })

    el.append(
      $$(ManuscriptSection, { name: 'panels', label: 'Panels' })
    )

    for (let idx = 0; idx < panels.length; idx++) {
      const panel = panels[idx]
      el.append(
        $$(FigurePanelComponent, { node: panel })
      )
    }

    el.append(
      $$(ManuscriptSection, { name: 'additionalInformation', label: 'Additional Information' }),
      renderProperty(this, document, [node.id, 'additionalInformation'], { placeholder: 'Enter additional information' }).addClass('se-additional-information')
    )

    return el
  }
}
