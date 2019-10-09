import { DefaultDOMElement, $$ } from 'substance'
import { findAllChildren } from 'substance-texture'

export default class PanelLayout {
  constructor (htmlStr) {
    const table = DefaultDOMElement.parseSnippet(htmlStr, 'html')
    if (!table.is('table')) throw new Error('Figure layout must be given as HTML table')
    this._table = table
    this._ncols = table.findAll('tr').reduce((cellCount, trEl) => {
      const tdEls = findAllChildren(trEl, 'td')
      return Math.max(cellCount, tdEls.length)
    }, 0)
  }

  render (tdEls) {
    return this._renderLayoutElement(this._table, tdEls)
  }

  getNcols () {
    return this._ncols
  }

  _renderLayoutElement (layoutEl, tdEls) {
    const el = $$(layoutEl.tagName)
    const attributes = layoutEl.getAttributes()
    for (const [key, value] of attributes.entries()) {
      el.setAttribute(key, value)
    }
    if (layoutEl.tagName === 'td') tdEls.push(el)
    el.append(
      layoutEl.getChildren().map(child => this._renderLayoutElement(child, tdEls))
    )
    return el
  }
}
