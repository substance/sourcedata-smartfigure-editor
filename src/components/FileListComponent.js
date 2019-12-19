import { $$, PropertyComponent } from 'substance'
import FileComponent from './FileComponent'
import Heading from './Heading'

export default class FileListComponent extends PropertyComponent {
  getPath () {
    return [this.props.document.root.id, 'files']
  }

  render () {
    const { document } = this.props
    const root = document.root
    const el = $$('div', { class: 'sc-file-list' })
    if (root.files && root.files.length > 0) {
      const files = root.resolve('files')
      el.append(
        $$(Heading, { level: 2 }, 'Files')
          .setAttribute('data-section', 'files')
      )
      el.append(
        $$('div', { class: 'se-files' },
          ...files.map(fileNode => {
            return $$(FileComponent, { node: fileNode }).ref(fileNode.id)
          })
        )
      )
    }
    return el
  }
}
