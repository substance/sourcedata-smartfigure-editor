import { documentHelpers } from 'substance'

export default {
  insertPanelAfter (currentPanelId, file) {
    const doc = this.getDocument()
    const currentPanel = doc.get(currentPanelId)
    const figure = currentPanel.getParent()
    if (!figure) throw new Error('Figure does not exist')
    const pos = currentPanel.getPosition()
    const href = this.archive.addAsset(file)
    const insertPos = pos + 1
    const template = currentPanel.getTemplate()
    template.image.href = href
    template.image.mimeType = file.type
    this.editorSession.transaction(tx => {
      const newPanel = documentHelpers.createNodeFromJson(tx, template)
      documentHelpers.insertAt(tx, [figure.id, 'panels'], insertPos, newPanel.id)
      this._selectPanel(tx, newPanel)
    })
  },
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
  },
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
  },
  _selectPanel (tx, panel) {
    tx.setSelection({
      type: 'custom',
      nodeId: panel.id,
      customType: 'panel'
    })
  }
}
