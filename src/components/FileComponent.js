import { SelectableNodeComponent, $$, renderProperty, domHelpers } from 'substance'
import Section from './Section'
import getLabel from './_getLabel'

export default class FileComponent extends SelectableNodeComponent {
  didMount () {
    super.didMount()

    this.context.archive.getManifestSession().on('change', this._onManifestChange, this)
  }

  dispose () {
    super.dispose()

    this.context.archive.getManifestSession().off(this)
  }

  render () {
    const { node } = this.props
    const archive = this.context.archive
    const document = node.getDocument()
    const el = $$('div', { class: 'sc-file', 'data-id': node.id })
    if (this.state.selected) el.addClass('sm-selected')

    // card header
    el.append(
      $$(Section, { label: (getLabel(node) || 'File') + ': ' + archive.getFilename(node.src) })
    )

    el.append(
      $$(Section, { label: 'Title' },
        renderProperty(this, document, [node.id, 'title'], { placeholder: 'Enter title' }).addClass('se-title')
      )
    )
    el.append(
      $$(Section, { label: 'Legend' },
        renderProperty(this, document, [node.id, 'legend'], { placeholder: 'Enter legend' }).addClass('se-legend')
      )
    )

    el.on('mousedown', this._onMousedown)

    return el
  }

  _onMousedown (e) {
    domHelpers.stopAndPrevent(e)
    this.send('selectItem', this.props.node)
  }

  _onManifestChange (change) {
    const { node } = this.props
    if (change.hasUpdated(node.src)) {
      this.rerender()
    }
  }
}
