import { CollectionItemLabelManager } from 'substance'

export default class ReferencesLabelManager extends CollectionItemLabelManager {
  getPath () {
    const doc = this.editorSession.getDocument()
    return [doc.root.id, 'references']
  }

  getItemLabel (item) {
    return `Reference ${item.getPosition() + 1}`
  }
}
