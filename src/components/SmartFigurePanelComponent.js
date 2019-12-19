import { SelectableNodeComponent, $$, domHelpers, renderProperty } from 'substance'
import Section from './Section'
import getLabel from './_getLabel'
import KeywordGroupComponent from './KeywordGroupComponent'
import AttachedFilesComponent from './AttachedFilesComponent'
import AttachedResourcesComponent from './AttachedResourcesComponent'

export default class FigurePanelComponent extends SelectableNodeComponent {
  didMount () {
    super.didMount()

    this.context.archive.getManifestSession().on('change', this._onManifestChange, this)
  }

  dispose () {
    super.dispose()

    this.context.archive.getManifestSession().off(this)
  }

  render () {
    const node = this.props.node
    const document = node.getDocument()

    const label = this._getLabel()

    const el = $$('div', { class: 'sc-smart-figure-panel', 'data-id': node.id })
    if (this.state.selected) {
      el.addClass('sm-selected')
    }

    el.append(
      $$(Section, { label })
    )

    el.append(
      renderProperty(this, document, [node.id, 'image'], { placeholder: 'placeholder.svg' }).ref('image')
    )

    el.append(
      $$(Section, { label: 'Legend' },
        renderProperty(this, document, [node.id, 'legend'], { placeholder: 'Enter legend' }).addClass('se-legend')
      )
    )

    if (node.keywords && node.keywords.length > 0) {
      const keywords = node.resolve('keywords')
      const keywordSection = $$(Section, { label: 'Keywords' })
      for (const keywordGroup of keywords) {
        keywordSection.append(
          $$(KeywordGroupComponent, { node: keywordGroup }).ref(keywordGroup.id)
        )
      }
      el.append(keywordSection)
    }

    if (node.files && node.files.length > 0) {
      el.append(
        $$(Section, { label: 'Files' },
          $$(AttachedFilesComponent, { node }).ref('attachedFiles')
        )
      )
    }

    if (node.resources && node.resources.length > 0) {
      el.append(
        $$(Section, { label: 'Resources' },
          $$(AttachedResourcesComponent, { node }).ref('attachedResources')
        )
      )
    }

    el.on('mousedown', this._onMousedown)

    return el
  }

  _getLabel () {
    const archive = this.context.archive
    const node = this.props.node
    const image = node.resolve('image')
    let label = getLabel(node)
    if (image) {
      const filename = archive.getFilename(image.src)
      if (filename) {
        label += ': ' + filename
      }
    }
    return label
  }

  _onMousedown (e) {
    domHelpers.stopAndPrevent(e)
    this.send('selectItem', this.props.node)
  }

  _onManifestChange (change) {
    const { node } = this.props
    const image = node.resolve('image')
    if (image && change.hasUpdated(image.src)) {
      this.rerender()
    }
  }
}
