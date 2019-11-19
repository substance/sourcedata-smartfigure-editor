import { Command } from 'substance'

export default class BasicItemCommand extends Command {
  getCommandState (params, context) {
    const type = this.getType()
    const sel = params.selection
    if (sel && sel.customType === type) {
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
}
