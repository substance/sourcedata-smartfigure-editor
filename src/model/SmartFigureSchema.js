import { SchemaBuilder } from 'substance'
import PanelMixin from './PanelMixin'

export default function SmartFigureSchema () {
  const builder = new SchemaBuilder('smart-figure', 'SourceData')

  builder.nextVersion(v => {
    // smart-figure
    v.addNode('smart-figure', '@node', {
      title: {
        type: 'text',
        childTypes: ['italic', 'superscript', 'subscript']
      },
      panels: {
        type: 'children',
        childTypes: ['panel']
      },
      additionalInformation: {
        type: 'container',
        childTypes: ['paragraph'],
        defaultTextType: 'paragraph'
      }
    })
    // panel
    v.addNode('panel', '@node', {
      label: { type: 'string' },
      image: { type: 'child', childTypes: ['image'] },
      legend: {
        type: 'container',
        childTypes: ['paragraph'],
        defaultTextType: 'paragraph'
      },
      keywords: {
        type: 'children',
        childTypes: ['structured-keyword'],
        optional: true
      }
    }, { Mixin: PanelMixin })
    // image
    v.addNode('image', '@node', {
      mimetype: { type: 'string' },
      src: { type: 'string' }
    })
    // structured-keyword
    v.addNode('structured-keyword', '@node', {
      name: { type: 'string' },
      value: { type: 'children', childTypes: ['keyword'] }
    })
    v.addNode('keyword', '@text', {
      content: { type: 'string' }
    })

    // annotations
    const RICH_TEXT_ANNOS = ['bold', 'italic', 'link', 'subscript', 'superscript', 'strike']
    v.addNode('bold', '@annotation')
    v.addNode('italic', '@annotation')
    v.addNode('link', '@annotation', {
      href: 'string'
    })
    v.addNode('strike', '@annotation')
    v.addNode('subscript', '@annotation')
    v.addNode('superscript', '@annotation')
    // paragraph
    v.addNode('paragraph', '@text', {
      content: { type: 'text', childTypes: RICH_TEXT_ANNOS }
    })
  })

  const schema = builder.createSchema()
  // HACK: we still have to set documentSchema.defaultTextType
  schema._documentSchema.defaultTextType = 'paragraph'

  return schema
}
