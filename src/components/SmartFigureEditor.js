import {
  AbstractEditor, $$, domHelpers, parseKeyEvent, keys,
  EditorToolbar, Managed, ModalCanvas, Popover, FileSelect,
  AffiliationLabelManager, platform
} from 'substance'
import SmartFigureApi from '../model/SmartFigureApi'
import TwoColumnLayout from './TwoColumnLayout'
import SmartFigureComponent from './SmartFigureComponent'
import SmartFigureTOC from './SmartFigureTOC'
import _getContext from './_getContext'
import PanelLabelManager from './PanelLabelManager'
import FilesLabelManager from './FilesLabelManager'
import ResourcesLabelManager from './ResourcesLabelManager'

export default class SmartFigureEditor extends AbstractEditor {
  constructor (...args) {
    super(...args)

    this.handleActions({
      selectItem: this._selectItem,
      scrollTo: this._scrollTo,
      requestModal: this._openModal,
      requestPopover: this._requestPopover,
      releasePopover: this._releasePopover,
      closePopover: this._closePopover,
      requestFileSelect: this._openFileSelect
    })
  }

  didMount () {
    super.didMount()

    this._labelManagers = [
      new AffiliationLabelManager(this.editorSession),
      new FilesLabelManager(this.editorSession),
      new PanelLabelManager(this.editorSession),
      new ResourcesLabelManager(this.editorSession)
    ]

    const globalEventHandler = this.context.globalEventHandler
    if (globalEventHandler) {
      globalEventHandler.addEventListener('keydown', this._onKeydown, this)
    }

    this._updateLabels()
  }

  dispose () {
    super.dispose()

    for (const labelManager of this._labelManagers) {
      labelManager.dispose()
    }

    const globalEventHandler = this.context.globalEventHandler
    if (globalEventHandler) {
      globalEventHandler.removeEventListener(this)
    }
  }

  render () {
    const document = this.document
    const { isMobile } = this.props

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
        },
        getScrollable: () => {
          return this.refs.scrollable.getElement()
        }
      }).ref('popover'),
      $$(FileSelect, {}).ref('fileSelect'),
      $$(ModalCanvas, { isMobile }).ref('modalCanvas')
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

  _updateLabels () {
    for (const labelManager of this._labelManagers) {
      labelManager.update()
    }
    this.editorState.propagateUpdates()
  }

  _getScrollableElement () {
    return this.refs.scrollable.getElement()
  }

  _scrollTo (params, options) {
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
      super._scrollElementIntoView(el, options)
    }
  }

  _selectItem (panel) {
    this.api.selectItem(panel)
  }

  _openModal (renderModal) {
    const modalCanvas = this.refs.modalCanvas
    return modalCanvas.openModal(renderModal)
  }

  _requestPopover (params) {
    return this.refs.popover.acquire(params)
  }

  _releasePopover (requester) {
    return this.refs.popover.release(requester)
  }

  _closePopover () {
    return this.refs.popover.close()
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
          content: menuSpec,
          position: 'relative'
        })
      }
    }
  }

  _onKeydown (event) {
    if (super.handleKeydown(event)) return

    let handled = false
    const combo = parseKeyEvent(event)
    switch (combo) {
      case String(keys.ESC): {
        handled = this._handleEscape()
        break
      }
      case String(keys.ENTER): {
        handled = this._handleEnter()
        break
      }
      // only used under OSX
      case `META+${keys.BACKSPACE}`: {
        if (platform.isMac) {
          handled = this._handleDelete()
        }
        break
      }
      case String(keys.DELETE): {
        handled = this._handleDelete()
        break
      }
      case String(keys.UP): {
        handled = this._handleUp()
        break
      }
      case `ALT+${keys.UP}`: {
        handled = this._handleAltUp()
        break
      }
      case String(keys.DOWN): {
        handled = this._handleDown()
        break
      }
      case `ALT+${keys.DOWN}`: {
        handled = this._handleAltDown()
        break
      }
      case String(keys.LEFT): {
        handled = this._handleLeft()
        break
      }
      case String(keys.RIGHT): {
        handled = this._handleRight()
        break
      }
    }
    if (handled) {
      domHelpers.stopAndPrevent(event)
    }
  }

  _handleEscape () {
    // TODO: only close popover if it is open
    // otherwise we could try this for escaping out from a selection within
    // an item/node, e.g. within panel's legend
    this._closePopover()
    return true
  }

  _handleEnter () {
    const sel = this.editorState.selection
    const selectionState = this.editorState.selectionState
    if (sel) {
      if (sel.customType === 'node') {
        const node = selectionState.node
        switch (node.type) {
          case 'author':
          case 'affiliation':
          case 'keyword-group':
          case 'file': {
            return this.editorSession.executeCommand(`edit-${node.type}`)
          }
          default:
            // nothing
        }
      } else if (sel.customType === 'value') {
        // TODO: maybe jump to ref'd item?
        // this.api.selectItem(sel.data.valueId)
      }
    }
  }

  _handleDelete () {
    const sel = this.editorState.selection
    if (sel) {
      if (sel.customType === 'node') {
        this.api.removeAndDeleteNode(sel.nodeId)
        return true
      } else if (sel.customType === 'value') {
        this.api.removeItem([sel.nodeId, sel.data.property], sel.data.valueId)
        return true
      }
    }
  }

  _handleUp () {

  }

  _handleAltUp () {
    const sel = this.editorState.selection
    if (sel) {
      if (sel.customType === 'node') {
        this.api.moveNode(sel.nodeId, 'up')
        return true
      } else if (sel.customType === 'value') {
        this.api.moveItem([sel.nodeId, sel.data.property], sel.data.valueId, 'up')
        return true
      }
    }
  }

  _handleDown () {

  }

  _handleAltDown () {
    const sel = this.editorState.selection
    if (sel) {
      if (sel.customType === 'node') {
        this.api.moveNode(sel.nodeId, 'down')
        return true
      } else if (sel.customType === 'value') {
        this.api.moveItem([sel.nodeId, sel.data.property], sel.data.valueId, 'down')
        return true
      }
    }
  }

  _handleLeft () {

  }

  _handleRight () {

  }
}
