import { Component, $$, domHelpers } from 'substance'
import LayoutedFigurePanels from './LayoutedFigurePanels'
import { SectionLabel } from 'substance-texture'

export default class FigurePackageTOC extends Component {
  render () {
    const document = this.props.document
    const figure = document.find('body > figure')
    const el = $$('div', { class: 'sc-figure-package-toc' })
    el.append(
      $$(_TOCItem, { scrollTarget: { section: 'title' } },
        $$(SectionLabel, { label: 'Title' })
      )
    )
    el.append(
      $$(_TOCItem, { scrollTarget: { section: 'panels' } },
        $$(SectionLabel, { label: 'Panels' }),
        $$(LayoutedFigurePanels, { node: figure }).addClass('sm-plain')
      )
    )
    el.append(
      $$(_TOCItem, { scrollTarget: { section: 'additionalInformation' } },
        $$(SectionLabel, { label: 'Additional Information' })
      )
    )
    return el
  }
}

class _TOCItem extends Component {
  render () {
    const el = $$('div', { class: 'se-toc-item' })
    el.append(this.props.children)
    el.on('click', this._onClick)
    return el
  }

  _onClick (e) {
    domHelpers.stopAndPrevent(e)
    this.send('scrollTo', this.props.scrollTarget)
  }
}
