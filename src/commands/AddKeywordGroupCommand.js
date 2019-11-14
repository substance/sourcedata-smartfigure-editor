import { $$ } from 'substance'
import BasicFigurePanelCommand from './_BasicFigurePanelCommand'
import KeywordGroupModal from '../components/KeywordGroupModal'

// NOTE: in the context of SourceData SmartFigures keyword groups are part of panels.
export default class AddKeywordGroupCommand extends BasicFigurePanelCommand {
  execute (params, context) {
    const commandState = params.commandState
    const editorSession = context.editorSession
    const api = context.api
    return editorSession.getRootComponent().send('requestModal', () => {
      return $$(KeywordGroupModal, {})
    }).then(modal => {
      if (!modal) return
      const data = modal.getData()
      data.keywords = data.keywords.filter(Boolean)
      const keywordGroupData = {
        type: 'keyword-group',
        name: data.name,
        keywords: data.keywords.map(kwd => {
          return { type: 'keyword', content: kwd }
        })
      }
      api.addPanelKeywordGroup(commandState.currentPanelId, keywordGroupData)
    })
  }
}
