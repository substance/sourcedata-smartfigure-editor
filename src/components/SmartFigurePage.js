import {
  Component, $$, DOMElement, HorizontalStack, Title, StackFill, platform
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

  getInitialState () {
    return {
      isMobile: this._isMobile()
    }
  }

  didMount () {
    this.document.on('document:changed', this._onDocumentChange, this)
    this.handleWindowSizeChange()
    if (platform.inBrowser) {
      DOMElement.wrap(window).addEventListener('resize', this.handleWindowSizeChange, { context: this })
    }
  }

  dispose () {
    this.document.off(this)
    if (platform.inBrowser) {
      DOMElement.wrap(window).off(this)
    }
  }

  handleWindowSizeChange () {
    if (platform.inBrowser) {
      this.extendState({ isMobile: this._isMobile() })
    }
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

  _isMobile () {
    if (platform.inBrowser) {
      return window.innerWidth < 640
    } else {
      return false
    }
  }

  _onDocumentChange (change) {
    if (change.hasUpdated([this.document.root.id, 'title'])) {
      this.refs.title.extendProps({ children: [this._getTitle()] })
    }
  }
}
