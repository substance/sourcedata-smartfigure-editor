export default function PanelMixin (_PanelNode) {
  return class Panel extends _PanelNode {
    getTemplate () {
      const template = Panel.getTemplate()
      template.metadata = this.resolve('keywords').map(keyword => (
        { type: 'structured-keyword', name: keyword.name, value: '' }
      ))
      return template
    }

    static getTemplate () {
      return {
        type: 'panel',
        image: { type: 'image' },
        legend: [{ type: 'paragraph' }],
        metadata: [
          { type: 'metadata-field', name: 'Exp. System' },
          { type: 'metadata-field', name: 'Measured Variables' }
        ]
      }
    }
  }
}
