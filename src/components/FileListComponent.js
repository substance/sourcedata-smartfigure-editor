import { $$, PropertyComponent } from 'substance'
import FileComponent from './FileComponent'
import Section from './Section'

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
