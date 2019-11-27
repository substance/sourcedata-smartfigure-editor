import { $$ } from 'substance'
import BasicItemCommand from './_BasicItemCommand'
import AttachFileModal from '../components/AttachFileModal'

export default class AttachFileCommand extends BasicItemCommand {
  getType () {
    return 'panel'
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
      const attachedFileIds = new Set()
      for (const [id, entry] of modal.state.files.entries()) {
        if (entry.attached) {
          attachedFileIds.add(id)
        }
      }
      api.updateAttachedFiles(currentItemId, attachedFileIds)
    })
  }
}
