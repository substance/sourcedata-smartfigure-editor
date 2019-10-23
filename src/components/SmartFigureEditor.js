import {
  AbstractEditor, $$, EditorToolbar, Managed, domHelpers, ModalCanvas, Popover, FileSelect
} from 'substance'
import SmartFigureApi from '../model/SmartFigureApi'
import TwoColumnLayout from './TwoColumnLayout'
import SmartFigureComponent from './SmartFigureComponent'
import SmartFigureTOC from './SmartFigureTOC'
import _getContext from './_getContext'

export default class SmartFigureEditor extends AbstractEditor {
  constructor (...args) {
    super(...args)

    this.handleActions({
      selectItem: this._selectItem,
      scrollTo: this._scrollTo,
      requestModal: this._openModal,
      requestPopover: this._openPopover,
      releasePopover: this._releasePopover,
      requestFileSelect: this._openFileSelect
    })
  }

  render () {
    const document = this.document

    const el = $$('div', { class: 'sc-smart-figure-editor' },
      $$(Managed(EditorToolbar, 'commandStates')),
      $$(TwoColumnLayout, {},
        $$(SmartFigureTOC, { document }),
        $$('div', { class: 'se-smart-figure-editor-content' },
          $$(SmartFigureComponent, { node: document.root, editable: true })
        ).ref('scrollable')
      ),
      $$(Popover, {
        getContainer: () => {
          return this.getElement()
        }
      }).ref('popover'),
      $$(FileSelect, {}).ref('fileSelect'),
      $$(ModalCanvas).ref('modalCanvas')
    )
    // ATTENTION: hopefully this does not prevent any other default behavior
    // important not to preventDefault here, as otherwise native mouse stuff, like focussing is not working anymore
    el.on('mousedown', domHelpers.stop)
    el.on('contextmenu', this._onContextMenu)

    return el
  }

  _getDocumentType () {
    return 'smart-figure'
  }

  _createAPI (archive, editorSession) {
    return new SmartFigureApi(archive, editorSession)
  }

  _getScrollableElement () {
    return this.refs.scrollable.getElement()
  }

  _scrollTo (params) {
    let selector
    if (params.nodeId) {
      selector = `[data-id="${params.nodeId}"]`
    } else if (params.section) {
      selector = `[data-section="${params.section}"]`
    } else {
      throw new Error('Illegal argument')
    }
    const el = this._getScrollableElement().find(selector)
    if (el) {
      super._scrollElementIntoView(el)
    }
  }

  _selectItem (panel) {
    this.api.selectItem(panel)
  }

  _openModal (renderModal) {
    const modalCanvas = this.refs.modalCanvas
    return modalCanvas.openModal(renderModal)
  }

  _openPopover (params) {
    this.refs.popover.acquire(params)
  }

  _releasePopover (requester) {
    this.refs.popover.release(requester)
  }

  _openFileSelect (props) {
    const fileSelect = this.refs.fileSelect
    fileSelect.setProps(props)
    return fileSelect.selectFiles()
  }

  _onContextMenu (event) {
    domHelpers.stopAndPrevent(event)
    const selectionState = this.editorState.selectionState
    const context = _getContext(selectionState)
    if (context) {
      const menuSpec = this.context.config.getToolPanel(`context-menu:${context}`)
      if (menuSpec) {
        const desiredPos = { x: event.clientX, y: event.clientY + 10 }
        this.send('requestPopover', {
          requester: this,
          desiredPos,
          content: menuSpec
        })
      }
    }
  }
}
