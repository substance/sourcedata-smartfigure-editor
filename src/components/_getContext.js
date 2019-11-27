// Experimental
// Try to figure out what the best way is to determine context
export default function _getContext (selectionState) {
  const sel = selectionState.selection
  if (!sel || sel.isNull()) return null
  if (sel.isPropertySelection()) {
    return 'text'
  }
  if (sel.isNodeSelection() || sel.customType === 'node') {
    return selectionState.node.type
  }
  if (sel.customType === 'value') {
    const { nodeType, property } = sel.data
    return `${nodeType}.${property}`
  }
}
