import { findChild, retainChildren } from 'substance-texture'

// ATTENTION: a SourceData figure is always stored as <fig-group>
// and panels as <fig>. The <caption> of the <fig-group> is used
// for additional information
export default class FigureConverter {
  get type () { return 'figure' }

  get tagName () { return 'fig-group' }

  import (el, node, importer) {
    const $$ = el.createElement.bind(el.getOwnerDocument())

    const figEls = el.findAll('fig')
    const captionEl = findChild(el, 'caption') || $$('caption')
    const titleEl = findChild(captionEl, 'title') || $$('title')

    node.title = importer.annotatedText(titleEl, [node.id, 'title'])
    node.panels = figEls.map(child => importer.convertElement(child).id)

    // drop everything than 'p' from caption
    retainChildren(captionEl, 'p')
    // there must be at least one paragraph
    if (!captionEl.find('p')) {
      captionEl.append($$('p'))
    }
    node.additionalInformation = captionEl.children.map(child => importer.convertElement(child).id)
  }

  export (node, el, exporter) {
    const $$ = exporter.$$
    const doc = exporter.getDocument()
    el.attr('id', node.id)
    el.append(node.panels.map(id => exporter.convertNode(doc.get(id))))

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

    return el
  }
}
