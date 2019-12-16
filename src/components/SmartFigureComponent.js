import { Component, $$, renderProperty, AuthorsListComponent, AffiliationsListComponent } from 'substance'
import FigurePanelsComponent from './SmartFigurePanelsComponent'
import FileListComponent from './FileListComponent'
import ResourceListComponent from './ResourceListComponent'
import Heading from './Heading'

export default class SmartFigureComponent extends Component {
  render () {
    const { node } = this.props
    const doc = node.getDocument()
    const el = $$('div', { class: 'sc-smart-figure' })

    el.append(
      // HACK: using style of sc-heading level 1
      // HACK: using data-section manually to make it a TOC target
      renderProperty(this, doc, [node.id, 'title'], { placeholder: 'Enter Title' }).addClass('sc-heading sm-level-1')
        .setAttribute('data-section', 'title')
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
      $$(Heading, { level: 2 }, 'Panels')
        .setAttribute('data-section', 'panels'),
      $$(FigurePanelsComponent, { node })
    )

    // Additional Information
    el.append(
      $$(Heading, { level: 2 }, 'Additional Information')
        .setAttribute('data-section', 'additionalInformation'),
      renderProperty(this, doc, [node.id, 'additionalInformation'], { placeholder: 'Enter additional information' })
    )

    // Panels
    el.append(
      $$(Heading, { level: 2 }, 'Files')
        .setAttribute('data-section', 'files'),
      $$(FileListComponent, { document: doc })
    )
    el.append(
      $$(Heading, { level: 2 }, 'Resources')
        .setAttribute('data-section', 'resources'),
      $$(ResourceListComponent, { document: doc })
    )

    return el
  }
}
