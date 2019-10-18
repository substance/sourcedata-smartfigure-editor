import { Component, $$, domHelpers } from 'substance'
import LayoutedFigurePanels from './LayoutedFigurePanels'
import Section from './Section'

export default class SmartFigureTOC extends Component {
  render () {
    const document = this.props.document
    const figure = document.root
    const el = $$('div', { class: 'sc-smart-figure-toc' })
    el.append(
      $$(_TOCItem, { scrollTarget: { section: 'title' } },
        $$(Section, { name: 'title', label: 'Title' })
      )
    )
    el.append(
      $$(_TOCItem, { scrollTarget: { section: 'panels' } },
        $$(Section, { name: 'panels', label: 'Panels' },
          $$(LayoutedFigurePanels, { node: figure }).addClass('sm-plain')
        )
      )
    )
    el.append(
      $$(_TOCItem, { scrollTarget: { section: 'additionalInformation' } },
        $$(Section, { name: 'additionalInformation', label: 'Additional Information' })
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
