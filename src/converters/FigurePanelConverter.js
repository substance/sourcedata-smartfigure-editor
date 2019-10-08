import { findChild, retainChildren, getLabel } from 'substance-texture'

export default class FigurePanelConverter {
  get type () { return 'figure-panel' }

  // ATTENTION: figure-panel is represented in JATS
  // instead there is the distinction between fig-group and fig
  // which are represented as Figure in Texture
  get tagName () { return 'fig' }

  import (el, node, importer) {
    const $$ = el.createElement.bind(el.getOwnerDocument())
    const doc = importer.getDocument()

    const labelEl = findChild(el, 'label')
    const graphicEl = findChild(el, 'graphic')
    let captionEl = findChild(el, 'caption')
    // Preparations
    if (!captionEl) {
      captionEl = $$('caption')
    }
    let titleEl = findChild(captionEl, 'title')
    if (!titleEl) {
      titleEl = $$('title')
    }
    // drop everything than 'p' from caption
    retainChildren(captionEl, 'p')
    // there must be at least one paragraph
    if (!captionEl.find('p')) {
      captionEl.append($$('p'))
    }
    // Conversion
    if (labelEl) {
      node.label = labelEl.text()
    }
    // content is optional
    if (graphicEl) {
      node.image = importer.convertElement(graphicEl).id
    }
    // Note: we are transforming capton content to legend property
    node.legend = captionEl.children.map(child => importer.convertElement(child).id)

    // Custom Metadata Fields
    const kwdGroupEls = el.findAll('kwd-group')
    node.metadata = kwdGroupEls.map(kwdGroupEl => {
      const kwdEls = kwdGroupEl.findAll('kwd')
      const labelEl = kwdGroupEl.find('label')
      const name = labelEl ? labelEl.textContent : ''
      const value = kwdEls.map(kwdEl => kwdEl.textContent).join(', ')
      return doc.create({
        type: 'metadata-field',
        name,
        value
      }).id
    })
  }

  export (node, el, exporter) {
    const $$ = exporter.$$
    const label = getLabel(node)
    if (label) {
      el.append($$('label').text(label))
    }
    // Attention: <title> is part of the <caption>
    // Note: we are transforming the content of legend to <caption>
    if (node.title || node.legend) {
      const legend = node.resolve('legend')
      const captionEl = $$('caption')
      if (legend.length > 0) {
        captionEl.append(
          legend.map(p => exporter.convertNode(p))
        )
      }
      if (node.title) {
        captionEl.insertAt(0,
          $$('title').append(
            exporter.annotatedText([node.id, 'title'])
          )
        )
      }
      el.append(captionEl)
    }
    // Custom Metadata Fields
    if (node.metadata.length > 0) {
      const kwdGroupEls = node.resolve('metadata').map(field => {
        const kwdGroupEl = $$('kwd-group').append(
          $$('label').text(field.name)
        )
        const kwdEls = field.value.split(',').map(str => {
          return $$('kwd').text(str.trim())
        })
        kwdGroupEl.append(kwdEls)
        return kwdGroupEl
      })
      el.append(kwdGroupEls)
    }
    if (node.image) {
      el.append(
        exporter.convertNode(node.resolve('image'))
      )
    }
  }
}
