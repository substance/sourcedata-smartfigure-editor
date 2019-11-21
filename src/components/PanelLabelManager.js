import { CollectionItemLabelManager, LATIN_LETTERS_UPPER_CASE } from 'substance'

export default class PanelLabelManager extends CollectionItemLabelManager {
  getPath () {
    const doc = this.editorSession.getDocument()
    return [doc.root.id, 'panels']
  }

  getItemLabel (item) {
    return LATIN_LETTERS_UPPER_CASE.charAt(item.getPosition())
  }
}
