import { nodeHelpers } from 'substance'

const { getLabel } = nodeHelpers

// FIXME: here are race conditions, because the ReferenceLabelManager is called later then this one
// TODO: instead of having two managers, we should merge
export default class CitationLabelManager {
  constructor (editorSession) {
    this.editorSession = editorSession

    this.initialize()
  }

  initialize () {
    const editorSession = this.editorSession
    const doc = editorSession.getDocument()
    editorSession.getEditorState().addObserver(['document'], this._onChange, this, {
      stage: 'update'
    })
    this._referencesPath = [doc.root.id, 'references']
  }

  getReferenceLabel (reference) {
    return `${reference.getPosition() + 1}`
  }

  getCitationLabel (cite) {
    const references = cite.resolve('references')
    const refLabels = references.map(ref => getLabel(ref))
    refLabels.sort()
    return `[${refLabels.join(',')}]`
  }

  update () {
    const doc = this.editorSession.getDocument()
    const references = doc.resolve(this._referencesPath)
    const citations = doc.findAll('cite')
    // first update references
    let stateUpdates = references.map(ref => {
      const label = this.getReferenceLabel(ref)
      return [ref.id, { label }]
    })
    if (stateUpdates.length > 0) {
      this.editorSession.updateNodeStates(stateUpdates, { silent: true })
    }
    // then update citations
    stateUpdates = citations.map(cite => {
      const label = this.getCitationLabel(cite)
      return [cite.id, { label }]
    })
    if (stateUpdates.length > 0) {
      this.editorSession.updateNodeStates(stateUpdates, { silent: true })
    }
  }

  _onChange (change) {
    // Note: if the reference list has changed, recompute all labels
    if (change.hasUpdated(this._referencesPath)) {
      this.update()
    // otherwise update the label for created citations (e.g. pasted, or after undo)
    // or when the citation has been updated
    } else {
      const ops = change.primitiveOps
      const stateUpdates = []
      // TODO: with the new op system, we should also try to generalize the API for writing listeners
      for (const op of ops) {
        if (
          (op.isCreate() && op.val.type === 'cite') ||
          (op.isSet() && op.path[1] === 'references')
        ) {
          const doc = this.editorSession.getDocument()
          const id = op.path[0]
          const cite = doc.get(id)
          if (cite) {
            stateUpdates.push([id, { label: this.getCitationLabel(cite) }])
          }
        }
      }
      if (stateUpdates.length > 0) {
        this.editorSession.updateNodeStates(stateUpdates, { silent: true })
      }
    }
  }
}
