import { Component, $$ } from 'substance'
import {
  renderProperty, ManuscriptSection, HideIfEmpty, AuthorsListComponent,
  ReferenceListComponent
} from 'substance-texture'
import FigureComponent from './SourceDataFigureComponent'

export default class FigurePackageComponent extends Component {
  render () {
    const document = this.context.editorState.document
    const el = $$('div', { class: 'sc-figure-package' })

    // front matter:
    // - title
    el.append(
      $$(ManuscriptSection, { name: 'title', label: this.getLabel('title-label') },
        renderProperty(this, document, ['article', 'title'], {
          placeholder: this.getLabel('title-placeholder')
        }).addClass('sm-title')
      )
    )

    // Authors
    const authorsPath = ['metadata', 'authors']
    el.append(
      $$(HideIfEmpty, { document, path: authorsPath },
        $$(ManuscriptSection, { name: 'authors', label: this.getLabel('authors-label') },
          $$(AuthorsListComponent, {
            path: authorsPath
          }).addClass('sm-authors')
        )
      )
    )

    // body (= figure)
    const figure = document.find('body > figure')
    el.append(
      $$(ManuscriptSection, { name: 'figure', label: this.getLabel('figure') },
        $$(FigureComponent, { node: figure })
      )
    )

    // Figure title
    // - panel overview (2 cols)
    // - panel cards
    // Figure footer (= legend of <fig-group>)

    // back matter
    // - Files

    // - References
    // References
    const referencesPath = ['article', 'references']
    el.append(
      $$(HideIfEmpty, { document, path: referencesPath },
        $$(ManuscriptSection, { name: 'references', label: this.getLabel('references-label') },
          $$(ReferenceListComponent, {
            path: referencesPath
          }).addClass('sm-references')
        )
      )
    )

    return el
  }
}
