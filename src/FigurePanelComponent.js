import { Component, $$ } from 'substance'
import { renderProperty } from 'substance-texture'

export default class FigurePanelComponent extends Component {
  render () {
    const node = this.props.node
    const document = node.getDocument()
    const SectionLabel = this.getComponent('section-label')

    const el = $$('div')
      .attr('data-id', node.id)

    el.append(
      $$(SectionLabel, { label: 'title-label' }),
      renderProperty(this, document, [node.id, 'title'], { placeholder: this.getLabel('title-placeholder') }).addClass('se-title'),
      $$(SectionLabel, { label: 'legend-label' }),
      renderProperty(this, document, [node.id, 'legend'], { placeholder: this.getLabel('legend-placeholder') }).addClass('se-legend')
    )

    return el
  }
}
