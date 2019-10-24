import { LATIN_LETTERS_UPPER_CASE } from 'substance'

export default class PanelLabelManager {
  constructor (editorSession) {
    this.editorSession = editorSession

    const doc = this.editorSession.getDocument()
    this.editorSession.getEditorState().addObserver(['document'], this._onPanelsChange, this, {
      stage: 'update',
      document: {
        path: [doc.root.id, 'panels']
      }
    })
  }

  dispose () {
    this.editorSession.getEditorState().removeObserver(this)
  }

  _onPanelsChange () {
    const doc = this.editorSession.getDocument()
    const panels = doc.root.resolve('panels')
    const stateUpdates = []
    for (let idx = 0; idx < panels.length; idx++) {
      const panel = panels[idx]
      const label = LATIN_LETTERS_UPPER_CASE.charAt(idx)
      stateUpdates.push([panel.id, { label }])
    }
    this.editorSession.updateNodeStates(stateUpdates, { silent: true })
  }
}
