import { $$, PropertyComponent, SelectableNodeComponent, renderProperty, domHelpers } from 'substance'

export default class AttachedFilesComponent extends PropertyComponent {
  getPath () {
    return [this.props.node.id, 'files']
  }

  render () {
    const { node } = this.props
    const el = $$('div', { class: 'sc-attached-files' })
    if (node.files && node.files.length > 0) {
      const files = node.resolve('files')
      el.append(
        ...files.map(fileNode => {
          return $$(AttachedFileComponent, {
            node: fileNode,
            panel: node,
            onmousedown: this._onMousedown.bind(this, node, fileNode)
          }).ref(fileNode.id)
        })
      )
    }
    return el
  }

  _onMousedown (panel, fileNode, event) {
    domHelpers.stopAndPrevent(event)
    this.context.api.selectValue(panel, 'files', fileNode.id)
  }
}

class AttachedFileComponent extends SelectableNodeComponent {
  render () {
    const { node } = this.props
    const { selected } = this.state
    const el = $$('button', { class: 'sc-attached-file' })
    if (selected) el.addClass('sm-selected')
    el.append(
      $$('span', { class: 'se-src' }, node.src),
      ': ',
      renderProperty(this, node.getDocument(), [node.id, 'title'], { readOnly: true, inline: true })
    )
    return el
  }

  _isSelected (selectionState) {
    const sel = selectionState.selection
    const { panel, node } = this.props
    return (sel &&
      sel.isCustomSelection() &&
      sel.customType === 'value' &&
      sel.nodeId === panel.id &&
      sel.data.property === 'files' &&
      sel.data.valueId === node.id
    )
  }
}
