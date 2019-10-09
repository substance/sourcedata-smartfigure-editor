import { $$ } from 'substance'
import { BasicArticleEditor } from 'substance-texture'
import FigurePackageTOC from './FigurePackageTOC'
import FigurePackageComponent from './FigurePackageComponent'

export default class FigurePackageEditor extends BasicArticleEditor {
  _getClass () {
    // NOTE: adding sc-manuscript-editor to inherit styles
    // TODO: we should tidy this up in Texture
    return 'sc-figure-package-editor sc-manuscript-editor sc-manuscript-view'
  }

  _renderTOC () {
    return $$(FigurePackageTOC).ref('toc')
  }

  _renderManuscript () {
    const document = this.props.editorSession.getDocument()
    return $$(FigurePackageComponent, { document })
  }
}
