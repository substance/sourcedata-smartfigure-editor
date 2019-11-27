import { Component, $$, renderProperty, AuthorsListComponent, AffiliationsListComponent } from 'substance'
import Section from './Section'
import FigurePanelsComponent from './SmartFigurePanelsComponent'
import FileListComponent from './FileListComponent'
import ResourceListComponent from './ResourceListComponent'

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

    // Authors & Affiliations
    el.append(
      $$('div', { class: 'se-authors-and-affiliations' },
        $$(AuthorsListComponent, { node }),
        $$(AffiliationsListComponent, { node })
      )
    )

    // Panels
    el.append(
      $$(Section, { name: 'panels', label: 'Panels' },
        $$(FigurePanelsComponent, { node })
      )
    )

    // Additional Information
    el.append(
      $$(Section, { name: 'additionalInformation', label: 'Additional Information' },
        // HACK: using style of sc-heading level 1
        renderProperty(this, doc, [node.id, 'additionalInformation'], { placeholder: 'Enter additional information' })
      )
    )

    // Panels
    el.append(
      $$(FileListComponent, { document: doc })
    )
    el.append(
      $$(ResourceListComponent, { document: doc })
    )

    return el
  }
}
