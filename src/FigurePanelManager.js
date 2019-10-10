import { FigureManager } from 'substance-texture'

export default class FigurePanelManager extends FigureManager {
  static create (context) {
    const { editorSession, config } = context
    return new FigurePanelManager(editorSession, config.getValue('figure-label-generator'))
  }

  _detectAddRemoveCitable (op, change) {
    // in addition to figure add/remove the labels are affected when panels are added/removed or reordered
    return (op.val && op.val.type === 'figure-panel') || (op.path && op.path[1] === 'panels')
  }

  _computeTargetUpdates () {
    const panels = this._getContentElement().findAll('figure-panel')
    const records = {}
    let panelCounter = 1
    for (const panel of panels) {
      const id = panel.id
      const pos = [{ pos: 1 }, { pos: panelCounter }]
      const label = this.labelGenerator.getSingleLabel(pos)
      records[id] = { id, pos, label }
      panelCounter++
    }
    return records
  }
}
