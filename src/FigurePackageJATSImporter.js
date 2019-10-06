import { ArticleJATSImporter } from 'substance-texture'

export default class FigurePackageJATSImporter extends ArticleJATSImporter {
  import (jats, options) {
    const doc = super.import(jats, options)
    // TODO: do figure-package specific imports, such as special article attributes etc.
    return doc
  }
}
