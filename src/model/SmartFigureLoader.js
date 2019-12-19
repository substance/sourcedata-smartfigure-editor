import SmartFigureSchema from './SmartFigureSchema'

export default class SmartFigureLoader {
  load (xmlData, context) {
    const schema = SmartFigureSchema()
    const doc = schema.createDocumentInstance()
    return doc.fromXml(xmlData, context)
  }
}
