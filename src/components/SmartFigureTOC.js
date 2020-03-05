import { Component, $$, domHelpers, PropertyComponent } from 'substance'
import LayoutedFigurePanels from './LayoutedFigurePanels'
import Section from './Section'

export default class SmartFigureTOC extends Component {
  render () {
    const document = this.props.document
    const root = document.root
    const el = $$('div', { class: 'sc-smart-figure-toc', oncontextmenu: this._onContextMenu })
    el.append(
      $$(_DynamicTOCItem, { doc: document, path: [root.id, 'title'], scrollTarget: { section: 'title' }, name: 'title' })
    )
    el.append(
      $$(_TOCItem, { scrollTarget: { section: 'panels' } },
        $$(Section, { name: 'panels', label: 'Panels' })
      )
    )
    el.append(
      $$(LayoutedFigurePanels, { node: root }).addClass('sm-plain')
    )
    el.append(
      $$(_TOCItem, { scrollTarget: { section: 'additionalInformation' } },
        $$(Section, { name: 'additionalInformation', label: 'Additional Information' })
      )
    )
    el.append(
      $$(_DynamicTOCItem, { doc: document, path: [root.id, 'files'], scrollTarget: { section: 'files' } },
        $$(Section, { name: 'files', label: 'Files' })
      )
    )
    el.append(
      $$(_DynamicTOCItem, { doc: document, path: [root.id, 'resources'], scrollTarget: { section: 'resources' } },
        $$(Section, { name: 'resources', label: 'Resources' })
      )
    )
    el.append(
      $$(_DynamicTOCItem, { doc: document, path: [root.id, 'references'], scrollTarget: { section: 'references' } },
        $$(Section, { name: 'references', label: 'References' })
      )
    )

    return el
  }

  _onContextMenu (event) {
    // disable context menu on TOC
    domHelpers.stopAndPrevent(event)
  }
}

class _TOCItem extends Component {
  render () {
    const el = $$('div', { class: 'se-toc-item' })
    el.append(this.props.children)
    el.on('click', this._onClick)
    return el
  }

  _onClick (e) {
    domHelpers.stopAndPrevent(e)
    this.send('scrollTo', this.props.scrollTarget, { force: true })
  }
}

class _DynamicTOCItem extends PropertyComponent {
  getPath () {
    return this.props.path
  }

  render () {
    const { children, doc, name, path } = this.props
    const el = $$('div', { class: 'se-toc-item' })
    const val = doc.get(path)
    if (!val || val.length === 0) {
      el.addClass('sm-empty')
    } else {
      if (children.length > 0) {
        el.append(children)
      } else {
        el.append(
          $$(Section, { label: val, name })
        )
      }
      el.on('click', this._onClick)
    }
    return el
  }

  _onClick (e) {
    domHelpers.stopAndPrevent(e)
    this.send('scrollTo', this.props.scrollTarget, { force: true })
  }
}
