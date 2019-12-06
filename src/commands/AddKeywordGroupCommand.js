import { $$, Command } from 'substance'
import KeywordGroupModal from '../components/KeywordGroupModal'

export default class AddKeywordGroupCommand extends Command {
  getCommandState (params, context) {
    const selectionState = params.selectionState
    const node = selectionState.node
    if (node) {
      let panelId
      if (node.type === 'panel') {
        panelId = node.id
      } else if (node.type === 'keyword-group') {
        panelId = node.getParent().id
      }
      if (panelId) {
        return {
          disabled: false,
          panelId
        }
      }
    }
    return {
      disabled: true
    }
  }

  execute (params, context) {
    const { panelId } = params.commandState
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
          return { type: 'keyword', id: kwd.id, content: kwd.content }
        })
      }
      api.addKeywordGroup(panelId, keywordGroupData)
    })
  }
}
