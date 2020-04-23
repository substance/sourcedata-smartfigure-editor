export default function getLabel (node) {
  if (!node) return ''

  let label = node.label
  if (node && node.state) {
    label = node.state.label || label
  }
  return label
}
