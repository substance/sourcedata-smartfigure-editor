import { ArticleJATSExporter } from 'substance-texture'

export default class FigurePackageJATSExporter extends ArticleJATSExporter {
  export (doc) {
    const result = super.export(doc)
    if (result.ok) {
      // TODO: do figure-package specific exports, such as special article attributes etc.
    }
    return result
  }
}
