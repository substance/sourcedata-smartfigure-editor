import { SelectableNodeComponent, $$, domHelpers, renderProperty } from 'substance'
import Section from './Section'
import getLabel from './_getLabel'

export default class FigurePanelComponent extends SelectableNodeComponent {
  render () {
    const node = this.props.node
    const document = node.getDocument()

    const el = $$('div', { class: 'sc-smart-figure-panel', 'data-id': node.id })
    if (this.state.selected) {
      el.addClass('sm-selected')
    }

    el.append(
      $$(Section, { label: getLabel(node) })
    )

    el.append(
      renderProperty(this, document, [node.id, 'image']).ref('image')
    )

    el.append(
      $$(Section, { label: 'Legend' }),
      renderProperty(this, document, [node.id, 'legend'], { placeholder: 'Enter legend' }).addClass('se-legend')
    )

    el.on('click', this._onClick)

    return el
  }

  _onClick (e) {
    domHelpers.stopAndPrevent(e)
    this.send('selectItem', this.props.node)
  }
}
