import { $$, PropertyComponent, NodeComponent, renderProperty } from 'substance'

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
          return $$(AttachedFileComponent, { node: fileNode }).ref(fileNode.id)
        })
      )
    }
    return el
  }
}

class AttachedFileComponent extends NodeComponent {
  render () {
    const { node } = this.props
    return $$('div', { class: 'sc-attached-file' },
      $$('span', { class: 'se-src' }, node.src),
      ': ',
      renderProperty(this, node.getDocument(), [node.id, 'title'], { readOnly: true, inline: true })
    )
  }
}
