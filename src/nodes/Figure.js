import { DocumentNode, CHILDREN, TEXT, CONTAINER, STRING } from 'substance'
import { RICH_TEXT_ANNOS } from 'substance-texture'

export default class Figure extends DocumentNode {
  _initialize (...args) {
    super._initialize(...args)

    // TODO: is there a better alternative to this?
    this._set('state', {
      currentPanelIndex: 0
    })
  }

  get state () {
    return this.get('state')
  }

  getCurrentPanelIndex () {
    let currentPanelIndex = 0
    if (this.state) {
      currentPanelIndex = this.state.currentPanelIndex
    }
    return currentPanelIndex
  }

  getPanels () {
    return this.resolve('panels')
  }

  // NOTE: we are using structure of active panel as template for new one,
  // currently we are replicating the structure of metadata fields
  getTemplateFromCurrentPanel () {
    const currentIndex = this.getCurrentPanelIndex()
    const firstPanel = this.getPanels()[currentIndex]
    return {
      metadata: firstPanel.resolve('metadata').map(metadataField => (
        { type: 'metadata-field', name: metadataField.name, value: '' }
      ))
    }
  }
}

Figure.schema = {
  type: 'figure',
  title: TEXT(...RICH_TEXT_ANNOS),
  panels: CHILDREN('figure-panel'),
  additionalInformation: CONTAINER({
    nodeTypes: ['paragraph'],
    defaultTextType: 'paragraph'
  }),
  layout: STRING
}
