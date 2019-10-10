import { Component, $$, domHelpers } from 'substance'
import { getLabel, NodeComponent } from 'substance-texture'

export default class FigurePanelThumbnail extends Component {
  render () {
    const panel = this.props.node
    const image = panel.resolve('image')
    const label = getLabel(panel)
    return $$('button', { class: 'sc-figure-panel-thumbnail', title: label },
      $$('div', { class: 'se-label' }, label),
      $$(_Graphic, { node: image })
    ).on('click', this._onClick)
  }

  _onClick (event) {
    const panel = this.props.node
    domHelpers.stopAndPrevent(event)
    this.send('scrollTo', { nodeId: panel.id })
  }
}

class _Graphic extends NodeComponent {
  render () {
    const node = this.props.node
    const urlResolver = this.context.urlResolver
    let url = node.href
    if (urlResolver) {
      url = urlResolver.resolveUrl(url)
    }
    return $$('img', { src: url })
  }
}
