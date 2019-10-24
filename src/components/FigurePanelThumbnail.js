import { Component, $$, domHelpers, ImageComponent } from 'substance'
import getLabel from './_getLabel'

export default class FigurePanelThumbnail extends Component {
  render () {
    const panel = this.props.node
    const image = panel.resolve('image')
    const label = getLabel(panel)
    return $$('button', { class: 'sc-smart-figure-panel-thumbnail', title: label },
      $$('div', { class: 'se-label' }, label),
      $$(ImageComponent, { node: image })
    ).on('click', this._onClick)
  }

  _onClick (event) {
    const panel = this.props.node
    domHelpers.stopAndPrevent(event)
    this.send('selectItem', panel)
    // TODO: this should not be necessary
    this.send('scrollTo', { nodeId: panel.id })
  }
}
