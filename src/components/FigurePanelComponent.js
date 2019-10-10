import { Component, $$, domHelpers } from 'substance'
import { renderProperty, getLabel } from 'substance-texture'

export default class FigurePanelComponent extends Component {
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
    const SectionLabel = this.getComponent('section-label')

    const el = $$('div', { class: 'sc-figure-panel', 'data-id': node.id })
    if (this.state.selected) {
      el.addClass('sm-selected')
    }

    el.append(
      $$(SectionLabel, { label: getLabel(node) })
    )

    el.append(
      renderProperty(this, document, [node.id, 'image'])
    )

    el.append(
      $$(SectionLabel, { label: 'Legend' }),
      renderProperty(this, document, [node.id, 'legend'], { placeholder: this.getLabel('legend-placeholder') }).addClass('se-legend')
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
