import { DocumentNode, CHILD, CHILDREN, CONTAINER, STRING } from 'substance'

export default class FigurePanel extends DocumentNode {
  getContent () {
    const doc = this.getDocument()
    return doc.get(this.content)
  }

  static getTemplate () {
    return {
      type: 'figure-panel',
      content: { type: 'graphic' },
      legend: [{ type: 'paragraph' }],
      metadata: [
        { type: 'metadata-field', name: 'Exp. System' },
        { type: 'metadata-field', name: 'Measured Variables' }
      ]
    }
  }
}

FigurePanel.schema = {
  type: 'figure-panel',
  label: STRING,
  image: CHILD('graphic'),
  legend: CONTAINER({
    nodeTypes: ['paragaraph'],
    defaultTextType: 'paragraph'
  }),
  metadata: CHILDREN('metadata-field')
}
