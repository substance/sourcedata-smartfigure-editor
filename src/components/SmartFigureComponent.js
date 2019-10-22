import { Component, $$, renderProperty } from 'substance'
import Section from './Section'
import FigurePanelsComponent from './SmartFigurePanelsComponent'
import AuthorsListComponent from './AuthorsListComponent'

export default class SmartFigureComponent extends Component {
  render () {
    const { node } = this.props
    const doc = node.getDocument()

    const el = $$('div', { class: 'sc-smart-figure' })

    el.append(
      $$(Section, { name: 'title', label: 'Title' },
        // HACK: using style of sc-heading level 1
        renderProperty(this, doc, [node.id, 'title'], { placeholder: 'Untitled' }).addClass('sc-heading sm-level-1')
      )
    )

    el.append(
      $$(AuthorsListComponent, { node })
    )

    el.append(
      $$(Section, { name: 'panels', label: 'Panels' },
        $$(FigurePanelsComponent, { node })
      )
    )

    el.append(
      $$(Section, { name: 'additionalInformation', label: 'Additional Information' },
        // HACK: using style of sc-heading level 1
        renderProperty(this, doc, [node.id, 'additionalInformation'], { placeholder: 'Enter additional information' })
      )
    )

    return el
  }
}
