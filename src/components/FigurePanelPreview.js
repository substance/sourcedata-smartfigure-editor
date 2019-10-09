import { Component, $$, domHelpers } from 'substance'
import { getLabel } from 'substance-texture'

export default class FigurePanelPreview extends Component {
  render () {
    const panel = this.props.panel
    const urlResolver = this.context.urlResolver
    const image = panel.resolve('image')
    let url = image.href
    if (urlResolver) {
      url = urlResolver.resolveUrl(url)
    }
    const label = getLabel(panel)
    return $$('button', { class: 'sc-figure-panel-preview', title: label },
      $$('div', { class: 'se-label' }, label),
      $$('img', { src: url })
    ).on('click', this._onClick)
  }

  _onClick (event) {
    const panel = this.props.panel
    domHelpers.stopAndPrevent(event)
    this.send('scrollTo', { nodeId: panel.id })
  }
}
