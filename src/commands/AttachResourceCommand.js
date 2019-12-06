import { $$, Command } from 'substance'
import AttachResourceModal from '../components/AttachResourceModal'

export default class AttachResourceCommand extends Command {
  getCommandState (params, context) {
    const sel = params.selection
    const selectionState = params.selectionState
    const node = selectionState.node
    if (node && node.type === 'panel') {
      return {
        disabled: false,
        currentItemId: sel.nodeId
      }
    } else {
      return {
        disabled: true
      }
    }
  }

  execute (params, context) {
    const { currentItemId } = params.commandState
    const editorSession = context.editorSession
    const doc = editorSession.getDocument()
    const panel = doc.get(currentItemId)
    const api = context.api
    return editorSession.getRootComponent().send('requestModal', () => {
      return $$(AttachResourceModal, { node: panel })
    }).then(modal => {
      if (!modal) return
      const selectedId = modal.state.selectedId
      api.attachResource(currentItemId, selectedId)
    })
  }
}
