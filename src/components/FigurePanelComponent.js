import { Component, $$ } from 'substance'
import { renderProperty, getLabel } from 'substance-texture'

export default class FigurePanelComponent extends Component {
  render () {
    const node = this.props.node
    const document = node.getDocument()
    const SectionLabel = this.getComponent('section-label')

    const el = $$('div', { class: 'sc-figure-panel', 'data-id': node.id })

    el.append(
      $$(SectionLabel, { label: getLabel(node) })
    )

    el.append(
      renderProperty(this, document, [node.id, 'image'])
    )

    el.append(
      $$(SectionLabel, { label: 'Legend' }),
      renderProperty(this, document, [node.id, 'legend'], { placeholder: this.getLabel('legend-placeholder') }).addClass('se-legend')
    )

    return el
  }
}
