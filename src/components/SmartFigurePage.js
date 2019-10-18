import {
  Component, $$, HorizontalStack, Title, StackFill
} from 'substance'
import VfsStorageClient from 'substance/dar/VfsStorageClient'
import loadArchive from 'substance/dar/loadArchive'
import SmartFigureConfiguration from '../SmartFigureConfiguration'
import SourceDataLogo from './SourceDataLogo'
import SmartFigureEditor from './SmartFigureEditor'

export default class SmartFigurePage extends Component {
  constructor (...args) {
    super(...args)

    const config = new SmartFigureConfiguration()
    // TODO: this should be generalized if we want to use this component in a different
    // embedding scenario
    const vfsStorage = new VfsStorageClient(window.vfs, '/data/')
    const rawArchive = vfsStorage.read('kitchen-sink')
    const archive = loadArchive(rawArchive, config)

    this.config = config
    this.archive = archive

    const document = this.archive.getDocument('smart-figure')
    this.document = document

    this.context = {
      config,
      archive
    }
  }

  didMount () {
    this.document.on('document:changed', this._onDocumentChange, this)
  }

  dispose () {
    this.document.off(this)
  }

  render () {
    return $$('body', { class: 'sc-smart-figure-page' },
      this.renderHeader(),
      this.renderContent()
    )
  }

  renderHeader () {
    return $$('div', { class: 'se-header' },
      $$(HorizontalStack, {},
        $$(SourceDataLogo),
        $$(Title, {}, this._getTitle()).ref('title'),
        $$(StackFill)
      )
    )
  }

  renderContent () {
    const archive = this.archive
    return $$('div', { class: 'se-content' },
      $$(SmartFigureEditor, { archive })
    )
  }

  _getTitle () {
    return this.document.root.title
  }

  _onDocumentChange (change) {
    if (change.hasUpdated([this.document.root.id, 'title'])) {
      this.refs.title.extendProps({ children: [this._getTitle()] })
    }
  }
}
