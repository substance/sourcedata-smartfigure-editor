import { Component, $$ } from 'substance'
import FileComponent from './FileComponent'
import Section from './Section'

export default class FileListComponent extends Component {
  didMount () {
    const doc = this.props.document
    const root = doc.root
    this.context.editorState.addObserver(['document'], this.rerender, this, {
      document: {
        path: [root.id, 'files']
      },
      stage: 'render'
    })
  }

  dispose () {
    this.context.editorState.off(this)
  }

  render () {
    const { document } = this.props
    const root = document.root
    const el = $$('div', { class: 'sc-file-list' })
    if (root.files && root.files.length > 0) {
      const files = root.resolve('files')
      el.append(
        $$(Section, { name: 'files', label: 'Files' },
          ...files.map(fileNode => {
            return $$(FileComponent, { node: fileNode }).ref(fileNode.id)
          })
        )
      )
    }
    return el
  }
}
