import { Component, $$, domHelpers } from 'substance'
import getLabel from './_getLabel'

export default class AttachedToComponent extends Component {
  constructor (...args) {
    super(...args)

    this._relationshipIndex = this.props.document.getIndex('relationships')
    this._lastVersion = this._relationshipIndex.sha
  }

  didMount () {
    this.context.editorState.addObserver(['document'], this._onDocumentChange, this, { stage: 'render' })
  }

  dispose () {
    this.context.editorState.off(this)
  }

  render () {
    const { document, nodeId } = this.props
    const relationships = Array.from(this._relationshipIndex.get(nodeId))
    const el = $$('div', { class: 'sc-attached-to' })
    if (relationships.length > 0) {
      const items = relationships.map(targetId => {
        // ATTENTION: this assumes that we have ony Figure panels where files are attached to
        const target = document.get(targetId)
        const targetLabel = `Panel ${getLabel(target)}`
        return { id: targetId, label: targetLabel }
      })
      if (items.length > 1) {
        items.sort((a, b) => a.label.localeCompare(b.label))
      }
      el.append($$('span', { class: 'se-label' }, 'Attached to: '))
      for (const item of items) {
        el.append(
          $$('button', { class: 'se-panel-link' }, item.label).on('click', (e) => {
            domHelpers.stopAndPrevent(e)
            this.context.api.selectItem(item.id)
          }).ref(item.id)
        )
      }
    }
    return el
  }

  _onDocumentChange () {
    if (this._relationshipIndex.sha !== this._lastVersion) {
      this._lastVersion = this._relationshipIndex.sha
      this.rerender()
    }
  }
}
