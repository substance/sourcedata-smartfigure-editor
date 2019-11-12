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

  insertFile (fileName, file) {
    return this.insertFileAfter(fileName, file)
  }

  insertFileAfter (fileName, file, currentFileId) {
    const doc = this.getDocument()
    const root = doc.root
    let insertPos = root.files.length
    if (currentFileId) {
      const currentFileNode = doc.get(currentFileId)
      insertPos = currentFileNode.getPosition() + 1
    }
    const fileData = {
      name: fileName,
      type: file.type
    }
    const src = this.archive.addAsset(fileData, file)
    this.editorSession.transaction(tx => {
      const newFileNode = documentHelpers.createNodeFromJson(tx, {
        type: 'file',
        src,
        legend: [{ type: 'paragraph' }]
      })
      documentHelpers.insertAt(tx, [root.id, 'files'], insertPos, newFileNode.id)
      this._selectItem(tx, newFileNode)
    })
  }

  insertResource (url) {
    return this.insertResourceAfter(url)
  }

  insertResourceAfter (url, currentFileId) {
    const doc = this.getDocument()
    const root = doc.root
    let insertPos = root.files.length
    if (currentFileId) {
      const currentFileNode = doc.get(currentFileId)
      insertPos = currentFileNode.getPosition() + 1
    }
    this.editorSession.transaction(tx => {
      const newFileNode = documentHelpers.createNodeFromJson(tx, {
        type: 'file',
        url,
        remote: true,
        legend: [{ type: 'paragraph' }]
      })
      documentHelpers.insertAt(tx, [root.id, 'files'], insertPos, newFileNode.id)
      this._selectItem(tx, newFileNode)
    })
  }
}
