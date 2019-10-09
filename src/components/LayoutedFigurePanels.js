import { Component, $$, DefaultDOMElement } from 'substance'
import { findAllChildren } from 'substance-texture'
import FigurePanelPreview from './FigurePanelPreview'

export default class LayoutedFigurePanels extends Component {
  constructor (...args) {
    super(...args)

    this._layout = this._initializeLayout()
  }

  render () {
    const figure = this.props.figure
    const tdEls = []
    const el = $$('div', { class: 'sc-layouted-figure-panels' })
    const table = this._layout.render(tdEls)
    const L = figure.panels.length
    while (tdEls.length < figure.panels.length) {
      this._expandTable(table, tdEls)
    }
    const panels = figure.resolve('panels')
    for (let idx = 0; idx < L; idx++) {
      const tdEl = tdEls[idx]
      const panel = panels[idx]
      tdEl.append(
        $$(FigurePanelPreview, { panel }).ref(panel.id)
      )
    }
    el.append(table)
    return el
  }

  _expandTable (table, tdEls) {
    const ncols = this._layout.getNcols()
    const tr = $$('tr')
    for (let idx = 0; idx < ncols; idx++) {
      const tdEl = $$('td')
      tr.append(tdEl)
      tdEls.push(tdEl)
    }
    table.append(tr)
  }

  _initializeLayout () {
    const { figure } = this.props
    const layoutStr = figure.getLayout()
    const layout = new Layout(layoutStr)
    return layout
  }
}

class Layout {
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
