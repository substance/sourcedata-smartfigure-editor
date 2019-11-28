import { CollectionItemLabelManager } from 'substance'

export default class FilesLabelManager extends CollectionItemLabelManager {
  getPath () {
    const doc = this.editorSession.getDocument()
    return [doc.root.id, 'files']
  }

  getItemLabel (item) {
    return `File ${item.getPosition() + 1}`
  }
}
