import { Component, $$ } from 'substance'
import LayoutedFigurePanels from './LayoutedFigurePanels'

export default class FigurePackageTOC extends Component {
  render () {
    const document = this.props.document
    const figure = document.find('body > figure')
    const el = $$('div', { class: 'sc-figure-package-toc' })
    el.append(
      $$(LayoutedFigurePanels, { figure })
    )
    return el
  }
}
