import { $$, Command } from 'substance'
import AttachFileModal from '../components/AttachFileModal'

export default class AttachFileCommand extends Command {
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
      return $$(AttachFileModal, { node: panel })
    }).then(modal => {
      if (!modal) return
      const fileId = modal.state.selectedId
      if (fileId) {
        api.attachFile(currentItemId, fileId)
      }
    })
  }
}
