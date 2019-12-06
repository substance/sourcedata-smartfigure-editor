import { $$, PropertyComponent, domHelpers } from 'substance'
import AttachedFileComponent from './AttachedFileComponent'

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
