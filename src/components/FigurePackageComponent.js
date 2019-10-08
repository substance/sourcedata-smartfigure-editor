import { Component, $$ } from 'substance'
import {
  renderProperty, ManuscriptSection, HideIfEmpty, AuthorsListComponent,
  ReferenceListComponent
} from 'substance-texture'
import FigureComponent from './FigureComponent'

export default class FigurePackageComponent extends Component {
  render () {
    const document = this.context.editorState.document
    const figure = document.find('body > figure')

    const el = $$('div', { class: 'sc-figure-package' })

    // front matter:
    // - title
    el.append(
      $$(ManuscriptSection, { name: 'title', label: this.getLabel('title-label') },
        renderProperty(this, document, [figure.id, 'title'], {
          placeholder: 'Enter figure title'
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

    // Note: for now we decided not to show the abstract
    // const abstract = document.resolve(['article', 'abstract'])
    // const abstractPath = [abstract.id, 'content']
    // el.append(
    //   $$(HideIfEmpty, { document, path: abstractPath },
    //     $$(ManuscriptSection, { name: 'abstract', label: this.getLabel('abstract-label') },
    //       renderProperty(this, document, abstractPath, {
    //         name: 'abstract',
    //         placeholder: this.getLabel('abstract-placeholder')
    //       }).addClass('sm-abstract')
    //     )
    //   )
    // )

    el.append(
      $$(FigureComponent, { node: figure })
    )

    // Back matter

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
