import { $$, Component } from 'substance'
import FigurePanelThumbnail from './FigurePanelThumbnail'

// EXPERIMENTAL: trying to provide a good auto layout based on width/height ratio
const HORIZONTAL = 2.5
const VERTICAL = 0.75

export default class AutoFigurePanelLayout extends Component {
  getInitialState () {
    return { dimensions: null }
  }

  // Note: only doing explicit rerender because of async layout computation
  shouldRerender () {
    return false
  }

  didMount () {
    this.context.editorState.addObserver(['document'], this._onDocumentUpdate, this, { stage: 'render' })

    // start an initial layout
    this._layout()
  }

  dispose () {
    this.context.editorState.removeObserver(this)
  }

  async _layout () {
    const panels = this.props.node.resolve('panels')
    this.el.empty().addClass('sm-hidden')
    const images = await Promise.all(panels.map(panel => this._renderImg(panel.resolve('image'))))
    const dimensions = images.map(image => {
      const w = image.width
      const h = image.height
      const ratio = w / h
      let colspan = 1
      let rowspan = 1
      if (ratio > HORIZONTAL) {
        colspan = 2
      } else if (ratio < VERTICAL) {
        rowspan = 2
      }
      return { rowspan, colspan }
    })
    this.setState({ dimensions })
    this.rerender()
  }

  render () {
    let el
    const dimensions = this.state.dimensions
    if (dimensions) {
      el = $$('table')
      // ATTENTION: hard-coded two-column layout
      el.append($$('colgroup').append(
        $$('col').setStyle('width', '50%'),
        $$('col').setStyle('width', '50%')
      ))
      const panels = this.props.node.resolve('panels')
      let colsLeft = 2
      let rowspan = 1
      let tr = $$('tr')
      for (let idx = 0; idx < panels.length; idx++) {
        const panel = panels[idx]
        const dim = dimensions[idx]
        if (dim.colspan <= colsLeft) {
          rowspan = Math.max(rowspan, dim.rowspan)
          tr.append(
            $$('td', { colspan: dim.colspan, rowspan: dim.rowspan })
              .append(
                $$(FigurePanelThumbnail, { node: panel })
              )
          )
          colsLeft -= dim.colspan
        } else {
          // insert an empty td if space is not used
          if (colsLeft > 0) {
            tr.append($$('td'))
          }
          el.append(tr)
          tr = $$('tr')
          colsLeft = 2 - rowspan + 1
          rowspan = 1
          idx--
          continue
        }
      }
      el.append(tr)
    } else {
      el = $$('div', { class: 'sc-auto-figure-panel-layout sm-hidden' })
    }
    return el
  }

  _onDocumentUpdate (change) {
    // Only rerender this when 'panels' have changed, as opposed to other properties such as title
    if (this._needsRelayout(change)) {
      this._layout()
    }
  }

  _needsRelayout (change) {
    if (change.hasUpdated([this.props.node.id, 'panels'])) return true
    const panels = this.props.node.resolve('panels')
    for (const panel of panels) {
      if (change.hasUpdated(panel.image)) return true
    }
    return false
  }

  // TODO: try to consolidate
  // this is redundant with substance.ImageComponent
  // but substantially different because of the Promise logic
  _renderImg (image) {
    const urlResolver = this.context.urlResolver
    let url = image.src
    if (urlResolver) {
      url = urlResolver.resolveUrl(url) || url
    }
    if (!url) {
      url = 'placeholder.svg'
    }
    return new Promise(resolve => {
      const $$ = this.el.createElement.bind(this.el)
      const img = $$('img').attr('src', url)
      img.on('load', () => {
        resolve(img)
      }).on('error', () => {
        return { width: 1, height: 1 }
      })
      // Note: this is necessary to trigger loading
      this.el.append(img)
    })
  }
}
