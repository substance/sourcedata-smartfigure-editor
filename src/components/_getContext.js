// Experimental
// Try to figure out what the best way is to determine context
export default function _getContext (selectionState) {
  const sel = selectionState.selection
  if (!sel || sel.isNull()) return null
  if (sel.isPropertySelection()) {
    return 'text'
  }
  if (selectionState.node) {
    return selectionState.node.type
  }
}
