import { CollectionItemLabelManager } from 'substance'

export default class CitationLabelManager extends CollectionItemLabelManager {
  getPath () {
    const doc = this.editorSession.getDocument()
    return [doc.root.id, 'references']
  }

  getItemLabel (item) {
    const references = item.resolve('references')
    const refLabels = references.map(ref => ref.label)
    refLabels.sort()
    return `[${refLabels.join(',')}]`
  }

  update () {
    const doc = this.editorSession.getDocument()

    // HACK: update labels for all citations
    const citations = doc.findAll('cite')
    const stateUpdates = citations.map(item => {
      const label = this.getItemLabel(item)
      return [item.id, { label }]
    })

    this.editorSession.updateNodeStates(stateUpdates, { silent: true })
  }
}
