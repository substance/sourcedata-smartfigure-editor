import { ArticleJATSExporter } from 'substance-texture'
import { SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID, SOURCE_DATA_DTD } from '../FigurePackageConstants'

export default class FigurePackageJATSExporter extends ArticleJATSExporter {
  export (doc) {
    const result = super.export(doc)
    if (result.ok) {
      result.jats.setDoctype('article', SOURCE_DATA_FIGURE_PACKAGE_PUBLIC_ID, SOURCE_DATA_DTD)
    }
    return result
  }
}
