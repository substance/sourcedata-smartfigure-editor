import { findChild, retainChildren } from 'substance-texture'

// ATTENTION: a SourceData figure is always stored as <fig-group>
// and panels as <fig>. The <caption> of the <fig-group> is used
// for additional information
export default class FigureConverter {
  get type () { return 'figure' }

  get tagName () { return 'fig-group' }

  import (el, node, importer) {
    const $$ = el.createElement.bind(el.getOwnerDocument())

    const captionEl = findChild(el, 'caption') || $$('caption')
    const titleEl = findChild(captionEl, 'title') || $$('title')
    const figEls = el.findAll('fig')
    // EXPERIMENTAL: using a table to store a custom layout
    const layoutEl = el.find('alternatives > table[content-type="layout"]')

    node.title = importer.annotatedText(titleEl, [node.id, 'title'])
    node.panels = figEls.map(child => importer.convertElement(child).id)

    // drop everything than 'p' from caption
    retainChildren(captionEl, 'p')
    // there must be at least one paragraph
    if (!captionEl.find('p')) {
      captionEl.append($$('p'))
    }
    node.additionalInformation = captionEl.children.map(child => importer.convertElement(child).id)

    if (layoutEl) {
      // strip content from td elements
      layoutEl.findAll('td').forEach(td => td.empty())
      node.layout = layoutEl.serialize()
    }
  }

  export (node, el, exporter) {
    const $$ = exporter.$$
    const doc = exporter.getDocument()
    el.attr('id', node.id)

    if (node.title || node.additionalInformation) {
      const captionEl = $$('caption')
      if (node.title) {
        captionEl.append(
          $$('title').append(
            exporter.annotatedText([node.id, 'title'])
          )
        )
      }
      const additionalInformation = node.resolve('additionalInformation')
      if (additionalInformation.length > 0) {
        captionEl.append(
          additionalInformation.map(p => exporter.convertNode(p))
        )
      }
      el.append(captionEl)
    }

    if (node.layout) {
      el.append(
        $$('alternatives').append(
          $$('table').attr('content-type', 'layout').setInnerXML(node.layout)
        )
      )
    }

    el.append(node.panels.map(id => exporter.convertNode(doc.get(id))))

    return el
  }
}
