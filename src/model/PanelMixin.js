export default function PanelMixin (_PanelNode) {
  return class Panel extends _PanelNode {
    getTemplate () {
      return {
        type: 'panel',
        image: { type: 'image' },
        legend: [{ type: 'paragraph' }],
        // NOTE: using the same keyword groups as in the present panel
        keywords: this.resolve('keywords').map(keywordGroup => {
          return {
            type: 'keyword-group',
            name: keywordGroup.name,
            keywords: [{ type: 'keyword', content: '' }]
          }
        })
      }
    }
  }
}
