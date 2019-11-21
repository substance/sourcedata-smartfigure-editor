import { Component, $$, NodeComponent, renderProperty } from 'substance'

export default class AttachedFilesComponent extends Component {
  didMount () {
    const node = this.props.node
    this.context.editorState.addObserver(['document'], this.rerender, this, {
      document: {
        path: [node.id, 'files']
      },
      stage: 'render'
    })
  }

  dispose () {
    this.context.editorState.off(this)
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
    return $$('li', { class: 'sc-attached-file' },
      $$('span', { class: 'se-src' }, node.src),
      ': ',
      renderProperty(this, node.getDocument(), [node.id, 'title'], { disabled: true, readOnly: true, tagName: 'span' })
    )
  }
}
