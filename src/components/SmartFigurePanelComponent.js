import { Component, $$, domHelpers, renderProperty } from 'substance'
import Section from './Section'
import getLabel from './_getLabel'

export default class FigurePanelComponent extends Component {
  getInitialState () {
    const editorState = this.context.editorState
    const selectionState = editorState.selectionState
    const selected = (selectionState.node && selectionState.node.id === this.props.node.id)
    return {
      selected
    }
  }

  didMount () {
    const editorState = this.context.editorState
    if (editorState) {
      editorState.addObserver(['selectionState'], this._onSelectionChange, this, { stage: 'update' })
      editorState.addObserver(['selection'], this._rerenderIfSelectionChanged, this, { stage: 'render' })
    }
  }

  dispose () {
    const editorState = this.context.editorState
    if (editorState) {
      editorState.removeObserver(this)
    }
  }

  render () {
    const node = this.props.node
    const document = node.getDocument()

    const el = $$('div', { class: 'sc-smart-figure-panel', 'data-id': node.id })
    if (this.state.selected) {
      el.addClass('sm-selected')
    }

    el.append(
      $$(Section, { label: getLabel(node) })
    )

    el.append(
      renderProperty(this, document, [node.id, 'image']).ref('image')
    )

    el.append(
      $$(Section, { label: 'Legend' }),
      renderProperty(this, document, [node.id, 'legend'], { placeholder: 'Enter legend' }).addClass('se-legend')
    )

    el.on('click', this._onClick)

    return el
  }

  _onClick (e) {
    domHelpers.stopAndPrevent(e)
    this.send('selectPanel', this.props.node)
  }

  _onSelectionChange (selectionState) {
    const selectedNode = selectionState.node
    if (this.state.selected) {
      if (!selectedNode || selectedNode !== this.props.node) {
        this._newSelectionState = { selected: false }
      }
    } else {
      if (selectedNode === this.props.node) {
        this._newSelectionState = { selected: true }
      }
    }
  }

  _rerenderIfSelectionChanged () {
    if (this._newSelectionState) {
      this.extendState(this._newSelectionState)
      this._newSelectionState = null
    }
  }
}
