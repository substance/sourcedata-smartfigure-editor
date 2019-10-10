import { Command } from 'substance'

export default class BasicFigurePanelCommand extends Command {
  getCommandState (params, context) {
    const sel = params.selection
    if (sel && sel.customType === 'panel') {
      return {
        disabled: false,
        currentPanelId: sel.nodeId
      }
    } else {
      return {
        disabled: true
      }
    }
  }
}
