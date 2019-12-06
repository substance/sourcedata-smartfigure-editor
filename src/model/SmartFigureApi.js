import {
  documentHelpers, isArrayEqual,
  BasicEditorApi, AuthorApi, AffiliationApi,
  isString
} from 'substance'

export default class SmartFigureApi extends BasicEditorApi {
  constructor (...args) {
    super(...args)

    this.extendWith(new AuthorApi())
    this.extendWith(new AffiliationApi())
  }

  addPanel (file) {
    this.insertPanel(file)
  }

  insertPanel (file, currentPanelId) {
    const doc = this.getDocument()
    const root = doc.root
    let insertPos = root.panels.length
    let template = {
      type: 'panel',
      image: { type: 'image' },
      legend: [{ type: 'paragraph' }]
    }
    if (currentPanelId) {
      const currentPanel = doc.get(currentPanelId)
      insertPos = currentPanel.getPosition() + 1
      template = currentPanel.getTemplate()
    }
    const src = this.archive.addAsset(file)
    template.image.src = src
    template.image.mimeType = file.type
    this.editorSession.transaction(tx => {
      const newPanel = documentHelpers.createNodeFromJson(tx, template)
      documentHelpers.insertAt(tx, [root.id, 'panels'], insertPos, newPanel.id)
      this._selectItem(tx, newPanel)
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

  addFile (fileName, file) {
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
    let newNodeId
    this.editorSession.transaction(tx => {
      const newFileNode = documentHelpers.createNodeFromJson(tx, {
        type: 'file',
        src,
        legend: [{ type: 'paragraph' }]
      })
      newNodeId = newFileNode.id
      documentHelpers.insertAt(tx, [root.id, 'files'], insertPos, newFileNode.id)
      this._selectItem(tx, newFileNode)
    })
    return doc.get(newNodeId)
  }

  updateFile (fileId, data) {
    const doc = this.getDocument()
    const file = doc.get(fileId)
    const oldSrc = file.src
    const newSrc = data.src
    if (oldSrc !== newSrc) {
      this.archive.renameAsset(oldSrc, newSrc)
      this.editorSession.transaction(tx => {
        tx.set([fileId, 'src'], newSrc)
        this._selectItem(tx, file)
      })
    }
  }

  addKeywordGroup (panelId, keywordGroupData) {
    return this.insertKeywordGroupAfter(panelId, keywordGroupData)
  }

  updateKeywordGroup (keywordGroupId, data) {
    this.editorSession.transaction(tx => {
      const keywordGroup = tx.get(keywordGroupId)
      const oldKeywords = keywordGroup.resolve('keywords')
      const newKeywords = data.keywords
      const L = oldKeywords.length
      const M = newKeywords.length
      let idx = 0
      let idx1 = 0
      let idx2 = 0
      // assuming, that new keywords are given in the same order as the old ones
      // only with some items added, removed or updated
      while (idx1 < L || idx2 < M) {
        const kwd1 = oldKeywords[idx1]
        const kwd2 = newKeywords[idx2]
        if (idx1 >= L) {
          // append remaining new keywords
          const kwd = tx.create(kwd2)
          documentHelpers.append(tx, [keywordGroup.id, 'keywords'], kwd.id)
          idx++
          idx2++
        } else if (idx2 >= M) {
          // remove remaining old keywords
          documentHelpers.removeAt(tx, [keywordGroup.id, 'keywords'], idx)
          documentHelpers.deepDeleteNode(tx, kwd1.id)
          idx1++
        } else {
          // update an existing keyword if needed
          if (kwd1.id === kwd2.id) {
            if (kwd1.content !== kwd2.content) {
              kwd1.set('content', kwd2.content)
            }
            idx++
            idx1++
            idx2++
          } else {
            const kwd = tx.create(kwd2)
            documentHelpers.insertAt(tx, [keywordGroup.id, 'keywords'], idx, kwd.id)
            idx++
            idx2++
          }
        }
      }
    })
  }

  insertKeywordGroupAfter (panelId, keywordGroupData, currentKeywordGroupId) {
    const doc = this.getDocument()
    const panel = doc.get(panelId)
    let insertPos = panel.keywords.length
    if (currentKeywordGroupId) {
      const currentKeywordGroup = doc.get(currentKeywordGroupId)
      insertPos = currentKeywordGroup.getPosition() + 1
    }
    this.editorSession.transaction(tx => {
      const newKwdGroup = documentHelpers.createNodeFromJson(tx, keywordGroupData)
      documentHelpers.insertAt(tx, [panel.id, 'keywords'], insertPos, newKwdGroup.id)
      this._selectItem(tx, newKwdGroup)
    })
  }

  addResource (data) {
    return this.insertResourceAfter(data)
  }

  insertResourceAfter (data, currentFileId) {
    const doc = this.getDocument()
    const root = doc.root
    let insertPos = root.resources.length
    if (currentFileId) {
      const currentFileNode = doc.get(currentFileId)
      insertPos = currentFileNode.getPosition() + 1
    }
    const nodeData = Object.assign({ type: 'resource', legend: [{ type: 'paragraph' }] }, data)
    this.editorSession.transaction(tx => {
      const node = documentHelpers.createNodeFromJson(tx, nodeData)
      documentHelpers.insertAt(tx, [root.id, 'resources'], insertPos, node.id)
      this._selectItem(tx, node)
    })
  }

  attachFile (panelId, fileId) {
    this.editorSession.transaction(tx => {
      documentHelpers.append(tx, [panelId, 'files'], fileId)
      this._selectValue(tx, panelId, 'files', fileId)
    })
  }

  updateAttachedResources (panelId, attachedResourceIds) {
    const ids = Array.from(attachedResourceIds)
    const doc = this.getDocument()
    const panel = doc.get(panelId)
    if (!isArrayEqual(panel.resources, ids)) {
      // TODO: let this change be more incremental, i.e. adding, removing and later maybe changing order
      this.editorSession.transaction(tx => {
        doc.set([panel.id, 'resources'], ids)
      })
    }
  }

  // TODO: I'd like to have a specific selection for 'many' type relationships (e.g. author affiliations, or figure panel files, etc.)
  // maybe this could be applied to 'children' type relationships, too (e.g. author, affiliation, etc.)
  selectValue (node, propertyName, valueId) {
    if (isString(node)) {
      node = this.getDocument().get(node)
    }
    this._selectValue(this.editorSession, node.id, propertyName, valueId)
  }

  _selectValue (tx, nodeId, propertyName, valueId) {
    tx.setSelection({
      type: 'custom',
      customType: 'value',
      nodeId: nodeId,
      data: {
        property: propertyName,
        valueId
      }
    })
  }
}
