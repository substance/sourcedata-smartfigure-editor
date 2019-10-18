import { BasicEditorApi, documentHelpers } from 'substance'

export default class SmartFigureApi extends BasicEditorApi {
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
      this._selectPanel(tx, newPanel)
    })
  }

  removePanel (panelId) {
    const doc = this.getDocument()
    const panel = doc.get(panelId)
    const figure = panel.getParent()
    if (!figure) throw new Error('Figure does not exist')
    const pos = panel.getPosition()
    this.editorSession.transaction(tx => {
      documentHelpers.removeAt(tx, [figure.id, 'panels'], pos)
      documentHelpers.deepDeleteNode(tx, panel.id)
      tx.setSelection(null)
    })
  }

  movePanel (panelId, direction) {
    const doc = this.getDocument()
    const panel = doc.get(panelId)
    const figure = panel.getParent()
    if (!figure) throw new Error('Figure does not exist')
    const pos = panel.getPosition()
    const diff = direction === 'up' ? -1 : +1
    this.editorSession.transaction(tx => {
      documentHelpers.removeAt(tx, [figure.id, 'panels'], pos)
      documentHelpers.insertAt(tx, [figure.id, 'panels'], pos + diff, panelId)
    })
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

  selectPanel (panel) {
    this._selectPanel(this.editorSession, panel)
  }

  _selectPanel (tx, panel) {
    tx.setSelection({
      type: 'custom',
      nodeId: panel.id,
      customType: 'panel'
    })
  }
}
