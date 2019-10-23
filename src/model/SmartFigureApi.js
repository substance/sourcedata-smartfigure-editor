import { BasicEditorApi, documentHelpers } from 'substance'

export default class SmartFigureApi extends BasicEditorApi {
  addAuthor (data) {
    this.editorSession.transaction(tx => {
      const root = tx.getDocument().root
      const author = tx.create({
        type: 'author',
        firstName: data.firstName,
        lastName: data.lastName
      })
      documentHelpers.append(tx, [root.id, 'authors'], author.id)
      this._selectItem(tx, author)
    })
  }

  insertPanelAfter (currentPanelId, file) {
    const doc = this.getDocument()
    const currentPanel = doc.get(currentPanelId)
    const figure = currentPanel.getParent()
    if (!figure) throw new Error('Figure does not exist')
    const pos = currentPanel.getPosition()
    const src = this.archive.addAsset(file)
    const insertPos = pos + 1
    const template = currentPanel.getTemplate()
    template.image.src = src
    template.image.mimeType = file.type
    this.editorSession.transaction(tx => {
      const newPanel = documentHelpers.createNodeFromJson(tx, template)
      documentHelpers.insertAt(tx, [figure.id, 'panels'], insertPos, newPanel.id)
      this._selectItem(tx, newPanel)
    })
  }

  removePanel (panelId) {
    super.removeAndDeleteNode(panelId)
  }

  movePanel (panelId, direction) {
    super.moveNode(panelId, direction)
  }

  replacePanelImage (panelId, file) {
    const doc = this.getDocument()
    const panel = doc.get(panelId)
    const image = panel.resolve('image')
    const articleSession = this.editorSession
    const newPath = this.archive.replaceAsset(image.src, file)
    articleSession.transaction(tx => {
      tx.set([image.id, 'src'], newPath)
    })
  }

  selectItem (item) {
    this._selectItem(this.editorSession, item)
  }

  _selectItem (tx, node) {
    tx.setSelection({
      type: 'custom',
      nodeId: node.id,
      customType: node.type
    })
  }
}
