import { CollectionItemLabelManager } from 'substance'

export default class ResourcesLabelManager extends CollectionItemLabelManager {
  getPath () {
    const doc = this.editorSession.getDocument()
    return [doc.root.id, 'resources']
  }

  getItemLabel (item) {
    return `Resource ${item.getPosition() + 1}`
  }
}
