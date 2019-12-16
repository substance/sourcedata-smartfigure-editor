import {
  Component, $$, DefaultDOMElement as DOMElement, HorizontalStack, Title,
  StackFill, platform, parseKeyEvent, parseKeyCombo, getQueryStringParam
} from 'substance'
import VfsStorageClient from 'substance/dar/VfsStorageClient'
import loadArchive from 'substance/dar/loadArchive'
import SmartFigureConfiguration from '../SmartFigureConfiguration'
import SourceDataLogo from './SourceDataLogo'
import SmartFigureEditor from './SmartFigureEditor'
import { domHelpers } from 'substance/dom'

const SAVE_COMBO = parseKeyEvent(parseKeyCombo('CommandOrControl+S'))

export default class SmartFigurePage extends Component {
  constructor (...args) {
    super(...args)

    const config = new SmartFigureConfiguration()
    // TODO: this should be generalized if we want to use this component in a different
    // embedding scenario
    const archiveId = getQueryStringParam('archiveId') || 'kitchen-sink'

    const vfsStorage = new VfsStorageClient(window.vfs, '/data/')
    const rawArchive = vfsStorage.read(archiveId)
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

    // mobile detection
    this.handleWindowSizeChange()
    if (platform.inBrowser) {
      DOMElement.wrap(window).addEventListener('resize', this.handleWindowSizeChange, { context: this })
    }

    // global keyboard events
    this.refs.editor.context.globalEventHandler.addEventListener('keydown', this._onKeydown, this)
  }

  dispose () {
    this.document.off(this)
    if (platform.inBrowser) {
      DOMElement.wrap(window).off(this)
    }
    this.refs.editor.context.globalEventHandler.removeEventListener(this)
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
    const { isMobile } = this.state
    return $$('div', { class: 'se-content' },
      $$(SmartFigureEditor, { archive, isMobile }).ref('editor')
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

  _onKeydown (event) {
    const combo = parseKeyEvent(event)
    switch (combo) {
      // ATTENTION: this is used for development only
      // i.e. when pressing CommandOrControl+S, we simulate a save, serializing the DAR to the console
      // TODO: disable or replace this if needed as a web-based editor
      case SAVE_COMBO: {
        domHelpers.stopAndPrevent(event)
        this.archive.save((err, update) => {
          if (err) {
            console.error(err)
          } else {
            const smartfigureUpdate = update.resources['smart-figure.xml']
            if (smartfigureUpdate) {
              const xmlDom = DOMElement.parseXML(smartfigureUpdate.data)
              console.log('Saved Document:')
              console.dirxml(xmlDom.el)
            }
          }
        })
        return true
      }
    }
  }
}
