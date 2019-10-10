import { documentHelpers } from 'substance'

export default {
  insertPanelAfter (currentPanelId, file) {
    const doc = this.getDocument()
    const currentPanel = doc.get(currentPanelId)
    const figure = currentPanel.getParent()
    if (!figure) throw new Error('Figure does not exist')
    const pos = figure.panels.indexOf(currentPanel.id)
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
  _selectPanel (tx, panel) {
    tx.setSelection({
      type: 'custom',
      nodeId: panel.id,
      customType: 'panel'
    })
  }
}
