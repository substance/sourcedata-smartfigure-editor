import { $$ } from 'substance'
import { NodeComponent } from 'substance-texture'
import FigurePanelThumbnail from './FigurePanelThumbnail'

// EXPERIMENTAL: trying to provide a good auto layout based on width/height ratio
const HORIZONTAL = 2.5
const VERTICAL = 0.75

export default class AutoLayout extends NodeComponent {
  getInitialState () {
    return { dimensions: null }
  }

  // Note: only doing explicit rerender because of async layout computation
  shouldRerender () {
    return false
  }

  didMount () {
    super.didMount()

    // start an initial layout
    this._layout()
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
      el = $$('div', { class: 'sm-hidden' })
    }
    return el
  }

  _onNodeUpdate (change) {
    // Only rerender this when 'panels' have changed, as opposed to other properties such as title
    if (change.hasUpdated([this.props.node.id, 'panels'])) {
      this._layout()
    }
  }

  _renderImg (image) {
    const urlResolver = this.context.urlResolver
    let url = image.href
    if (urlResolver) {
      url = urlResolver.resolveUrl(url)
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
