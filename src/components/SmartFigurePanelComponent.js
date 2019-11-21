import { SelectableNodeComponent, $$, domHelpers, renderProperty } from 'substance'
import Section from './Section'
import getLabel from './_getLabel'
import StructuredKeywordComponent from './StructuredKeywordComponent'
import AttachedFilesComponent from './AttachedFilesComponent'

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
      $$(Section, { label: 'Legend' },
        renderProperty(this, document, [node.id, 'legend'], { placeholder: 'Enter legend' }).addClass('se-legend')
      )
    )

    if (node.keywords && node.keywords.length > 0) {
      const keywords = node.resolve('keywords')
      const keywordSection = $$(Section, { label: 'Keywords' })
      for (const keywordGroup of keywords) {
        keywordSection.append(
          $$(StructuredKeywordComponent, { node: keywordGroup }).ref(keywordGroup.id)
        )
      }
      el.append(keywordSection)
    }

    if (node.files && node.files.length > 0) {
      el.append(
        $$(Section, { label: 'Files' },
          $$(AttachedFilesComponent, { node })
        )
      )
    }

    el.on('mousedown', this._onMousedown)

    return el
  }

  _onMousedown (e) {
    domHelpers.stopAndPrevent(e)
    this.send('selectItem', this.props.node)
  }
}
