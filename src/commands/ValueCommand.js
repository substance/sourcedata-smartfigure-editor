import { Command } from 'substance'

export default class ValueCommand extends Command {
  getPropertySelector () {
    throw new Error('This method is abstract')
  }

  getCommandState (params) {
    const selectionState = params.selectionState
    const sel = selectionState.selection
    const propSelector = this.getPropertySelector()
    if (sel && sel.customType === 'value') {
      if (`${selectionState.node.type}.${sel.data.property}` === propSelector) {
        return { disabled: false, nodeId: sel.nodeId, propertyName: sel.data.property, valueId: sel.data.valueId }
      }
    }
    return { disabled: true }
  }
}
