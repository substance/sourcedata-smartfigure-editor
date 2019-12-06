import { Command } from 'substance'

// TODO: move this into substance/commons
// however, there is already an ItemCommand which is similar a little but more general
export default class BasicItemCommand extends Command {
  getCommandState (params, context) {
    const type = this.getType()
    const sel = params.selection
    const selectionState = params.selectionState
    if (sel && sel.customType === 'node' && selectionState.node.type === type) {
      return {
        disabled: false,
        currentItemId: sel.nodeId
      }
    } else {
      return {
        disabled: true
      }
    }
  }

  getType () {
    throw new Error('This method is abstract')
  }
}
