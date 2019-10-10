import { $$ } from 'substance'
import { BasicArticleEditor } from 'substance-texture'
import FigurePackageTOC from './FigurePackageTOC'
import FigurePackageComponent from './FigurePackageComponent'
import FigurePackageAPI from '../FigurePackageAPI'

export default class FigurePackageEditor extends BasicArticleEditor {
  _initialize (props) {
    super._initialize(props)

    // extend ArticleAPI with FigurePackageAPI
    this.context.api.extend(FigurePackageAPI)

    // start the figure panel manager
    this.context.config.getServiceSync('figure-panel-manager', this.context)
  }

  getActionHandlers () {
    return Object.assign({}, super.getActionHandlers(), {
      selectPanel: this._selectPanel
    })
  }

  _getClass () {
    // NOTE: adding sc-manuscript-editor to inherit styles
    // TODO: we should tidy this up in Texture
    return 'sc-figure-package-editor sc-manuscript-editor sc-manuscript-view'
  }

  _renderTOC () {
    const document = this.props.editorSession.getDocument()
    return $$(FigurePackageTOC, { document }).ref('toc')
  }

  _renderManuscript () {
    const document = this.props.editorSession.getDocument()
    return $$(FigurePackageComponent, { document })
  }

  _selectPanel (panel) {
    const editorSession = this.context.editorSession
    editorSession.setSelection({
      type: 'custom',
      nodeId: panel.id,
      customType: 'panel'
    })
  }
}
