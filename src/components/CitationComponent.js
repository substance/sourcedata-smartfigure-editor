import { AnnotationComponent } from 'substance'

// NOTE: this should be an inline node

export default class CitationComponent extends AnnotationComponent {
  render () {
    const node = this.props.node
    const el = super.render()
    el.addClass('sc-citation')

    if (node.target && node.target.length > 0) {
      const references = node.resolve('target')
      const refLabels = references.map(ref => ref.label)
      refLabels.sort()
      el.append(
        `[${refLabels.join(',')}]`
      )
    }

    return el
  }
}
